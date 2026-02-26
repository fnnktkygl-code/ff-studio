import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function XIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
    )
}

function RefreshIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
        </svg>
    )
}

const SUGGESTIONS = [
    'Better lighting',
    'More natural pose',
    'Cleaner background',
    'Sharper details',
    'Different angle',
]

export function RegenerateModal({ imageIndex, isOpen, onClose, onConfirm, isRegenerating }) {
    const [feedback, setFeedback] = useState('')
    const textareaRef = useRef(null)

    useEffect(() => {
        if (isOpen) {
            setFeedback('')
            setTimeout(() => textareaRef.current?.focus(), 100)
        }
    }, [isOpen])

    const handleConfirm = () => {
        if (!feedback.trim()) return
        onConfirm(feedback.trim())
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            handleConfirm()
        }
        if (e.key === 'Escape') {
            onClose()
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.97 }}
                        transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
                        className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto px-4 pb-6"
                    >
                        <div className="bg-surface-dark border border-slate-200 rounded-3xl p-5 shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Refine Image {imageIndex + 1}</h3>
                                    <p className="text-[11px] text-slate-500 mt-0.5">What should be improved?</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
                                >
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Quick suggestions */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setFeedback((prev) => prev ? `${prev}, ${s.toLowerCase()}` : s)}
                                        className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white hover:bg-brand-light/30 hover:text-brand border border-slate-200 hover:border-brand-light text-slate-600 transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>

                            {/* Textarea */}
                            <textarea
                                ref={textareaRef}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Describe what to improve... (⌘+Enter to confirm)"
                                rows={3}
                                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand/40 transition-colors resize-none"
                            />

                            {/* Actions */}
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={onClose}
                                    disabled={isRegenerating}
                                    className="flex-1 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={!feedback.trim() || isRegenerating}
                                    className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-brand-dark to-brand text-sm font-bold text-white shadow-lg shadow-brand-dark/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isRegenerating ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            >
                                                <RefreshIcon className="w-4 h-4" />
                                            </motion.div>
                                            Generating…
                                        </>
                                    ) : (
                                        <>
                                            <RefreshIcon className="w-4 h-4" />
                                            Regenerate
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
