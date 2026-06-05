import { motion, AnimatePresence } from 'framer-motion'
import { usePWAInstall } from '../../hooks/usePWAInstall'
import { Button } from './Button'

function DownloadIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}

export function InstallBanner() {
  const { canInstall, promptInstall, dismissInstall } = usePWAInstall()

  return (
    <AnimatePresence>
      {canInstall && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-20 left-4 right-4 z-50 max-w-lg mx-auto"
        >
          <div className="backdrop-blur-xl rounded-2xl p-4 shadow-2xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center shrink-0">
                <DownloadIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Install Lady Vampire Studio</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Add to home screen for the best experience</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="ghost" onClick={dismissInstall} className="flex-1">
                Not now
              </Button>
              <Button size="sm" onClick={promptInstall} className="flex-1">
                Install
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
