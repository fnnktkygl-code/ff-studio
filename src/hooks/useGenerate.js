import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGenerationStore } from '../stores/generationStore'
import { apiPost, directGeminiCall, getClientApiKey } from '../utils/api'
import { buildAllPrompts } from '../utils/promptBuilder'
import { COST_PER_VIDEO_SECOND, getPricingProfile } from '../utils/constants'

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

    const generationController = new AbortController()
    abortRef.current = generationController
    store.getState().setAbortController(generationController)

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
      let modelUsed = null

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
        }, {
          signal: generationController.signal,
          timeoutMs: 120000,
        })
        generatedImages = response.images || []
        videoResult = response.video || null
        modelUsed = response.modelUsed || null
      } catch (serverErr) {
        // Surface server-side errors directly (auth/config/model/etc.)
        // Only fallback to direct API when the server is unreachable.
        const isAuthError = serverErr.authError
          || serverErr.status === 401
          || serverErr.status === 403
          || serverErr.message?.includes('Authentication failed')
          || serverErr.message?.includes('Invalid API key')
          || serverErr.message?.includes('API key not valid')
        const isNetworkError = serverErr.code === 'NETWORK_ERROR' || serverErr.status === 0

        if (isAuthError || !isNetworkError) {
          throw new Error(serverErr.message || 'Server authentication failed. Check your API key configuration.')
        }

        // Fallback: direct Gemini API call (settings key or VITE_GEMINI_API_KEY)
        const apiKey = getClientApiKey()
        if (!apiKey) {
          throw new Error('Server unavailable. Start backend with npm run dev:all, or add Gemini API key in Settings.')
        }

        // Generate images one by one with direct API
        const results = []
        for (let i = 0; i < imagePrompts.length; i++) {
          const img = await directGeminiCall(apiKey, imagePrompts[i], imageDataParts, {
            signal: generationController.signal,
            timeoutMs: 120000,
          })
          results.push(img)
          store.getState().setProgress(
            Math.round(((i + 1) / imagePrompts.length) * 85),
            `Generated ${i + 1} of ${imagePrompts.length}...`
          )
        }
        generatedImages = results
        modelUsed = 'gemini-2.5-flash-image-preview'

        if (videoPrompt) {
          store.getState().setProgress(88, 'Generating video...')
          videoResult = await directGeminiCall(apiKey, videoPrompt, imageDataParts, {
            signal: generationController.signal,
            timeoutMs: 120000,
          })
        }
      }

      clearInterval(messageInterval)

      const validImages = generatedImages.filter(Boolean)
      if (validImages.length === 0) {
        throw new Error('No photos were generated. Please try again.')
      }

      // Calculate cost receipt
      const totalPromptChars = imagePrompts.reduce((a, p) => a + p.length, 0)
      const pricingProfile = getPricingProfile(modelUsed || import.meta.env.VITE_PRICING_IMAGE_MODEL || 'gemini-2.5-flash-image')
      const receipt = {
        pricingModel: modelUsed || 'gemini-2.5-flash-image',
        imagesGenerated: validImages.length,
        imageCost: validImages.length * pricingProfile.imageCost,
        videoIncluded: !!videoResult,
        videoCost: videoResult ? 8 * COST_PER_VIDEO_SECOND : 0,
        tokenCost: Math.ceil(totalPromptChars / 4) * pricingProfile.inputTokenCost,
        get total() {
          return this.imageCost + this.videoCost + this.tokenCost
        },
      }

      store.getState().setProgress(100, 'Done!')
      store.getState().setReceipt(receipt)
      store.getState().setResults(validImages)
      if (videoResult) store.getState().setVideoResult(videoResult)

      // Navigate to results
      setTimeout(() => navigate('/results'), 300)
    } catch (err) {
      clearInterval(messageInterval)
      store.getState().setError(err.message || 'Generation failed. Please try again.')
      navigate('/customize')
    } finally {
      abortRef.current = null
      store.getState().setAbortController(null)
    }
  }, [navigate])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    store.getState().resetResults()
    navigate('/customize')
  }, [navigate])

  return { generate, cancel }
}
