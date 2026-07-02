import { useState, useCallback, useRef } from 'react'
import { useGenerationStore } from '../stores/generationStore'
import {
  detectGarment,
  detectGarmentViaServer,
  getClientApiKey,
  hasCloudFunction,
} from '../utils/api'
import {
  buildDetectionPrompt,
  getDetectionResponseSchema,
  parseDetectionResult,
} from '../utils/autoDetect'

/**
 * useAutoDetect — Hook for intelligent garment auto-detection via Flash Lite.
 *
 * Features:
 * - Dual-mode: server-side (if backend available) or client-side (API key)
 * - 10s timeout, no retries
 * - Silent fallback on any error
 * - Tracks which fields were auto-detected for UI badges
 * - Manual override clears the "detected" status for that field
 */
export function useAutoDetect() {
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedFields, setDetectedFields] = useState({}) // { fieldName: value }
  const [detectedCount, setDetectedCount] = useState(0)
  const abortRef = useRef(false)

  const setOption = useGenerationStore((s) => s.setOption)

  /**
   * Run detection on the first uploaded image.
   * @param {string} imageBase64 - Full data URI
   */
  const detect = useCallback(async (imageBase64) => {
    if (!imageBase64 || isDetecting) return

    setIsDetecting(true)
    abortRef.current = false

    try {
      let rawResult = null

      // Strategy 1: Server-side detection (if backend available)
      if (hasCloudFunction()) {
        rawResult = await detectGarmentViaServer(imageBase64)
      }

      // Strategy 2: Client-side detection (API key)
      if (!rawResult && !abortRef.current) {
        const apiKey = getClientApiKey()
        if (apiKey) {
          const prompt = buildDetectionPrompt()
          const schema = getDetectionResponseSchema()
          rawResult = await detectGarment(apiKey, imageBase64, prompt, schema)
        }
      }

      if (abortRef.current) return

      if (!rawResult) {
        console.warn('[useAutoDetect] Detection returned no results — using defaults')
        return
      }

      // Parse and validate against schema
      const { fields, count } = parseDetectionResult(rawResult)

      if (count === 0) {
        console.warn('[useAutoDetect] No valid fields detected')
        return
      }

      // Apply detected fields to the store
      for (const [optionKey, value] of Object.entries(fields)) {
        setOption(optionKey, value)
      }

      // Track which fields were auto-detected
      setDetectedFields(fields)
      setDetectedCount(count)
    } catch (err) {
      // Silent fallback — never block the user
      console.warn('[useAutoDetect] Detection failed silently:', err.message || err)
    } finally {
      if (!abortRef.current) {
        setIsDetecting(false)
      }
    }
  }, [isDetecting, setOption])

  /**
   * Check if a specific field was auto-detected (for badge display).
   */
  const isFieldDetected = useCallback(
    (fieldName) => fieldName in detectedFields,
    [detectedFields]
  )

  /**
   * Mark a field as manually overridden (remove detected status).
   */
  const markOverridden = useCallback((fieldName) => {
    setDetectedFields((prev) => {
      const next = { ...prev }
      delete next[fieldName]
      setDetectedCount(Object.keys(next).length)
      return next
    })
  }, [])

  /**
   * Clear all detection state.
   */
  const clearDetection = useCallback(() => {
    abortRef.current = true
    setDetectedFields({})
    setDetectedCount(0)
    setIsDetecting(false)
  }, [])

  return {
    detect,
    isDetecting,
    detectedFields,
    detectedCount,
    isFieldDetected,
    markOverridden,
    clearDetection,
  }
}
