import { ImageCard } from './ImageCard'

export function ImageGallery({ images, onImageClick, onImageDownload, onImageRegenerate }) {
  if (!images?.length) return null

  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-bold uppercase tracking-widest px-1" style={{ color: 'var(--text-muted)' }}>
        Generated Photos
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {images.map((img, i) => (
          <ImageCard
            key={i}
            src={img}
            index={i}
            onClick={() => onImageClick(i)}
            onDownload={() => onImageDownload?.(i)}
            onRegenerate={() => onImageRegenerate?.(i)}
          />
        ))}
      </div>
    </div>
  )
}
