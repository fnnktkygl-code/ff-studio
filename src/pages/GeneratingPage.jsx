import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageTransition } from '../components/layout/PageTransition'
import { Button } from '../components/common/Button'
import { useGenerationStore } from '../stores/generationStore'

function SparklesIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" /><path d="M22 5h-4" />
    </svg>
  )
}

export function GeneratingPage() {
  const navigate = useNavigate()
  const status = useGenerationStore((s) => s.status)
  const progress = useGenerationStore((s) => s.progress)
  const progressMessage = useGenerationStore((s) => s.progressMessage)
  const resetResults = useGenerationStore((s) => s.resetResults)
  const abortGeneration = useGenerationStore((s) => s.abortGeneration)

  // If user navigates here without generating, redirect
  useEffect(() => {
    if (status === 'idle') {
      navigate('/')
    }
  }, [status, navigate])

  const handleCancel = () => {
    abortGeneration()
    resetResults()
    navigate('/customize')
  }

  return (
    <PageTransition>
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center min-h-screen">
        {/* Animated orb */}
        <div className="relative mb-10">
          <motion.div
            className="w-28 h-28 rounded-full bg-brand-light/30 absolute inset-0"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="w-28 h-28 rounded-full bg-brand-light/20 absolute inset-0"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center relative z-10 shadow-2xl shadow-brand-dark/30">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <SparklesIcon className="w-10 h-10 text-white" />
            </motion.div>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
          Creating your photos...
        </h2>
        <motion.p
          key={progressMessage}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          {progressMessage || 'Starting...'}
        </motion.p>

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
            <motion.div
              className="h-full bg-gradient-to-r from-brand-dark to-brand rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono">{Math.round(progress)}%</p>
        </div>

        {/* Cancel */}
        <div className="mt-12">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
