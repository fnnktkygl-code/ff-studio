import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { useGenerationStore } from '../../stores/generationStore'
import { useI18nStore } from '../../stores/i18nStore'

function GlobeIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
    </svg>
  )
}

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
  const reset = useGenerationStore((s) => s.reset)
  const language = useI18nStore((s) => s.language)
  const setLanguage = useI18nStore((s) => s.setLanguage)

  const isHome = location.pathname === '/'

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  const handleLogoClick = () => {
    reset()
    navigate('/')
  }

  return (
    <header
      className={cn('sticky top-0 z-40 flex items-center justify-between px-5 h-14 backdrop-blur-xl border-b', className)}
      style={{
        background: 'var(--nav-bg)',
        borderColor: 'var(--nav-border)',
      }}
    >
      <div className="w-10 flex items-center">
        {(showBack || !isHome) && !isHome ? (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full active:scale-95 transition-all"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-elevated)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' }}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleLogoClick}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <span className="text-white font-extrabold text-sm">F</span>
          </button>
        )}
      </div>

      <h1
        className="flex-1 text-center text-xs font-bold tracking-[0.2em] uppercase"
        style={{ color: 'var(--text-primary)' }}
      >
        {title || 'Fatma Shooting Studio'}
      </h1>

      <div className="w-auto flex items-center justify-end gap-2">
        <button
          onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
          style={{ color: 'var(--text-secondary)' }}
          title={language === 'fr' ? 'Switch to English' : 'Passer en français'}
        >
          <GlobeIcon className="w-3.5 h-3.5" />
          <span className="uppercase">{language}</span>
        </button>
        {rightAction || <div className="w-2" />}
      </div>
    </header>
  )
}
