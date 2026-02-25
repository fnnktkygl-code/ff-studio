import { useState, useEffect, useCallback } from 'react'

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    return outcome === 'accepted'
  }, [deferredPrompt])

  const dismissInstall = useCallback(() => {
    setDeferredPrompt(null)
    localStorage.setItem('ff_install_dismissed', Date.now().toString())
  }, [])

  const wasDismissedRecently = () => {
    const dismissed = localStorage.getItem('ff_install_dismissed')
    if (!dismissed) return false
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    return Date.now() - parseInt(dismissed) < sevenDays
  }

  return {
    canInstall: !!deferredPrompt && !wasDismissedRecently(),
    isInstalled,
    promptInstall,
    dismissInstall,
  }
}
