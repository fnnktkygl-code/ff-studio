import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGenerationStore } from '../stores/generationStore'
import { vertexAICall, directGeminiCall, getClientApiKey, hasCloudFunction } from '../utils/api'
import { buildAllPrompts } from '../utils/promptBuilder'
import { COST_PER_VIDEO_SECOND, getPricingProfile } from '../utils/constants'
import { useToast } from './useToast'

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
  const toast = useToast()

  const generate = useCallback(async () => {
    const { images, options } = store.getState()
    if (images.length === 0) return

    const generationController = new AbortController()
    abortRef.current = generationController
    store.getState().setAbortController(generationController)
    store.getState().setIsFromHistory(false)

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

      let generatedImages = []
      let videoResult = null
      const selectedModel = options.aiModel || 'gemini-2.5-flash-image'

      const useVertex = hasCloudFunction()
      const apiKey = useVertex ? null : getClientApiKey()

      if (!useVertex && !apiKey) {
        throw new Error('No API key configured. Add your Gemini API key in Settings.')
      }

      // Generate images one by one
      const generateOne = (prompt, parts, opts) =>
        useVertex
          ? vertexAICall(prompt, parts, { ...opts, model: selectedModel })
          : directGeminiCall(apiKey, prompt, parts, { ...opts, model: selectedModel })

      const results = []
      for (let i = 0; i < imagePrompts.length; i++) {
        const img = await generateOne(imagePrompts[i], imageDataParts, {
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

      const modelUsed = selectedModel

      if (videoPrompt) {
        store.getState().setProgress(88, 'Generating video...')
        videoResult = await generateOne(videoPrompt, imageDataParts, {
          signal: generationController.signal,
          timeoutMs: 120000,
        })
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

      // Crucial: reset status to idle so hitting back doesn't trigger the generation loop
      store.getState().setStatus('idle')

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
