import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '../../utils/cn'

function ChevronLeftIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

export function Header({ title, showBack = false, onBack, rightAction, className }) {
  const navigate = useNavigate()
  const location = useLocation()

  const isHome = location.pathname === '/'

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <header className={cn(
      'sticky top-0 z-40 flex items-center justify-between px-5 h-14 bg-surface-dark/80 backdrop-blur-xl border-b border-white/5',
      className
    )}>
      <div className="w-10 flex items-center">
        {(showBack || !isHome) && !isHome ? (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center">
            <span className="text-white font-extrabold text-sm">F</span>
          </div>
        )}
      </div>

      <h1 className="text-xs font-bold tracking-[0.2em] text-slate-300 uppercase">
        {title || 'FF Studio'}
      </h1>

      <div className="w-10 flex items-center justify-end">
        {rightAction || <div className="w-5" />}
      </div>
    </header>
  )
}
