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

async function generateVideoViaVertexVeo(prompt, imageBase64, modelInput, vertexProject, vertexLocation) {
  const token = await getVertexAccessToken();
  const model = modelInput || 'veo-2.0-generate-001';
  // Veo is ONLY available in us-central1 — never 'global'
  const veoLocation = 'us-central1';
  const url = `https://${veoLocation}-aiplatform.googleapis.com/v1/projects/${vertexProject}/locations/${veoLocation}/publishers/google/models/${model}:predictLongRunning`;

  const payload = {
    instances: [
      {
        prompt: prompt,
      }
    ],
    parameters: {
      aspectRatio: '9:16',
      personGeneration: 'allow_adult',
      durationSeconds: 8,
    }
  };

  // Step 1: Submit long-running operation
  const submitRes = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const submitResult = await submitRes.json().catch(() => ({}));
  if (!submitRes.ok || submitResult.error) {
    const message = typeof submitResult?.error?.message === 'string'
      ? submitResult.error.message
      : `HTTP ${submitRes.status}`;
    const err = new Error(message);
    err.status = submitResult?.error?.code || submitRes.status;
    throw err;
  }

  // Step 2: Poll the operation until done (max 3 minutes)
  const operationName = submitResult.name;
  if (!operationName) {
    throw new Error('Veo API did not return an operation name');
  }
  console.log(`Veo LRO started: ${operationName}`);

  const pollUrl = `https://${veoLocation}-aiplatform.googleapis.com/v1/${operationName}`;
  const maxAttempts = 18; // 18 × 10s = 3 minutes
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await sleep(10000);
    const pollRes = await fetch(pollUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const pollResult = await pollRes.json().catch(() => ({}));
    if (!pollRes.ok || pollResult.error) {
      const message = typeof pollResult?.error?.message === 'string'
        ? pollResult.error.message : `Poll HTTP ${pollRes.status}`;
      throw new Error(message);
    }
    if (pollResult.done) {
      if (pollResult.error) {
        throw new Error(`Veo operation failed: ${JSON.stringify(pollResult.error)}`);
      }
      // Video bytes are in response.predictions[0].bytesBase64 or .videoBytes
      const videoBytes = pollResult.response?.predictions?.[0]?.bytesBase64
        || pollResult.response?.predictions?.[0]?.videoBytes;
      if (!videoBytes) {
        throw new Error('Veo returned done but no video bytes found');
      }
      return {
        data: videoBytes,
        mimeType: 'video/mp4',
        modelUsed: model,
      };
    }
    console.log(`Veo LRO attempt ${attempt + 1}/${maxAttempts} — still running...`);
  }
  throw new Error('Video generation timed out after 3 minutes');
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

router.post('/generate', validateGenerateRequest, async (req, res) => {
  const apiKey = getApiKey()
  const vertexProject = (process.env.GOOGLE_CLOUD_PROJECT || '').trim() || null
  const useVertexApiKey = isTruthy(process.env.GOOGLE_GENAI_USE_VERTEXAI)
  const vertexLocation = (process.env.GOOGLE_CLOUD_LOCATION || '').trim() || (useVertexApiKey ? 'global' : 'us-central1')
  const envModel = (process.env.GENERATION_MODEL || '').trim() || 'gemini-2.5-flash-image'
  // Accept model from client request body (options.aiModel) if it's in the allow-list
  const clientModel = (req.body.options?.aiModel || '').trim()
  const model = (clientModel && ALLOWED_CLIENT_MODELS.has(clientModel)) ? clientModel : envModel
  const modelCandidates = buildModelCandidates(model)
  const videoModelReq = (req.body.options?.videoModel || '').trim() || 'veo-2.0-generate-001'

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
        batch.map((prompt) => (
          useDirectVertexApiKey
            ? generateImageViaVertexApiKey(apiKey, prompt, imageDataParts, modelCandidates, maxRetries)
            : generateImage(ai, prompt, imageDataParts, modelCandidates, maxRetries)
        ).catch((err) => {
          console.error('Image generation failed:', err.message)
          errors.push(err.message)
          if (isRateLimitError(err)) {
            abortForRateLimit = true
          }
          return null
        }))
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
          vertexLocation
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
