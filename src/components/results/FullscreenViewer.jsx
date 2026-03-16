import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDownload } from '../../hooks/useDownload'
import { useShare } from '../../hooks/useShare'

function XIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
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

function ShareIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  )
}

function ChevronIcon({ className, direction = 'left' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {direction === 'left' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  )
}

export function FullscreenViewer({ images, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const { downloadImage } = useDownload()
  const { canShare, shareImage } = useShare()

  const currentImage = images[currentIndex]
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < images.length - 1

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 pt-safe">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <XIcon className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
            {currentIndex + 1} / {images.length}
          </span>
          <div className="w-10" />
        </div>

        {/* Image */}
        <div className="flex-1 relative flex items-center justify-center px-4">
          {hasPrev && (
            <button
              onClick={() => setCurrentIndex(i => i - 1)}
              className="absolute left-2 z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <ChevronIcon className="w-5 h-5" direction="left" />
            </button>
          )}

          <motion.img
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            src={currentImage}
            alt={`Photo ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-2xl"
          />

          {hasNext && (
            <button
              onClick={() => setCurrentIndex(i => i + 1)}
              className="absolute right-2 z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <ChevronIcon className="w-5 h-5" direction="right" />
            </button>
          )}
        </div>

        {/* Dots */}
        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 py-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex ? 'bg-brand w-5' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom actions */}
        <div className="flex items-center justify-center gap-4 p-6 pb-safe">
          <button
            onClick={() => downloadImage(currentImage, `ff-studio-${currentIndex + 1}.jpg`)}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full text-white text-sm font-bold active:scale-95 transition-transform"
          >
            <DownloadIcon className="w-4 h-4" />
            Save
          </button>
          {canShare && (
            <button
              onClick={() => shareImage(currentImage)}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full text-white text-sm font-bold active:scale-95 transition-transform"
            >
              <ShareIcon className="w-4 h-4" />
              Share
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
