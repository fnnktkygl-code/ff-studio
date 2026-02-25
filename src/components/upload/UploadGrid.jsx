import { useGenerationStore } from '../../stores/generationStore'
import { ImagePreview } from './ImagePreview'
import { cn } from '../../utils/cn'

function PlusIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
  )
}

export function UploadGrid({ onAddMore }) {
  const images = useGenerationStore((s) => s.images)
  const removeImage = useGenerationStore((s) => s.removeImage)

  if (images.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Your photos ({images.length}/4)
        </h3>
        <span className="text-[10px] text-slate-500">More angles = better results</span>
      </div>

      <div className={cn(
        'grid gap-3',
        images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
      )}>
        {images.map((img, idx) => (
          <ImagePreview
            key={idx}
            src={img.preview}
            onRemove={() => removeImage(idx)}
            className={cn(
              images.length === 1 ? 'aspect-[3/4]' : 'aspect-square'
            )}
          />
        ))}

        {images.length < 4 && (
          <button
            onClick={onAddMore}
            className={cn(
              'rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-white/20 hover:text-slate-400 transition-all active:scale-95',
              images.length === 1 ? 'aspect-square' : 'aspect-square'
            )}
          >
            <PlusIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Add</span>
          </button>
        )}
      </div>
    </div>
  )
}
