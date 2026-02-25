import { AnimatePresence } from 'framer-motion'
import { useToast } from '../../hooks/useToast'
import { Toast } from './Toast'

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] flex flex-col gap-2 items-center pointer-events-none max-w-lg mx-auto">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full">
            <Toast toast={toast} onDismiss={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
