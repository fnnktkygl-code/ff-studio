import { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { PageTransition } from '../components/layout/PageTransition'
import { Button } from '../components/common/Button'
import { usePWAInstall } from '../hooks/usePWAInstall'
import { useHistory } from '../hooks/useHistory'
import { useToast } from '../hooks/useToast'
import { useThemeStore } from '../stores/themeStore'
import { getClientApiKey } from '../utils/api'

function KeyIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" /><path d="m21 2-9.6 9.6" /><circle cx="7.5" cy="15.5" r="5.5" />
    </svg>
  )
}

function DownloadIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}

function TrashIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}

function CheckIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function SunIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

const sectionStyle = {
  background: 'var(--section-bg)',
  border: '1px solid var(--border)',
  borderRadius: '1rem',
  padding: '1rem',
}

export function SettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const [serverStatus, setServerStatus] = useState('checking')
  const { canInstall, isInstalled, promptInstall } = usePWAInstall()
  const { clearHistory, generations } = useHistory()
  const toast = useToast()
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

  useEffect(() => {
    setApiKey(getClientApiKey())
    fetch('/api/health')
      .then(r => r.json())
      .then(data => setServerStatus(data.hasAuth ? 'connected' : 'no-key'))
      .catch(() => setServerStatus('offline'))
  }, [])

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('ff_studio_api_key', apiKey.trim())
      toast.success('API key saved')
    } else {
      localStorage.removeItem('ff_studio_api_key')
      toast.info('API key removed')
    }
  }

  const handleClearHistory = async () => {
    await clearHistory()
    toast.success('History cleared')
  }

  return (
    <PageTransition>
      <Header title="Settings" />

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24 space-y-4">

        {/* Theme Toggle */}
        <div style={sectionStyle}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-elevated)' }}>
                {isDark
                  ? <MoonIcon className="w-4 h-4 text-brand" />
                  : <SunIcon className="w-4 h-4 text-brand" />
                }
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {isDark ? 'Switch to warm light theme' : 'Switch to dark theme'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-7 rounded-full transition-colors relative ${isDark ? 'bg-slate-700' : 'bg-gradient-to-r from-brand-dark to-brand'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow ${isDark ? 'translate-x-1' : 'translate-x-6'}`} />
            </button>
          </div>
        </div>

        {/* Server Status */}
        <div style={sectionStyle} className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-label)' }}>Server Status</h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${serverStatus === 'connected' ? 'bg-emerald-400' :
                serverStatus === 'no-key' ? 'bg-yellow-400' :
                  serverStatus === 'offline' ? 'bg-red-400' :
                    'bg-slate-500 animate-pulse'
              }`} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {serverStatus === 'connected' && 'Connected with API key'}
              {serverStatus === 'no-key' && 'Server running, no API key configured'}
              {serverStatus === 'offline' && 'Server offline — using fallback mode'}
              {serverStatus === 'checking' && 'Checking...'}
            </span>
          </div>
        </div>

        {/* API Key Fallback */}
        <div style={sectionStyle} className="space-y-3">
          <div className="flex items-center gap-2">
            <KeyIcon className="w-4 h-4 text-brand" />
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-label)' }}>Fallback API Key</h3>
          </div>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            Used when the proxy server is unavailable. Your key is stored locally on this device only.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter Gemini API key..."
              className="flex-1 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 transition-colors"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--input-text)',
              }}
            />
            <Button size="sm" onClick={handleSaveApiKey}>
              <CheckIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Install PWA */}
        {!isInstalled && (
          <div style={sectionStyle} className="space-y-3">
            <div className="flex items-center gap-2">
              <DownloadIcon className="w-4 h-4 text-brand" />
              <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-label)' }}>Install App</h3>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Install Fatma Shooting Studio to your home screen for full-screen experience and quick access.
            </p>
            {canInstall ? (
              <Button size="sm" onClick={promptInstall}>Install Now</Button>
            ) : (
              <p className="text-[11px] italic" style={{ color: 'var(--text-muted)' }}>
                Open in Safari (iOS) or Chrome (Android) to install.
              </p>
            )}
          </div>
        )}

        {isInstalled && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-emerald-400">App installed</span>
            </div>
          </div>
        )}

        {/* Clear History */}
        <div style={sectionStyle} className="space-y-3">
          <div className="flex items-center gap-2">
            <TrashIcon className="w-4 h-4 text-red-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-label)' }}>Data</h3>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {generations.length} generation{generations.length !== 1 ? 's' : ''} saved
            </p>
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearHistory}
              disabled={generations.length === 0}
            >
              Clear History
            </Button>
          </div>
        </div>

        {/* About */}
        <div style={{ ...sectionStyle, textAlign: 'center' }} className="space-y-2">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center">
            <span className="text-white font-extrabold text-lg">F</span>
          </div>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Fatma Shooting Studio</p>
          <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Fashion Photography Studio</p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Version 1.0.0</p>
        </div>
      </div>
    </PageTransition>
  )
}
