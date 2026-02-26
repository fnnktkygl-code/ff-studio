import {
  COST_PER_VIDEO_SECOND,
  getPricingProfile,
} from '../../utils/constants'

export function CostEstimator({ mode, generateVideo, outputCount = 4, aiModel }) {
  const modelKey = aiModel || 'gemini-2.5-flash-image'
  const profile = getPricingProfile(modelKey)

  const imageCount = Math.max(1, Math.min(Number(outputCount || 4), 4))
  const imageCost = imageCount * profile.imageCost

  // Veo 2.0 generate pricing is approx $0.40/second. Default length is 8 seconds.
  const videoCost = generateVideo ? 8 * 0.40 : 0

  const estimatedPromptChars = mode === 'both' ? imageCount * 1100 : imageCount * 900
  const estimatedInputTokens = Math.ceil(estimatedPromptChars / 4)
  const tokenCost = estimatedInputTokens * profile.inputTokenCost

  const total = imageCost + videoCost + tokenCost

  return (
    <div className="flex items-center justify-between px-4 py-3 theme-card theme-border border rounded-2xl mt-4">
      <div>
        <p className="text-xs theme-text-muted">Estimated cost</p>
        <p className="text-sm font-bold theme-text">
          ~${total.toFixed(3)}
          <span className="theme-text-sec font-normal ml-1">
            ({imageCount} image{imageCount > 1 ? 's' : ''}{generateVideo ? ' + video' : ''})
          </span>
        </p>
      </div>
      <div className="text-[10px] theme-text-muted text-right">
        <p>${profile.imageCost.toFixed(3)}/image</p>
        {profile.inputTokenCost > 0 && <p>~${tokenCost.toFixed(4)} input tokens</p>}
        {generateVideo && <p>$0.40/s video</p>}
      </div>
    </div>
  )
}
