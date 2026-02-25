import { useState, useEffect, useCallback } from 'react'
import { historyDB } from '../utils/db'

export function useHistory() {
  const [generations, setGenerations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await historyDB.getAllGenerations()
      setGenerations(data)
    } catch (err) {
      console.error('Failed to load history:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const saveToHistory = useCallback(async (data) => {
    const id = await historyDB.saveGeneration(data)
    await loadHistory()
    return id
  }, [loadHistory])

  const deleteFromHistory = useCallback(async (id) => {
    await historyDB.deleteGeneration(id)
    setGenerations((prev) => prev.filter((g) => g.id !== id))
  }, [])

  const clearHistory = useCallback(async () => {
    await historyDB.clearAll()
    setGenerations([])
  }, [])

  return {
    generations,
    isLoading,
    saveToHistory,
    deleteFromHistory,
    clearHistory,
    refresh: loadHistory,
  }
}
