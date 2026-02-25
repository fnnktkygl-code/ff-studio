import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGenerationStore } from '../stores/generationStore'
import { apiPost, directGeminiCall } from '../utils/api'
import { buildAllPrompts } from '../utils/promptBuilder'
import { COST_PER_IMAGE, COST_PER_VIDEO_SECOND } from '../utils/constants'

const PROGRESS_MESSAGES = [
  'Analyzing your garment...',
  'Isolating the design...',
  'Composing the scene...',
  'Generating photos...',
  'Applying finishing touches...',
]

export function useGenerate() {
  const navigate = useNavigate()
  const abortRef = useRef(null)
  const store = useGenerationStore

  const generate = useCallback(async () => {
    const { images, options } = store.getState()
    if (images.length === 0) return

    store.getState().setStatus('generating')
    store.getState().setProgress(0, PROGRESS_MESSAGES[0])

    // Navigate to loading page
    navigate('/generating')

    // Animate progress messages
    const messageInterval = setInterval(() => {
      const { progress } = store.getState()
      const msgIndex = Math.min(
        Math.floor((progress / 100) * PROGRESS_MESSAGES.length),
        PROGRESS_MESSAGES.length - 1
      )
      store.getState().setProgress(
        Math.min(progress + 2, 90),
        PROGRESS_MESSAGES[msgIndex]
      )
    }, 800)

    try {
      const { imagePrompts, videoPrompt } = buildAllPrompts(options)

      // Prepare image data for the API
      const imageDataParts = images.map((img) => ({
        inlineData: {
          mimeType: 'image/jpeg',
          data: img.base64.split(',')[1],
        },
      }))

      // Try proxy server first, fallback to direct API
      let generatedImages = []
      let videoResult = null

      try {
        // Attempt via proxy server
        const response = await apiPost('/generate', {
          images: images.map((img) => ({
            data: img.base64.split(',')[1],
            mimeType: 'image/jpeg',
          })),
          prompts: imagePrompts,
          videoPrompt,
          options,
        })
        generatedImages = response.images || []
        videoResult = response.video || null
      } catch {
        // Fallback: direct Gemini API call (if user has API key in settings)
        const apiKey = localStorage.getItem('ff_studio_api_key')
        if (!apiKey) {
          throw new Error('Server unavailable. Please add your Gemini API key in Settings.')
        }

        // Generate images one by one with direct API
        const results = []
        for (let i = 0; i < imagePrompts.length; i++) {
          const img = await directGeminiCall(apiKey, imagePrompts[i], imageDataParts)
          results.push(img)
          store.getState().setProgress(
            Math.round(((i + 1) / imagePrompts.length) * 85),
            `Generated ${i + 1} of ${imagePrompts.length}...`
          )
        }
        generatedImages = results

        if (videoPrompt) {
          store.getState().setProgress(88, 'Generating video...')
          videoResult = await directGeminiCall(apiKey, videoPrompt, imageDataParts)
        }
      }

      clearInterval(messageInterval)

      // Calculate cost receipt
      const totalPromptChars = imagePrompts.reduce((a, p) => a + p.length, 0)
      const receipt = {
        imagesGenerated: generatedImages.length,
        imageCost: generatedImages.length * COST_PER_IMAGE,
        videoIncluded: !!videoResult,
        videoCost: videoResult ? 8 * COST_PER_VIDEO_SECOND : 0,
        tokenCost: Math.ceil(totalPromptChars / 4) * 0.000000075,
        get total() {
          return this.imageCost + this.videoCost + this.tokenCost
        },
      }

      store.getState().setProgress(100, 'Done!')
      store.getState().setReceipt(receipt)
      store.getState().setResults(generatedImages.filter(Boolean))
      if (videoResult) store.getState().setVideoResult(videoResult)

      // Navigate to results
      setTimeout(() => navigate('/results'), 300)
    } catch (err) {
      clearInterval(messageInterval)
      store.getState().setError(err.message || 'Generation failed. Please try again.')
      navigate('/customize')
    }
  }, [navigate])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    store.getState().resetResults()
    navigate('/customize')
  }, [navigate])

  return { generate, cancel }
}
