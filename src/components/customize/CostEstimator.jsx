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
    <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-2xl">
      <div>
        <p className="text-xs text-slate-400">Estimated cost</p>
        <p className="text-sm font-bold text-slate-200">
          ~${total.toFixed(3)}
          <span className="text-slate-500 font-normal ml-1">
            ({imageCount} image{imageCount > 1 ? 's' : ''}{generateVideo ? ' + video' : ''})
          </span>
        </p>
      </div>
      <div className="text-[10px] text-slate-500 text-right">
        <p>${profile.imageCost.toFixed(3)}/image</p>
        {profile.inputTokenCost > 0 && <p>~${tokenCost.toFixed(4)} input tokens</p>}
        {generateVideo && <p>$0.40/s video</p>}
      </div>
    </div>
  )
}
