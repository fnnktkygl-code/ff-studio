import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function ReceiptIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M14 8H8" /><path d="M16 12H8" /><path d="M13 16H8" />
    </svg>
  )
}

export function ReceiptView({ receipt }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!receipt) return null

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors hover:opacity-80"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
      >
        <ReceiptIcon className="w-3.5 h-3.5" />
        <span>${receipt.total.toFixed(3)}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 rounded-2xl shadow-sm space-y-2" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <h3 className="text-[10px] font-bold uppercase tracking-widest pb-2" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-muted)' }}>
                Generation Receipt
              </h3>
              {receipt.pricingModel && (
                <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>Pricing model</span>
                  <span className="font-mono">{receipt.pricingModel}</span>
                </div>
              )}
              <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Images ({receipt.imagesGenerated}x)</span>
                <span className="font-mono">${receipt.imageCost.toFixed(4)}</span>
              </div>
              {receipt.videoIncluded && (
                <div className="flex justify-between text-xs text-brand">
                  <span>Video (8s)</span>
                  <span className="font-mono">${receipt.videoCost.toFixed(3)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Tokens</span>
                <span className="font-mono">${receipt.tokenCost.toFixed(5)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2" style={{ color: 'var(--text-primary)', borderTop: '1px solid var(--border-muted)' }}>
                <span>Total</span>
                <span className="font-mono">${receipt.total.toFixed(3)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
