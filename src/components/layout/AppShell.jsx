import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { BottomNav } from './BottomNav'
import { ToastContainer } from '../common/ToastContainer'
import { InstallBanner } from '../common/InstallBanner'
import { useThemeStore } from '../../stores/themeStore'

export function AppShell() {
  const location = useLocation()
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div
      id="app-root"
      data-theme={theme}
      className="min-h-screen flex flex-col max-w-lg mx-auto relative transition-colors duration-200"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>

      <BottomNav />
      <ToastContainer />
      <InstallBanner />
    </div>
  )
}
