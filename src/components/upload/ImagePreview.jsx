import { cn } from '../../utils/cn'

function XIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  )
}

export function ImagePreview({ src, onRemove, className }) {
  return (
    <div className={cn(
      'relative rounded-2xl overflow-hidden bg-surface-elevated group',
      className
    )}>
      <img
        src={src}
        alt="Garment"
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute top-2 right-2 w-7 h-7 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white active:scale-90 transition-all"
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
