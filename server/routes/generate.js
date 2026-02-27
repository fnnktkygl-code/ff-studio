import { Router } from 'express'
import { GoogleGenAI } from '@google/genai'
import crypto from 'crypto'
import { validateGenerateRequest } from '../middleware/validate.js'

const router = Router()

// Simple in-memory cache for generated images
// Stores up to 100 recent generations
const imageCache = new Map()
const MAX_CACHE_SIZE = 100

function generateCacheKey(prompt, images, model) {
  const hash = crypto.createHash('sha256')
  hash.update(prompt)
  hash.update(model || '')
  if (images && images.length) {
    images.forEach(img => {
      // Just hash a chunk of the base64 or exactly the base64 to be strict
      // We hash the full base64 data to ensure it's the exact same image
      hash.update(img.data || img.url || '')
    })
  }
  return hash.digest('hex')
}

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

function isModelUnavailableError(err) {
  const status = err?.status || getEmbeddedStatus(normalizeErrorMessage(err))
  const message = normalizeErrorMessage(err).toLowerCase()
  return status === 404
    || message.includes('not found')
    || message.includes('does not have access')
    || message.includes('model version')
    || message.includes('retired')
    || message.includes('deprecated')
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildModelCandidates(primaryModel) {
  const fallbackEnv = (process.env.MODEL_MIGRATION_FALLBACKS || '').trim()
  const envCandidates = fallbackEnv
    ? fallbackEnv.split(',').map((m) => m.trim()).filter(Boolean)
    : []

  const defaults = [
    'gemini-2.5-flash-image',
    'gemini-2.5-flash-image-preview',
  ]

  return [primaryModel, ...envCandidates, ...defaults]
    .filter(Boolean)
    .filter((model, index, arr) => arr.indexOf(model) === index)
}

async function generateImage(ai, prompt, imageDataParts, models, maxRetries = 4) {
  let lastErr = null

  for (const model of models) {
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
            ],
          }],
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        })

        const imagePart = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
        if (!imagePart) {
          throw new Error('No image in response')
        }

        return {
          data: imagePart.inlineData.data,
          mimeType: imagePart.inlineData.mimeType || 'image/jpeg',
          modelUsed: model,
        }
      } catch (err) {
        retries--
        lastErr = err

        if (retries === 0) {
          if (isModelUnavailableError(err)) break
          throw err
        }

        if (isRetriableError(err)) {
          const jitter = Math.floor(Math.random() * 500)
          await sleep(delay + jitter)
          delay = Math.min(delay * 2, 8000)
          continue
        }

        if (isModelUnavailableError(err)) break
        throw err
      }
    }
  }

  throw lastErr || new Error('All candidate models failed')
}

async function generateImageViaVertexApiKey(apiKey, prompt, imageDataParts, models, maxRetries = 4) {
  let lastErr = null

  for (const model of models) {
    let retries = maxRetries
    let delay = 2000

    while (retries > 0) {
      try {
        const url = `https://aiplatform.googleapis.com/v1/publishers/google/models/${model}:generateContent?key=${apiKey}`
        const payload = {
          contents: [{
            role: 'user',
            parts: [
              { text: prompt },
              ...imageDataParts,
            ],
          }],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const result = await response.json().catch(() => ({}))
        if (!response.ok || result.error) {
          const message = typeof result?.error?.message === 'string'
            ? result.error.message
            : `HTTP ${response.status}`
          const err = new Error(message)
          err.status = result?.error?.code || response.status
          throw err
        }

        const imagePart = result.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
        if (!imagePart) {
          throw new Error('No image in response')
        }

        return {
          data: imagePart.inlineData.data,
          mimeType: imagePart.inlineData.mimeType || 'image/jpeg',
          modelUsed: model,
        }
      } catch (err) {
        retries--
        lastErr = err

        if (retries === 0) {
          if (isModelUnavailableError(err)) break
          throw err
        }

        if (isRetriableError(err)) {
          const jitter = Math.floor(Math.random() * 500)
          await sleep(delay + jitter)
          delay = Math.min(delay * 2, 8000)
          continue
        }

        if (isModelUnavailableError(err)) break
        throw err
      }
    }
  }

  throw lastErr || new Error('All candidate models failed')
}

function getApiKey() {
  const key = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim()
  return key || null
}

function getVertexProject() {
  const envProject = (process.env.GOOGLE_CLOUD_PROJECT || '').trim()
  if (envProject) return envProject

  const inlineJson = (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '').trim()
  if (inlineJson) {
    try {
      const parsed = JSON.parse(inlineJson)
      if (parsed.project_id) return parsed.project_id
    } catch {
      // ignore JSON error, will be thrown in auth
    }
  }

  return null
}

async function getVertexAccessToken() {
  try {
    const { GoogleAuth } = await import('google-auth-library')

    // Support inline JSON credentials via env var (for Render/Heroku/etc.)
    const inlineJson = (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '').trim()
    let authOptions = { scopes: ['https://www.googleapis.com/auth/cloud-platform'] }

    if (inlineJson) {
      try {
        const parsed = JSON.parse(inlineJson)
        authOptions.credentials = parsed
      } catch {
        throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON is not valid JSON. Paste the full contents of your service account key file.')
      }
    }

    const auth = new GoogleAuth(authOptions)
    const client = await auth.getClient()
    const token = await client.getAccessToken()
    return token.token
  } catch (err) {
    console.error('Could not fetch Vertex OAuth token:', err.message)
    if (err.message.includes('GOOGLE_APPLICATION_CREDENTIALS_JSON')) throw err
    throw new Error('Video generation requires a Google Cloud service account. Set GOOGLE_APPLICATION_CREDENTIALS_JSON in your environment variables with the contents of your service account JSON key.')
  }
}

async function generateVideoViaVertexVeo(prompt, imageBase64, modelInput, vertexProject, resolution) {
  const model = modelInput || 'veo-2.0-generate-001';
  // Veo is ONLY available in us-central1 — never 'global'
  const veoLocation = 'us-central1';

  // Build an SDK client authenticated with service-account credentials
  const inlineJson = (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '').trim();
  if (!inlineJson) {
    throw new Error('Video generation requires GOOGLE_APPLICATION_CREDENTIALS_JSON to be set in your environment variables.');
  }

  let credentials;
  try {
    credentials = JSON.parse(inlineJson);
  } catch {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON is not valid JSON.');
  }

  // The @google/genai SDK handles auth via GOOGLE_APPLICATION_CREDENTIALS_JSON
  // when we set the env var. We temporarily set it as a path workaround OR
  // pass it via the vertexai options.
  const ai = new GoogleGenAI({
    vertexai: true,
    project: vertexProject,
    location: veoLocation,
    googleAuthOptions: { credentials },
  });

  // Step 1: submit the generation request (returns an Operation object)
  const params = {
    model,
    prompt,
    config: {
      aspectRatio: '9:16',
      personGeneration: 'allow_adult',
      durationSeconds: 8,
      numberOfVideos: 1,
      ...(resolution ? { resolution } : {}),
    },
  };

  if (imageBase64) {
    params.image = {
      imageBytes: imageBase64,
      mimeType: 'image/jpeg',
    };
  }

  console.log(`Veo starting generation with model: ${model}`);
  let operation = await ai.models.generateVideos(params);
  console.log(`Veo LRO started: ${operation.name}`);

  // Step 2: poll until done (max 3 minutes)
  const maxAttempts = 18; // 18 × 10s = 3 minutes
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await sleep(10000);
    operation = await ai.operations.getVideosOperation({ operation });
    console.log(`Veo LRO attempt ${attempt + 1}/${maxAttempts} — done: ${operation.done}`);
    if (operation.done) break;
  }

  if (!operation.done) {
    throw new Error('Video generation timed out after 3 minutes');
  }
  if (operation.error) {
    throw new Error(`Veo operation failed: ${JSON.stringify(operation.error)}`);
  }

  // The SDK returns a GCS URI or base64 bytes depending on config
  const generatedVideo = operation.response?.generatedVideos?.[0];
  if (!generatedVideo) {
    throw new Error('Veo returned done but no video found in response');
  }

  // If GCS URI is returned, we'd need to download it — but Vertex inline returns videoBytes
  const videoBytes = generatedVideo.video?.videoBytes || generatedVideo.videoBytes;
  if (!videoBytes) {
    throw new Error('Veo returned done but no video bytes in response. The video may have been stored to GCS instead.');
  }

  return {
    data: videoBytes,
    mimeType: 'video/mp4',
    modelUsed: model,
  };
}

function isTruthy(value) {
  return ['1', 'true', 'yes', 'on'].includes((value || '').trim().toLowerCase())
}

// Allowed model values that clients can request
const ALLOWED_CLIENT_MODELS = new Set([
  'gemini-2.5-flash-image',
  'gemini-2.5-flash-image-preview',
  'imagen-4-fast',
  'imagen-4',
  'imagen-4-ultra',
])

const ALLOWED_VIDEO_MODELS = new Set([
  'veo-3.1-generate-fast-001:1080p',
  'veo-3.1-generate-fast-001:4k',
  'veo-3.1-generate-001:1080p',
  'veo-3.1-generate-001:4k',
  // legacy bare IDs for backwards compat
  'veo-2.0-generate-001',
  'veo-3.0-generate-001',
  'veo-3.1-generate-001',
  'veo-3.1-generate-fast-001',
])

router.post('/generate', validateGenerateRequest, async (req, res) => {
  const apiKey = getApiKey()
  const vertexProject = getVertexProject()
  const useVertexApiKey = isTruthy(process.env.GOOGLE_GENAI_USE_VERTEXAI)
  const vertexLocation = (process.env.GOOGLE_CLOUD_LOCATION || '').trim() || (useVertexApiKey ? 'global' : 'us-central1')
  const envModel = (process.env.GENERATION_MODEL || '').trim() || 'gemini-2.5-flash-image'
  // Accept model from client request body (options.aiModel) if it's in the allow-list
  const clientModel = (req.body.options?.aiModel || '').trim()
  const model = (clientModel && ALLOWED_CLIENT_MODELS.has(clientModel)) ? clientModel : envModel
  const modelCandidates = buildModelCandidates(model)
  const rawVideoModel = (() => {
    const requested = (req.body.options?.videoModel || '').trim()
    return (requested && ALLOWED_VIDEO_MODELS.has(requested)) ? requested : 'veo-3.1-generate-fast-001:1080p'
  })()
  // Compound format is 'modelId:resolution' — split them out
  const [videoModelReq, videoResolutionReq] = rawVideoModel.includes(':')
    ? rawVideoModel.split(':')
    : [rawVideoModel, '1080p']

  if (!apiKey && !vertexProject) {
    return res.status(500).json({ error: 'Server API key not configured. Set GEMINI_API_KEY or GOOGLE_API_KEY in environment variables.' })
  }

  try {
    const useDirectVertexApiKey = useVertexApiKey && !!apiKey
    const ai = useDirectVertexApiKey
      ? null
      : (apiKey
        ? new GoogleGenAI({ apiKey })
        : new GoogleGenAI({ vertexai: true, project: vertexProject, location: vertexLocation }))

    const { images, prompts, videoPrompt } = req.body

    // If 'both' mode is selected, we need to process 8 prompts.
    // Allow up to 8 max prompts by default. Override via env if needed.
    const vertexMaxPrompts = Math.max(1, Number(process.env.VERTEX_MAX_PROMPTS || 8))
    const vertexInterRequestDelayMs = Math.max(0, Number(process.env.VERTEX_INTER_REQUEST_DELAY_MS || 3000))
    const effectivePrompts = useVertexApiKey ? prompts.slice(0, vertexMaxPrompts) : prompts

    const imageDataParts = images.map((img) => ({
      inlineData: {
        data: img.data,
        mimeType: img.mimeType,
      },
    }))

    const batchSize = useVertexApiKey ? 1 : 4
    const maxRetries = useVertexApiKey ? 4 : 3
    const allResults = []
    const errors = []
    let abortForRateLimit = false
    let modelUsed = null

    for (let i = 0; i < effectivePrompts.length; i += batchSize) {
      if (useVertexApiKey && i > 0 && vertexInterRequestDelayMs > 0) {
        await sleep(vertexInterRequestDelayMs)
      }

      const batch = effectivePrompts.slice(i, i + batchSize)
      const batchResults = await Promise.all(
        batch.map(async (prompt) => {
          const cacheKey = generateCacheKey(prompt, images, modelCandidates[0])
          const useCache = req.body.options?.useCache !== false

          if (useCache && imageCache.has(cacheKey)) {
            console.log(`Cache HIT for prompt: ${prompt.slice(0, 30)}...`)
            return imageCache.get(cacheKey)
          }

          console.log(`Cache MISS for prompt: ${prompt.slice(0, 30)}... Generating...`)
          try {
            const result = await (useDirectVertexApiKey
              ? generateImageViaVertexApiKey(apiKey, prompt, imageDataParts, modelCandidates, maxRetries)
              : generateImage(ai, prompt, imageDataParts, modelCandidates, maxRetries))

            // Store in cache
            if (result) {
              imageCache.set(cacheKey, result)
              if (imageCache.size > MAX_CACHE_SIZE) {
                // Remove oldest entry (first key in Map)
                const firstKey = imageCache.keys().next().value
                imageCache.delete(firstKey)
              }
            }
            return result
          } catch (err) {
            console.error('Image generation failed:', err.message)
            errors.push(err.message)
            if (isRateLimitError(err)) {
              abortForRateLimit = true
            }
            return null
          }
        })
      )

      const firstSuccess = batchResults.find(Boolean)
      if (firstSuccess?.modelUsed && !modelUsed) {
        modelUsed = firstSuccess.modelUsed
      }

      allResults.push(...batchResults)

      if (abortForRateLimit) {
        break
      }
    }

    const generatedImages = allResults
      .filter(Boolean)
      .map((r) => `data:${r.mimeType};base64,${r.data}`)

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

    let video = null
    let videoError = null
    if (videoPrompt && generatedImages.length > 0) {
      console.log('Generating video via Veo 2.0...')
      try {
        if (!vertexProject) {
          throw new Error('GOOGLE_CLOUD_PROJECT must be set to use Veo Video Generation API. Add it in your environment variables.')
        }

        const base64Ref = generatedImages[0].split(',')[1] || generatedImages[0];
        const videoResult = await generateVideoViaVertexVeo(
          videoPrompt,
          base64Ref,
          videoModelReq,
          vertexProject,
          videoResolutionReq
        );
        video = `data:${videoResult.mimeType};base64,${videoResult.data}`
        console.log('Video generated successfully.')
      } catch (err) {
        console.error('Video generation failed:', err.message)
        videoError = err.message || 'Video generation failed'
      }
    }

    res.json({
      success: true,
      images: generatedImages,
      video,
      videoError,
      count: generatedImages.length,
      limitedByQuota: useVertexApiKey && effectivePrompts.length < prompts.length,
      modelUsed: modelUsed || model,
    })
  } catch (err) {
    console.error('Generation error:', err)

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
