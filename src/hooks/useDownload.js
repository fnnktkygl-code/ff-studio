import { useCallback } from 'react'
import { base64ToBlob } from '../utils/imageUtils'

export function useDownload() {
  const downloadImage = useCallback((base64, filename = 'fashion-photo.jpg') => {
    const blob = base64ToBlob(base64)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  const downloadAll = useCallback((base64Array) => {
    base64Array.forEach((b64, i) => {
      setTimeout(() => {
        downloadImage(b64, `ff-studio-${i + 1}.jpg`)
      }, i * 300)
    })
  }, [downloadImage])

  return { downloadImage, downloadAll }
}
