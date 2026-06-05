import {
  getPricingProfile,
  IMAGE_OUTPUT_TOKENS,
} from '../../utils/constants'

export function CostEstimator({ mode, generateVideo, outputCount = 4, aiModel, imageResolution = '1K' }) {
  const modelKey = aiModel || 'gemini-3.1-flash-image-preview'
  const profile = getPricingProfile(modelKey)

  // In Both mode, 4 images means 4 model + 4 product = 8 images total
  const baseCount = Math.max(1, Math.min(Number(outputCount || 4), 4))
  const totalImageCount = mode === 'both' ? baseCount * 2 : baseCount

  // Output Cost (Images)
  // Get token count for the selected resolution (default 1120 for 1K/2K)
  const tokensPerImage = IMAGE_OUTPUT_TOKENS[imageResolution] || IMAGE_OUTPUT_TOKENS['1K']
  const totalOutputTokens = tokensPerImage * totalImageCount
  const outputTokenRatePerToken = (profile.outputTokenCostMillion || 120) / 1000000
  const imageCost = totalOutputTokens * outputTokenRatePerToken

  const videoCost = 0 // Video disabled

  // Input Cost (Prompts)
  const estimatedPromptChars = mode === 'both' ? baseCount * 1100 : baseCount * 900
  const estimatedInputTokens = Math.ceil(estimatedPromptChars / 4)
  const inputRatePerToken = (profile.inputTokenCostMillion || 2.00) / 1000000
  const tokenCost = estimatedInputTokens * inputRatePerToken

  const total = imageCost + videoCost + tokenCost

  return (
    <div className="flex items-center justify-between px-4 py-3 theme-card theme-border border rounded-2xl mt-4">
      <div>
        <p className="text-xs theme-text-muted">Estimated cost</p>
        <p className="text-sm font-bold theme-text">
          ~${total.toFixed(3)}
          <span className="theme-text-sec font-normal ml-1">
            ({totalImageCount} image{totalImageCount > 1 ? 's' : ''})
          </span>
        </p>
      </div>
      <div className="text-[10px] theme-text-muted text-right">
        {profile.outputTokenCostMillion > 0 && <p>~${(tokensPerImage * outputTokenRatePerToken).toFixed(3)}/image</p>}
        {profile.inputTokenCostMillion > 0 && <p>~${tokenCost.toFixed(4)} input tokens</p>}
      </div>
    </div>
  )
}
