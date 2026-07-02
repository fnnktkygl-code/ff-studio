import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGenerationStore } from '../stores/generationStore'
import { vertexAICall, directGeminiCall, getClientApiKey, hasCloudFunction } from '../utils/api'
import { buildAllPrompts } from '../utils/promptBuilder'
import { getPricingProfile, IMAGE_OUTPUT_TOKENS_BY_MODEL } from '../utils/constants'
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
      const { imagePrompts } = buildAllPrompts(options)

      // Prepare image data for the API
      const imageDataParts = images.map((img) => ({
        inlineData: {
          mimeType: 'image/jpeg',
          data: img.base64.split(',')[1],
        },
      }))

      let generatedImages = []
      const selectedModel = options.aiModel || 'gemini-2.5-flash-image'

      const useVertex = hasCloudFunction()
      const apiKey = useVertex ? null : getClientApiKey()

      if (!useVertex && !apiKey) {
        throw new Error('No API key configured. Add your Gemini API key in Settings.')
      }

      // Pass options that directGeminiCall needs (temperature, safetySettings, searchGrounding)
      const generateOne = (prompt, parts, opts) =>
        useVertex
          ? vertexAICall(prompt, parts, { ...opts, model: selectedModel })
          : directGeminiCall(apiKey, prompt, parts, {
              ...opts,
              model: selectedModel,
              useSearchGrounding: options.useSearchGrounding,
            })

      // Generate images in parallel (independent requests)
      const genOpts = {
        signal: generationController.signal,
        timeoutMs: 120000,
      }

      const promises = imagePrompts.map((prompt, i) =>
        generateOne(prompt, imageDataParts, genOpts).then((img) => {
          // Update progress as each image completes
          const completed = store.getState().progress
          store.getState().setProgress(
            Math.min(Math.round(((i + 1) / imagePrompts.length) * 85), 85),
            `Generated ${i + 1} of ${imagePrompts.length}...`
          )
          return img
        })
      )

      const settled = await Promise.allSettled(promises)
      generatedImages = settled
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value)

      const modelUsed = selectedModel

      clearInterval(messageInterval)

      const validImages = generatedImages.filter(Boolean)
      if (validImages.length === 0) {
        throw new Error('No photos were generated. Please try again.')
      }

      // Calculate cost receipt — aligned with CostEstimator formula
      const totalPromptChars = imagePrompts.reduce((a, p) => a + p.length, 0)
      const pricingProfile = getPricingProfile(modelUsed || 'gemini-3.1-flash-image-preview')
      const isFlat = !!pricingProfile.isFlat
      const imageRes = options.imageResolution || '1K'
      const tokensPerImage = IMAGE_OUTPUT_TOKENS_BY_MODEL[modelUsed]?.[imageRes] || 1120
      const outputRatePerToken = (pricingProfile.outputTokenCostMillion || 120) / 1000000
      const inputRatePerToken = (pricingProfile.inputTokenCostMillion || 2.00) / 1000000

      const imageCostTotal = isFlat
        ? validImages.length * (pricingProfile.flatRateCost || 0.04)
        : validImages.length * tokensPerImage * outputRatePerToken
      const tokenCostTotal = isFlat
        ? 0
        : Math.ceil(totalPromptChars / 4) * inputRatePerToken

      const receipt = {
        pricingModel: modelUsed || 'gemini-3.1-flash-image-preview',
        imagesGenerated: validImages.length,
        imageCost: imageCostTotal,
        tokenCost: tokenCostTotal,
        get total() {
          return this.imageCost + this.tokenCost
        },
      }

      store.getState().setProgress(100, 'Done!')
      store.getState().setReceipt(receipt)
      store.getState().setResults(validImages)

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
