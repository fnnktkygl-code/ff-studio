import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { PageTransition } from '../components/layout/PageTransition'
import { Button } from '../components/common/Button'
import { ImageGallery } from '../components/results/ImageGallery'
import { FullscreenViewer } from '../components/results/FullscreenViewer'
import { ReceiptView } from '../components/results/ReceiptView'
import { VideoPlayer } from '../components/results/VideoPlayer'
import { RegenerateModal } from '../components/results/RegenerateModal'
import { useGenerationStore } from '../stores/generationStore'
import { useDownload } from '../hooks/useDownload'
import { useShare } from '../hooks/useShare'
import { useHistory } from '../hooks/useHistory'
import { useToast } from '../hooks/useToast'
import { apiPost } from '../utils/api'
import { buildAllPrompts, applyFeedbackToPrompt } from '../utils/promptBuilder'

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

function RotateIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
    </svg>
  )
}

export function ResultsPage() {
  const navigate = useNavigate()
  const [viewerIndex, setViewerIndex] = useState(null)
  const [saved, setSaved] = useState(false)
  // Regenerate modal state
  const [regenModal, setRegenModal] = useState({ open: false, index: null })
  const [isRegenerating, setIsRegenerating] = useState(false)

  const results = useGenerationStore((s) => s.results)
  const videoResult = useGenerationStore((s) => s.videoResult)
  const receipt = useGenerationStore((s) => s.receipt)
  const options = useGenerationStore((s) => s.options)
  const sourceImages = useGenerationStore((s) => s.images)
  const setResults = useGenerationStore((s) => s.setResults)
  const reset = useGenerationStore((s) => s.reset)

  const { downloadAll, downloadImage } = useDownload()
  const { canShare, shareAll } = useShare()
  const { saveToHistory } = useHistory()
  const toast = useToast()

  // Auto-save to history
  useEffect(() => {
    if (results.length > 0 && !saved) {
      saveToHistory({
        options,
        results,
        videoResult,
        receipt,
      })
      setSaved(true)
    }
  }, [results, saved, saveToHistory, options, videoResult, receipt])

  // Redirect if no results
  useEffect(() => {
    if (results.length === 0) {
      navigate('/')
    }
  }, [results, navigate])

  if (results.length === 0) return null

  const handleStartOver = () => {
    reset()
    navigate('/')
  }

  const handleDownloadAll = () => {
    downloadAll(results)
    toast.success(`Downloading ${results.length} photos`)
  }

  const handleDownloadOne = (index) => {
    downloadImage(results[index], `ff-studio-${index + 1}.jpg`)
    toast.success(`Downloading image ${index + 1}`)
  }

  const handleOpenRegenModal = (index) => {
    setRegenModal({ open: true, index })
  }

  const handleCloseRegenModal = () => {
    if (!isRegenerating) {
      setRegenModal({ open: false, index: null })
    }
  }

  const handleRegenerateOne = async (feedback) => {
    const index = regenModal.index
    if (index === null) return

    if (sourceImages.length === 0) {
      toast.error('Missing source images. Start a new generation.')
      setRegenModal({ open: false, index: null })
      return
    }

    setIsRegenerating(true)
    try {
      const { imagePrompts } = buildAllPrompts(options)
      const basePrompt = imagePrompts[index] || imagePrompts[0]
      if (!basePrompt) {
        toast.error('No base prompt found for regeneration.')
        return
      }

      const revisedPrompt = applyFeedbackToPrompt(basePrompt, feedback)
      const response = await apiPost('/generate', {
        images: sourceImages.map((img) => ({
          data: img.base64.split(',')[1],
          mimeType: 'image/jpeg',
        })),
        prompts: [revisedPrompt],
        videoPrompt: null,
        options,
      }, {
        timeoutMs: 120000,
      })

      const regenerated = response.images?.[0]
      if (!regenerated) {
        throw new Error('No regenerated image returned')
      }

      const next = [...results]
      next[index] = regenerated
      setResults(next)
      toast.success(`Image ${index + 1} regenerated`)
      setRegenModal({ open: false, index: null })
    } catch (err) {
      toast.error(err.message || 'Failed to regenerate this image')
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleShareAll = async () => {
    try {
      await shareAll(results)
    } catch {
      toast.error('Sharing failed')
    }
  }

  return (
    <PageTransition>
      <Header title="Your Looks" />

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-36">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Looking great!</h2>
            <p className="text-sm text-slate-400 mt-1">Your photos are ready</p>
          </div>
          <ReceiptView receipt={receipt} />
        </div>

        {/* Video */}
        {videoResult && (
          <div className="mb-6">
            <VideoPlayer src={videoResult} />
          </div>
        )}

        {/* Image gallery */}
        <ImageGallery
          images={results}
          onImageClick={(index) => setViewerIndex(index)}
          onImageDownload={handleDownloadOne}
          onImageRegenerate={handleOpenRegenModal}
        />
      </div>

      {/* Bottom actions */}
      <div className="fixed bottom-20 left-0 right-0 px-5 pb-4 max-w-lg mx-auto">
        <div className="bg-surface-dark/90 backdrop-blur-xl pt-4 flex gap-3">
          <Button variant="secondary" onClick={handleStartOver} className="w-14 shrink-0 px-0">
            <RotateIcon className="w-5 h-5" />
          </Button>
          {canShare && (
            <Button variant="secondary" onClick={handleShareAll} className="w-14 shrink-0 px-0">
              <ShareIcon className="w-5 h-5" />
            </Button>
          )}
          <Button onClick={handleDownloadAll} className="flex-1">
            <DownloadIcon className="w-5 h-5" />
            <span>Save All</span>
          </Button>
        </div>
      </div>

      {/* Fullscreen viewer */}
      {viewerIndex !== null && (
        <FullscreenViewer
          images={results}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}

      {/* Regeneration modal */}
      <RegenerateModal
        imageIndex={regenModal.index ?? 0}
        isOpen={regenModal.open}
        onClose={handleCloseRegenModal}
        onConfirm={handleRegenerateOne}
        isRegenerating={isRegenerating}
      />
    </PageTransition>
  )
}
