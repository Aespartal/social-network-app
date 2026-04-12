import { useState, useCallback, useEffect } from 'react'
import { postService } from '@/services/post.service'
import { useAuth } from './useAuth'

export interface RecentSearch {
  id: string
  query: string
  createdAt: string
}

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchRecentSearches = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = await postService.getRecentSearches()
      setRecentSearches(data)
    } catch (err) {
      console.error('Error fetching recent searches:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  const deleteSearch = async (id: string) => {
    try {
      await postService.deleteRecentSearch(id)
      setRecentSearches(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error('Error deleting recent search:', err)
    }
  }

  const clearAll = async () => {
    try {
      await postService.clearRecentSearches()
      setRecentSearches([])
    } catch (err) {
      console.error('Error clearing recent searches:', err)
    }
  }

  useEffect(() => {
    fetchRecentSearches()
  }, [fetchRecentSearches])

  return {
    recentSearches,
    loading,
    refresh: fetchRecentSearches,
    deleteSearch,
    clearAll,
  }
}
