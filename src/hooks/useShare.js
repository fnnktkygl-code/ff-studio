import { useCallback } from 'react'
import { base64ToBlob } from '../utils/imageUtils'

export function useShare() {
  const canShare = typeof navigator.share === 'function'

  const shareImage = useCallback(async (base64, title = 'FF Studio - Fashion Photo') => {
    const blob = base64ToBlob(base64)
    const file = new File([blob], 'fashion-photo.jpg', { type: 'image/jpeg' })

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title, files: [file] })
    } else if (navigator.share) {
      await navigator.share({ title, text: 'Check out this AI-generated fashion photo!' })
    }
  }, [])

  const shareAll = useCallback(async (base64Array, title = 'FF Studio - Fashion Collection') => {
    const files = base64Array.map((b64, i) =>
      new File([base64ToBlob(b64)], `fashion-photo-${i + 1}.jpg`, { type: 'image/jpeg' })
    )

    if (navigator.canShare?.({ files })) {
      await navigator.share({ title, files })
    } else if (navigator.share) {
      await navigator.share({ title, text: `${base64Array.length} AI-generated fashion photos` })
    }
  }, [])

  return { canShare, shareImage, shareAll }
}
