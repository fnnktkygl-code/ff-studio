import { useCallback } from 'react'

export function useHaptics() {
  const vibrate = useCallback((pattern) => {
    navigator.vibrate?.(pattern)
  }, [])

  return {
    light: () => vibrate(10),
    medium: () => vibrate(25),
    heavy: () => vibrate(50),
    success: () => vibrate([10, 50, 20]),
    error: () => vibrate([50, 30, 50, 30, 50]),
  }
}
