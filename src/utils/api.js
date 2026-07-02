const CLOUD_FUNCTION_URL = import.meta.env.VITE_CLOUD_FUNCTION_URL || ''

function createRequestSignal(timeoutMs = 90000, externalSignal) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort('timeout'), timeoutMs)

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort(externalSignal.reason)
    } else {
      externalSignal.addEventListener('abort', () => controller.abort(externalSignal.reason), { once: true })
    }
  }

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  }
}

export function getClientApiKey() {
  const localKey = typeof window !== 'undefined'
    ? (localStorage.getItem('ff_studio_api_key') || '').trim()
    : ''

  if (localKey) return localKey

  const envKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim()
  return envKey || ''
}

export function hasCloudFunction() {
  return !!CLOUD_FUNCTION_URL
}

/**
 * Call the Vertex AI Cloud Function proxy.
 * The Cloud Function handles auth via service account — no API key needed client-side.
 */
export async function vertexAICall(prompt, imageDataParts, options = {}) {
  const { signal: externalSignal, timeoutMs = 120000, model } = options

  let retries = 3
  let delay = 2000

  while (retries > 0) {
    const request = createRequestSignal(timeoutMs, externalSignal)
    let response
    try {
      response = await fetch(CLOUD_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, imageDataParts, model, options }),
        signal: request.signal,
      })
    } catch (e) {
      if (e?.name === 'AbortError') {
        const error = new Error(externalSignal?.aborted ? 'Generation canceled.' : 'Request timed out. Please try again.')
        error.code = externalSignal?.aborted ? 'REQUEST_ABORTED' : 'REQUEST_TIMEOUT'
        throw error
      }
      throw e
    } finally {
      request.clear()
    }

    const result = await response.json()

    if (result.error) {
      if (response.status === 429 && retries > 1) {
        retries--
        await new Promise(r => setTimeout(r, delay))
        delay *= 2
        continue
      }
      throw new Error(result.error)
    }

    if (!result.image) {
      throw new Error('No image generated')
    }

    return result.image
  }

  throw new Error('Max retries exceeded')
}

/**
 * Direct Gemini API call (fallback when no Cloud Function is configured).
 * Requires a client-side API key.
 */
export async function directGeminiCall(apiKey, prompt, imageDataParts, options = {}) {
  const { signal: externalSignal, timeoutMs = 90000, model } = options
  const selectedModel = model || 'gemini-2.5-flash-image-preview'
  const isImagen = selectedModel.includes('imagen-')
  const url = isImagen
    ? `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:predict`
    : `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent`

  const payload = isImagen
    ? {
        instances: [{
          prompt,
        }],
        parameters: {
          sampleCount: 1,
          aspectRatio: options.aspectRatio || '3:4',
          outputMimeType: 'image/jpeg',
        }
      }
    : {
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            ...imageDataParts,
          ]
        }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
          temperature: 0.35,
          topP: 0.9,
        },
        // Bug fix: safetySettings were missing from the direct client path
        safetySettings: [
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        ],
        // Bug fix: Search Grounding was silently ignored in direct mode
        ...(options.useSearchGrounding ? { tools: [{ googleSearch: {} }] } : {}),
      }

  let retries = 3
  let delay = 2000

  while (retries > 0) {
    const request = createRequestSignal(timeoutMs, externalSignal)
    let response
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(payload),
        signal: request.signal,
      })
    } catch (e) {
      if (e?.name === 'AbortError') {
        const error = new Error(externalSignal?.aborted ? 'Generation canceled.' : 'Request timed out. Please try again.')
        error.code = externalSignal?.aborted ? 'REQUEST_ABORTED' : 'REQUEST_TIMEOUT'
        throw error
      }
      throw e
    } finally {
      request.clear()
    }

    const result = await response.json()

    if (result.error) {
      if (result.error.code === 429 && retries > 1) {
        retries--
        await new Promise(r => setTimeout(r, delay))
        delay *= 2
        continue
      }
      throw new Error(result.error.message)
    }

    let base64
    if (isImagen) {
      base64 = result.predictions?.[0]?.bytesBase64Encoded
    } else {
      base64 = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data
    }

    if (!base64) {
      // Retryable: sporadic safety block or model hiccup (matches server behavior)
      if (retries > 1) {
        retries--
        await new Promise(r => setTimeout(r, delay))
        delay *= 2
        continue
      }
      throw new Error('No image generated')
    }

    return `data:image/jpeg;base64,${base64}`
  }

  throw new Error('Max retries exceeded')
}

/**
 * Lightweight garment detection via Flash Lite (text+vision → structured JSON).
 * Short timeout (10s), no retries — detection is best-effort.
 *
 * @param {string} apiKey - Gemini API key
 * @param {string} imageBase64 - Full data URI (data:image/...;base64,...)
 * @param {string} detectionPrompt - The prompt from buildDetectionPrompt()
 * @param {object} responseSchema - Optional structured output schema
 * @returns {Promise<object|null>} Parsed JSON or null on any failure
 */
export async function detectGarment(apiKey, imageBase64, detectionPrompt, responseSchema) {
  // Use the correct preview ID for flash-lite or fallback to a stable flash model
  const model = 'gemini-3.1-flash-lite'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg'
  const base64Data = imageBase64.split(',')[1]

  const generationConfig = {
    temperature: 0.1,
    maxOutputTokens: 512,
  }

  // Use structured output if schema provided
  if (responseSchema) {
    generationConfig.responseMimeType = 'application/json'
    generationConfig.responseSchema = responseSchema
  }

  const payload = {
    contents: [{
      role: 'user',
      parts: [
        { text: detectionPrompt },
        { inlineData: { mimeType, data: base64Data } },
      ],
    }],
    generationConfig,
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort('detection_timeout'), 10000)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    const result = await response.json()

    if (result.error) {
      console.warn('[detectGarment] API error:', result.error.message)
      return null
    }

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) return null

    try {
      return JSON.parse(text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim())
    } catch {
      console.warn('[detectGarment] Failed to parse response:', text)
      return null
    }
  } catch (err) {
    if (err?.name === 'AbortError' || err === 'detection_timeout') {
      console.warn('[detectGarment] Timed out after 10s')
    } else {
      console.warn('[detectGarment] Network error:', err.message)
    }
    return null
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Server-side garment detection via the backend proxy.
 * Falls back to null on any error.
 */
export async function detectGarmentViaServer(imageBase64) {
  const CLOUD_URL = import.meta.env.VITE_CLOUD_FUNCTION_URL || ''
  if (!CLOUD_URL) return null

  // Derive server base URL from cloud function URL
  const serverBase = CLOUD_URL.replace(/\/api\/generate\/?$/, '').replace(/\/+$/, '')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort('detection_timeout'), 12000)

  try {
    const response = await fetch(`${serverBase}/api/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 }),
      signal: controller.signal,
    })

    const result = await response.json()
    return result.detected || null
  } catch (err) {
    console.warn('[detectGarmentViaServer]', err.message || err)
    return null
  } finally {
    clearTimeout(timeout)
  }
}
