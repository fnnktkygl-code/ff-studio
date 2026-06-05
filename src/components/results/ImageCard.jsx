function MaximizeIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" x2="14" y1="3" y2="10" /><line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  )
}

function DownloadIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}

function RefreshIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
    </svg>
  )
}

export function ImageCard({ src, index, onClick, onDownload, onRegenerate }) {
  return (
    <div
      onClick={onClick}
      className="relative group rounded-2xl overflow-hidden theme-elevated aspect-[3/4] cursor-pointer active:scale-[0.97] transition-transform"
    >
      <img
        src={src}
        alt={`Generated photo ${index + 1}`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDownload?.()
          }}
          className="w-8 h-8 bg-black/35 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
          title="Download this image"
        >
          <DownloadIcon className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRegenerate?.()
          }}
          className="w-8 h-8 bg-black/35 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
          title="Regenerate this image"
        >
          <RefreshIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
          <MaximizeIcon className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}
