const API_BASE = '/api'

export function getClientApiKey() {
  const localKey = typeof window !== 'undefined'
    ? (localStorage.getItem('ff_studio_api_key') || '').trim()
    : ''

  if (localKey) return localKey

  const envKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim()
  return envKey || ''
}

export async function apiPost(path, body) {
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    const error = new Error('Network error: could not reach server.')
    error.code = 'NETWORK_ERROR'
    error.status = 0
    throw error
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    const error = new Error(err.error || `Request failed: ${res.status}`)
    error.status = res.status
    error.code = err.code || null
    error.authError = !!err.authError
    throw error
  }

  return res.json()
}

export async function directGeminiCall(apiKey, prompt, imageDataParts) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`

  const payload = {
    contents: [{
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
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

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
