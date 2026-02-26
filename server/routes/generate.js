import { Router } from 'express'
import { GoogleGenAI } from '@google/genai'
import { validateGenerateRequest } from '../middleware/validate.js'

const router = Router()

async function generateImage(ai, prompt, imageDataParts) {
  let retries = 3
  let delay = 2000

  while (retries > 0) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: [{
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
      if (err.status === 429 || err.status >= 500) {
        await new Promise(r => setTimeout(r, delay))
        delay *= 2
        continue
      }
      throw err
    }
  }
}

router.post('/generate', validateGenerateRequest, async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server API key not configured.' })
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    const { images, prompts, videoPrompt } = req.body

    // Prepare image parts for Gemini
    const imageDataParts = images.map((img) => ({
      inlineData: {
        data: img.data,
        mimeType: img.mimeType,
      }
    }))

    // Generate all images in parallel (max 4 concurrent)
    const batchSize = 4
    const allResults = []
    const errors = []

    for (let i = 0; i < prompts.length; i += batchSize) {
      const batch = prompts.slice(i, i + batchSize)
      const batchResults = await Promise.all(
        batch.map(prompt => generateImage(ai, prompt, imageDataParts).catch(err => {
          console.error('Image generation failed:', err.message)
          errors.push(err.message)
          return null
        }))
      )
      allResults.push(...batchResults)
    }

    const generatedImages = allResults
      .filter(Boolean)
      .map(r => `data:${r.mimeType};base64,${r.data}`)

    if (generatedImages.length === 0) {
      const errorMsg = errors.length > 0
        ? `All ${errors.length} image generation(s) failed: ${errors[0]}`
        : 'No images were generated'
      return res.status(500).json({ error: errorMsg })
    }

    // Generate video if requested
    let video = null
    if (videoPrompt) {
      try {
        const videoResult = await generateImage(ai, videoPrompt, imageDataParts)
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
    })
  } catch (err) {
    console.error('Generation error:', err)
    res.status(500).json({
      error: err.message || 'Generation failed. Please try again.',
    })
  }
})

export default router
