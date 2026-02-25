import { ImageCard } from './ImageCard'

export function ImageGallery({ images, onImageClick }) {
  if (!images?.length) return null

  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
        Generated Photos
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {images.map((img, i) => (
          <ImageCard
            key={i}
            src={img}
            index={i}
            onClick={() => onImageClick(i)}
          />
        ))}
      </div>
    </div>
  )
}
