import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { PageTransition } from '../components/layout/PageTransition'
import { UploadZone } from '../components/upload/UploadZone'
import { UploadGrid } from '../components/upload/UploadGrid'
import { Button } from '../components/common/Button'
import { useImageUpload } from '../hooks/useImageUpload'
import { useGenerationStore } from '../stores/generationStore'

function SparklesIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" /><path d="M22 5h-4" />
    </svg>
  )
}

function ArrowRightIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export function HomePage() {
  const navigate = useNavigate()
  const images = useGenerationStore((s) => s.images)
  const { inputRef, openPicker, handleInputChange, handleFiles } = useImageUpload()

  return (
    <PageTransition>
      <Header />

      <div className="flex-1 flex flex-col px-5 pb-28">
        {/* Hero section */}
        <div className="text-center py-8 space-y-3">
          <div className="inline-flex items-center gap-2 bg-brand-dark/10 px-3 py-1.5 rounded-full">
            <SparklesIcon className="w-3.5 h-3.5 text-brand" />
            <span className="text-[10px] font-bold text-brand uppercase tracking-widest">AI-Powered</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Fashion Photography
          </h2>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            Upload your garment and generate professional e-commerce photos instantly
          </p>
        </div>

        {/* Upload area */}
        {images.length === 0 ? (
          <UploadZone onOpenPicker={openPicker} onFiles={handleFiles} />
        ) : (
          <UploadGrid onAddMore={openPicker} />
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Bottom CTA */}
      {images.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-5 pb-4 max-w-lg mx-auto">
          <div className="bg-surface-dark/80 backdrop-blur-xl pt-4">
            <Button
              onClick={() => navigate('/customize')}
              className="w-full"
            >
              <span>Continue</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </PageTransition>
  )
}
