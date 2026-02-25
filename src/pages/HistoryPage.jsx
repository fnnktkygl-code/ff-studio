import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { PageTransition } from '../components/layout/PageTransition'
import { Skeleton } from '../components/common/Skeleton'
import { Button } from '../components/common/Button'
import { useHistory } from '../hooks/useHistory'
import { useGenerationStore } from '../stores/generationStore'
import { useToast } from '../hooks/useToast'

function TrashIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}

function ClockIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function formatDate(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export function HistoryPage() {
  const navigate = useNavigate()
  const { generations, isLoading, deleteFromHistory, clearHistory } = useHistory()
  const setResults = useGenerationStore((s) => s.setResults)
  const setVideoResult = useGenerationStore((s) => s.setVideoResult)
  const setReceipt = useGenerationStore((s) => s.setReceipt)
  const toast = useToast()

  const handleViewGeneration = (gen) => {
    setResults(gen.results || [])
    if (gen.videoResult) setVideoResult(gen.videoResult)
    if (gen.receipt) setReceipt(gen.receipt)
    navigate('/results')
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    await deleteFromHistory(id)
    toast.info('Generation removed')
  }

  const handleClearAll = async () => {
    await clearHistory()
    toast.info('History cleared')
  }

  return (
    <PageTransition>
      <Header
        title="History"
        rightAction={
          generations.length > 0 ? (
            <button
              onClick={handleClearAll}
              className="text-xs text-red-400 font-semibold hover:text-red-300"
            >
              Clear
            </button>
          ) : null
        }
      />

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4]" />
            ))}
          </div>
        ) : generations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <ClockIcon className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-400 mb-2">No history yet</h3>
            <p className="text-sm text-slate-500 max-w-xs">
              Your generated fashion photos will appear here
            </p>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/')}
              className="mt-6"
            >
              Create your first
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {generations.map((gen) => (
              <button
                key={gen.id}
                onClick={() => handleViewGeneration(gen)}
                className="relative rounded-2xl overflow-hidden bg-surface-elevated aspect-[3/4] group active:scale-[0.97] transition-transform text-left"
              >
                {gen.results?.[0] ? (
                  <img
                    src={gen.results[0]}
                    alt="Generation"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-elevated" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-[10px] text-white/70 font-medium">
                    {gen.results?.length || 0} photos
                  </p>
                  <p className="text-[9px] text-white/50">
                    {formatDate(gen.timestamp)}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDelete(e, gen.id)}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </button>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
