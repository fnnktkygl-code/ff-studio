import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { BottomNav } from './BottomNav'
import { ToastContainer } from '../common/ToastContainer'
import { InstallBanner } from '../common/InstallBanner'

export function AppShell() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-surface-dark flex flex-col max-w-lg mx-auto relative">
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>

      <BottomNav />
      <ToastContainer />
      <InstallBanner />
    </div>
  )
}
