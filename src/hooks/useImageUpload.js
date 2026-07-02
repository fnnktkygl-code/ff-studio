import { useRef, useCallback } from 'react'
import { useGenerationStore } from '../stores/generationStore'
import { compressImage, fileToBase64 } from '../utils/imageUtils'
import { useToast } from './useToast'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function useImageUpload() {
  const inputRef = useRef(null)
  const addImage = useGenerationStore((s) => s.addImage)
  const images = useGenerationStore((s) => s.images)
  const toast = useToast()

  const processFile = useCallback(async (file) => {
    // Specifically catch HEIC/HEIF from iOS devices
    const isHeic = file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic')
    if (isHeic) {
      throw new Error(`HEIC format is not supported yet. Please use JPEG or PNG.`)
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type || 'unknown'}`)
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File too large (max 10MB)')
    }

    const compressed = await compressImage(file)
    const base64 = await fileToBase64(compressed)
    const preview = URL.createObjectURL(compressed)

    return { file: compressed, preview, base64 }
  }, [])

  const handleFiles = useCallback(async (files) => {
    const available = 4 - images.length
    const toProcess = Array.from(files).slice(0, available)
    const results = []

    for (const file of toProcess) {
      try {
        const imageData = await processFile(file)
        addImage(imageData)
        results.push(imageData)
      } catch (err) {
        console.error('Failed to process image:', err)
        toast.error(err.message || 'Failed to process image')
      }
    }

    return results
  }, [images.length, processFile, addImage])

  const openPicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleInputChange = useCallback((e) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files)
    }
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [handleFiles])

  return {
    inputRef,
    openPicker,
    handleInputChange,
    handleFiles,
    canAddMore: images.length < 4,
  }
}
