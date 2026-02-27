import { useState, useRef, useEffect } from 'react'

function ChevronDownIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m6 9 6 6 6-6" />
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

/**
 * Generic dropdown picker that shows a trigger button + a bottom-sheet with
 * a clean 2-column grid of options. Supports optional emoji/icon on each item.
 *
 * Props:
 *   label       – Section label text (uppercase)
 *   options     – Array of { value, label, emoji?, desc? }
 *   value       – Currently selected value
 *   onChange    – Called with the new value
 *   disabledValues – Array of values that should be disabled
 *   columns     – 'auto' (default) | 1 | 2 | 3  (grid columns in the sheet)
 */
export function DropdownPicker({ label, options, value, onChange, disabledValues = [], columns = 2 }) {
    const [open, setOpen] = useState(false)
    const overlayRef = useRef(null)

    const selected = options.find((o) => o.value === value) || options[0]

    function handleSelect(val) {
        if (disabledValues.includes(val)) return
        onChange(val)
        setOpen(false)
    }

    useEffect(() => {
        if (!open) return
        function onKey(e) { if (e.key === 'Escape') setOpen(false) }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open])

    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
    }[columns] || 'grid-cols-2'

    return (
        <>
            {/* Trigger */}
            <div className="space-y-2.5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest px-1 theme-text-muted">
                    {label}
                </h3>
                <button
                    onClick={() => setOpen(true)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border theme-card theme-border hover:opacity-80 transition-all active:scale-[0.98] text-left"
                    style={{ boxShadow: open ? '0 0 0 2px var(--brand)' : undefined }}
                >
                    <span className="flex items-center gap-2">
                        {selected?.emoji && <span className="text-base">{selected.emoji}</span>}
                        <span className="text-sm font-semibold theme-text">{selected?.label ?? '—'}</span>
                    </span>
                    <ChevronDownIcon className="w-4 h-4 text-brand flex-shrink-0" />
                </button>
            </div>

            {/* Bottom sheet */}
            {open && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-50 flex flex-col justify-end"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                    onClick={(e) => { if (e.target === overlayRef.current) setOpen(false) }}
                >
                    <div
                        className="rounded-t-3xl w-full max-w-lg mx-auto flex flex-col"
                        style={{ background: 'var(--bg-elevated)', maxHeight: '75vh' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
                            <p className="text-base font-bold theme-text">Select {label}</p>
                            <button
                                onClick={() => setOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center theme-card theme-border hover:opacity-70 transition-opacity"
                            >
                                <XIcon className="w-4 h-4 theme-text-muted" />
                            </button>
                        </div>

                        {/* Options grid */}
                        <div className="overflow-y-auto flex-1 px-5 pb-8">
                            <div className={`grid gap-2.5 ${gridCols}`}>
                                {options.map((opt) => {
                                    const isSelected = value === opt.value
                                    const isDisabled = disabledValues.includes(opt.value)
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleSelect(opt.value)}
                                            disabled={isDisabled}
                                            title={isDisabled ? 'Not available with current selection' : undefined}
                                            className={`flex flex-col items-start gap-1 p-3 rounded-2xl border text-left transition-all active:scale-95 ${isDisabled
                                                    ? 'opacity-30 cursor-not-allowed theme-card theme-border'
                                                    : isSelected
                                                        ? 'bg-brand/10 border-brand/50 shadow-sm shadow-brand/10'
                                                        : 'theme-card theme-border hover:opacity-80'
                                                }`}
                                        >
                                            {opt.emoji && <span className="text-xl">{opt.emoji}</span>}
                                            <p className={`text-xs font-bold ${isSelected ? 'text-brand-dark' : 'theme-text'}`}>
                                                {opt.label}
                                            </p>
                                            {opt.desc && (
                                                <p className="text-[10px] theme-text-muted leading-snug">{opt.desc}</p>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
