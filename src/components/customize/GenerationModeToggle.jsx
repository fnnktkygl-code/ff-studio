import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

function UserIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="12" cy="10" r="3" /><path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function ShirtIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  )
}

function LayersIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 12.5-8.58 4.08a2 2 0 0 1-1.66 0L2 12.5" />
    </svg>
  )
}

const MODES = [
  { value: 'model', label: 'On Model', icon: UserIcon },
  { value: 'product', label: 'Product', icon: ShirtIcon },
  { value: 'both', label: 'Both (8x)', icon: LayersIcon },
]

export function GenerationModeToggle({ value, onChange }) {
  return (
    <div className="relative flex theme-elevated p-1 rounded-2xl border theme-border">
      {MODES.map((mode) => {
        const isActive = value === mode.value
        const Icon = mode.icon

        return (
          <button
            key={mode.value}
            onClick={() => onChange(mode.value)}
            className={cn(
              'relative flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-[10px] font-bold transition-colors z-10',
              isActive ? 'text-white' : 'theme-text-sec hover:theme-text'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="mode-indicator"
                className="absolute inset-0 bg-gradient-to-r from-brand-dark to-brand rounded-xl shadow-lg shadow-brand-dark/20"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{mode.label}</span>
          </button>
        )
      })}
    </div>
  )
}
