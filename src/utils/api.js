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

export async function directGeminiCall(apiKey, prompt, imageDataParts, options = {}) {
  const { signal: externalSignal, timeoutMs = 90000 } = options
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`

  const payload = {
    contents: [{
      role: 'user',
      parts: [
        { text: prompt },
        ...imageDataParts,
      ]
    }],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    }
  }

  let retries = 3
  let delay = 2000

  while (retries > 0) {
    const request = createRequestSignal(timeoutMs, externalSignal)
    let response
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

    const base64 = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data
    if (!base64) {
      throw new Error('No image generated')
    }

    return `data:image/jpeg;base64,${base64}`
  }

  throw new Error('Max retries exceeded')
}
