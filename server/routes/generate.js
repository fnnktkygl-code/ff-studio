import { Router } from 'express'
import { GoogleGenAI } from '@google/genai'
import { validateGenerateRequest } from '../middleware/validate.js'

const router = Router()

function normalizeErrorMessage(err) {
  if (!err) return ''
  if (typeof err.message === 'string') return err.message
  return String(err)
}

function getEmbeddedStatus(message) {
  try {
    const parsed = JSON.parse(message)
    return parsed?.error?.code || null
  } catch {
    return null
  }
}

function isRetriableError(err) {
  const status = err?.status || getEmbeddedStatus(normalizeErrorMessage(err))
  const message = normalizeErrorMessage(err).toLowerCase()
  return status === 429
    || status >= 500
    || message.includes('resource_exhausted')
    || message.includes('resource exhausted')
    || message.includes('too many requests')
}

function isRateLimitError(err) {
  const status = err?.status || getEmbeddedStatus(normalizeErrorMessage(err))
  const message = normalizeErrorMessage(err).toLowerCase()
  return status === 429
    || message.includes('resource_exhausted')
    || message.includes('resource exhausted')
    || message.includes('too many requests')
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function generateImage(ai, prompt, imageDataParts, model, maxRetries = 4) {
  let retries = maxRetries
  let delay = 2000

  while (retries > 0) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            ...imageDataParts,
          ]
        }],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        }
      })

      const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)
      if (!imagePart) {
        throw new Error('No image in response')
      }

      return {
        data: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType || 'image/jpeg',
      }
    } catch (err) {
      retries--
      if (retries === 0) throw err

      // Retry on rate limit or transient errors
      if (isRetriableError(err)) {
        const jitter = Math.floor(Math.random() * 500)
        await new Promise(r => setTimeout(r, delay + jitter))
        delay = Math.min(delay * 2, 8000)
        continue
      }
      throw err
    }
  }
}

function getApiKey() {
  // Support both GEMINI_API_KEY and GOOGLE_API_KEY (matches SDK behavior)
  const key = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim()
  return key || null
}

function isTruthy(value) {
  return ['1', 'true', 'yes', 'on'].includes((value || '').trim().toLowerCase())
}

router.post('/generate', validateGenerateRequest, async (req, res) => {
  const apiKey = getApiKey()
  const vertexProject = (process.env.GOOGLE_CLOUD_PROJECT || '').trim() || null
  const useVertexApiKey = isTruthy(process.env.GOOGLE_GENAI_USE_VERTEXAI)
  const vertexLocation = (process.env.GOOGLE_CLOUD_LOCATION || '').trim() || (useVertexApiKey ? 'global' : 'us-central1')
  const model = (process.env.GENERATION_MODEL || '').trim() || 'gemini-2.5-flash-image-preview'

  if (!apiKey && !vertexProject) {
    return res.status(500).json({ error: 'Server API key not configured. Set GEMINI_API_KEY or GOOGLE_API_KEY in environment variables.' })
  }

  try {
    const ai = apiKey
      ? new GoogleGenAI(useVertexApiKey
        ? { vertexai: true, apiKey, apiVersion: 'v1' }
        : { apiKey })
      : new GoogleGenAI({ vertexai: true, project: vertexProject, location: vertexLocation })
    const { images, prompts, videoPrompt } = req.body

    const vertexMaxPrompts = Math.max(1, Number(process.env.VERTEX_MAX_PROMPTS || 2))
    const vertexInterRequestDelayMs = Math.max(0, Number(process.env.VERTEX_INTER_REQUEST_DELAY_MS || 3000))
    const effectivePrompts = useVertexApiKey ? prompts.slice(0, vertexMaxPrompts) : prompts

    // Prepare image parts for Gemini
    const imageDataParts = images.map((img) => ({
      inlineData: {
        data: img.data,
        mimeType: img.mimeType,
      }
    }))

    // Vertex keys can be heavily rate-limited: use conservative concurrency there.
    const batchSize = useVertexApiKey ? 1 : 4
    const maxRetries = useVertexApiKey ? 4 : 3
    const allResults = []
    const errors = []
    let abortForRateLimit = false

    for (let i = 0; i < effectivePrompts.length; i += batchSize) {
      if (useVertexApiKey && i > 0 && vertexInterRequestDelayMs > 0) {
        await sleep(vertexInterRequestDelayMs)
      }

      const batch = effectivePrompts.slice(i, i + batchSize)
      const batchResults = await Promise.all(
        batch.map(prompt => generateImage(ai, prompt, imageDataParts, model, maxRetries).catch(err => {
          console.error('Image generation failed:', err.message)
          errors.push(err.message)
          if (isRateLimitError(err)) {
            abortForRateLimit = true
          }
          return null
        }))
      )
      allResults.push(...batchResults)

      // Avoid proxy timeouts: stop early when Vertex is actively rate-limiting.
      if (abortForRateLimit) {
        break
      }
    }

    const generatedImages = allResults
      .filter(Boolean)
      .map(r => `data:${r.mimeType};base64,${r.data}`)

    const allRateLimited = errors.length > 0 && errors.every((errorMsg) => {
      const lower = String(errorMsg).toLowerCase()
      return lower.includes('resource_exhausted')
        || lower.includes('resource exhausted')
        || lower.includes('too many requests')
        || lower.includes('"code":429')
    })

    if (generatedImages.length === 0) {
      if (allRateLimited) {
        return res.status(429).json({
          error: 'Rate limit reached on Vertex AI. Please retry in 1-2 minutes, or reduce generation frequency.',
          code: 'RATE_LIMITED',
        })
      }

      const errorMsg = errors.length > 0
        ? `All ${errors.length} image generation(s) failed: ${errors[0]}`
        : 'No images were generated'
      return res.status(500).json({ error: errorMsg })
    }

    // Generate video if requested
    let video = null
    if (videoPrompt) {
      try {
        const videoResult = await generateImage(ai, videoPrompt, imageDataParts, model)
        video = `data:${videoResult.mimeType};base64,${videoResult.data}`
      } catch (err) {
        console.error('Video generation failed:', err.message)
      }
    }

    res.json({
      success: true,
      images: generatedImages,
      video,
      count: generatedImages.length,
      limitedByQuota: useVertexApiKey && effectivePrompts.length < prompts.length,
    })
  } catch (err) {
    console.error('Generation error:', err)

    // Return proper status code for auth errors
    const status = err.status || 500
    const message = err.message || ''
    const isVertexApiKeyUnsupported = message.includes('API keys are not supported by this API')
      || message.includes('Expected OAuth2 access token')
    const isAuthError = status === 401 || status === 403 || isVertexApiKeyUnsupported
    const errorMessage = isAuthError
      ? (isVertexApiKeyUnsupported
        ? 'Authentication failed: this Vertex endpoint requires OAuth2 credentials (service account), not only an API key. Use a Gemini API key with GOOGLE_GENAI_USE_VERTEXAI=false, or configure GOOGLE_CLOUD_PROJECT + service account credentials for Vertex AI.'
        : `Authentication failed: ${message || 'Invalid API key'}. Check GEMINI_API_KEY/GOOGLE_API_KEY and GOOGLE_GENAI_USE_VERTEXAI.`)
      : message || 'Generation failed. Please try again.'

    res.status(isAuthError ? 401 : 500).json({
      error: errorMessage,
      authError: isAuthError,
      code: isVertexApiKeyUnsupported ? 'VERTEX_API_KEY_UNSUPPORTED' : undefined,
    })
  }
})

export default router
