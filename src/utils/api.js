const API_BASE = '/api'

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new Error(err.error || `Request failed: ${res.status}`)
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
      responseModalities: ['IMAGE'],
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
