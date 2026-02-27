import { useState, useRef, useEffect } from 'react'
import { GARMENT_TYPES, GARMENT_CATEGORIES } from '../../utils/constants'

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

export function GarmentPicker({ value, onChange, disabledValues = [] }) {
    const [open, setOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState('all')
    const overlayRef = useRef(null)

    const selected = GARMENT_TYPES.find((g) => g.value === value) || GARMENT_TYPES[0]

    const filtered = activeCategory === 'all'
        ? GARMENT_TYPES
        : GARMENT_TYPES.filter((g) => g.category === activeCategory)

    function handleSelect(val) {
        if (disabledValues.includes(val)) return
        onChange(val)
        setOpen(false)
    }

    // Close on backdrop click
    useEffect(() => {
        if (!open) return
        function onKey(e) { if (e.key === 'Escape') setOpen(false) }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open])

    return (
        <>
            {/* Trigger button */}
            <div className="space-y-2.5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest px-1 theme-text-muted">
                    Garment Type
                </h3>
                <button
                    onClick={() => setOpen(true)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border theme-card theme-border hover:opacity-80 transition-all active:scale-[0.98] text-left"
                    style={{ boxShadow: open ? '0 0 0 2px var(--brand)' : undefined }}
                >
                    <span className="flex items-center gap-2">
                        <span className="text-base">{selected.emoji}</span>
                        <span className="text-sm font-semibold theme-text">
                            {GARMENT_CATEGORIES.find(c => c.value === selected.category)?.label} · {selected.label}
                        </span>
                    </span>
                    <ChevronDownIcon className="w-4 h-4 text-brand flex-shrink-0" />
                </button>
            </div>

            {/* Bottom sheet overlay */}
            {open && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-50 flex flex-col justify-end"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                    onClick={(e) => { if (e.target === overlayRef.current) setOpen(false) }}
                >
                    <div
                        className="rounded-t-3xl w-full max-w-lg mx-auto flex flex-col"
                        style={{
                            background: 'var(--bg-elevated)',
                            maxHeight: '80vh',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
                            <p className="text-base font-bold theme-text">Select Garment</p>
                            <button
                                onClick={() => setOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center theme-card theme-border hover:opacity-70 transition-opacity"
                            >
                                <XIcon className="w-4 h-4 theme-text-muted" />
                            </button>
                        </div>

                        {/* Category pills */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-3 flex-shrink-0">
                            {GARMENT_CATEGORIES.map((cat) => {
                                const isActive = activeCategory === cat.value
                                return (
                                    <button
                                        key={cat.value}
                                        onClick={() => setActiveCategory(cat.value)}
                                        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${isActive
                                                ? 'bg-gradient-to-r from-brand-dark to-brand text-white border-transparent shadow-md shadow-brand/25'
                                                : 'theme-card theme-border theme-text-sec hover:opacity-80'
                                            }`}
                                    >
                                        <span>{cat.emoji}</span>
                                        <span>{cat.label}</span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Garment grid */}
                        <div className="overflow-y-auto flex-1 px-5 pb-8">
                            <div className="grid grid-cols-2 gap-2.5">
                                {filtered.map((garment) => {
                                    const isSelected = value === garment.value
                                    const isDisabled = disabledValues.includes(garment.value)
                                    return (
                                        <button
                                            key={garment.value}
                                            onClick={() => handleSelect(garment.value)}
                                            disabled={isDisabled}
                                            title={isDisabled ? 'Not available with current selection' : undefined}
                                            className={`flex flex-col items-start gap-1 p-3 rounded-2xl border text-left transition-all active:scale-95 ${isDisabled
                                                    ? 'opacity-30 cursor-not-allowed theme-card theme-border'
                                                    : isSelected
                                                        ? 'bg-brand/10 border-brand/50 shadow-sm shadow-brand/10'
                                                        : 'theme-card theme-border hover:opacity-80'
                                                }`}
                                        >
                                            <span className="text-xl">{garment.emoji}</span>
                                            <p className={`text-xs font-bold ${isSelected ? 'text-brand-dark' : 'theme-text'}`}>
                                                {garment.label}
                                            </p>
                                            <p className="text-[10px] theme-text-muted leading-snug">{garment.desc}</p>
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
