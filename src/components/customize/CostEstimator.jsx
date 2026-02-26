import {
  COST_PER_IMAGE,
  COST_PER_VIDEO_SECOND,
  INPUT_TEXT_COST_PER_TOKEN,
} from '../../utils/constants'

export function CostEstimator({ mode, generateVideo, outputCount = 4 }) {
  const imageCount = Math.max(1, Math.min(Number(outputCount || 4), 4))
  const imageCost = imageCount * COST_PER_IMAGE
  const videoCost = generateVideo ? 8 * COST_PER_VIDEO_SECOND : 0

  const estimatedPromptChars = mode === 'both' ? imageCount * 1100 : imageCount * 900
  const estimatedInputTokens = Math.ceil(estimatedPromptChars / 4)
  const tokenCost = estimatedInputTokens * INPUT_TEXT_COST_PER_TOKEN

  const total = imageCost + videoCost + tokenCost

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-2xl">
      <div>
        <p className="text-xs text-slate-400">Estimated cost</p>
        <p className="text-sm font-bold text-slate-200">
          ~${total.toFixed(2)}
          <span className="text-slate-500 font-normal ml-1">
            ({imageCount} images{generateVideo ? ' + video' : ''})
          </span>
        </p>
      </div>
      <div className="text-[10px] text-slate-500 text-right">
        <p>${COST_PER_IMAGE.toFixed(4)}/image</p>
        <p>~${tokenCost.toFixed(4)} input tokens</p>
        {generateVideo && <p>${COST_PER_VIDEO_SECOND}/s video</p>}
      </div>
    </div>
  )
}
