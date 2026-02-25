import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function PlayIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
}

function XIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  )
}

export function VideoPlayer({ src }) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (!src) return null

  const isVideo = src.includes('video/') || src.includes('mp4') || src.startsWith('data:video')

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Video Preview
          </h3>
          <span className="text-[9px] font-bold bg-brand-dark/20 text-brand px-2 py-0.5 rounded-full uppercase tracking-wider">
            AI Generated
          </span>
        </div>

        <button
          onClick={() => setIsPlaying(true)}
          className="relative w-full rounded-2xl overflow-hidden bg-surface-elevated aspect-video group active:scale-[0.98] transition-transform"
        >
          <img
            src={src}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <PlayIcon className="w-6 h-6 text-white ml-1" />
            </div>
          </div>
        </button>
      </div>

      {/* Fullscreen player */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
          >
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform pt-safe"
            >
              <XIcon className="w-5 h-5" />
            </button>

            {isVideo ? (
              <video
                src={src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={src}
                alt="Video frame"
                className="w-full h-full object-cover animate-[slowZoom_12s_ease-in-out_infinite_alternate]"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
