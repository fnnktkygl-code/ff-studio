import { useState, useCallback } from 'react'
import { cn } from '../../utils/cn'

function CameraIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}

function UploadIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}

export function UploadZone({ onOpenPicker, onFiles }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer?.files
    if (files?.length) {
      onFiles(files)
    }
  }, [onFiles])

  return (
    <button
      onClick={onOpenPicker}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'w-full aspect-[4/5] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-6 transition-all active:scale-[0.98]',
        isDragging ? 'border-brand scale-[1.02]' : 'border-brand/30 hover:border-brand/60'
      )}
      style={{
        background: isDragging ? 'rgba(255,107,129,0.08)' : 'var(--bg-card)',
      }}
    >
      {/* Camera icon */}
      <div className="relative">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,107,129,0.12)' }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
            }}
          >
            <CameraIcon className="w-6 h-6 text-brand" />
          </div>
        </div>
      </div>

      <div className="text-center space-y-2 px-6">
        <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Add your garment</p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Take a photo or drag & drop up to 4 images
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <UploadIcon className="w-4 h-4" />
        <span>JPG, PNG, WebP up to 10MB</span>
      </div>
    </button>
  )
}
