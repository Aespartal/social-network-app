import { useState, useEffect, useCallback } from 'react'
import { nodeService } from '@/services'
import { AuraNode } from '@/services/node.service'

export const useAuraNodes = () => {
  const [trendingNodes, setTrendingNodes] = useState<AuraNode[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTrending = useCallback(async (limit = 5) => {
    setLoading(true)
    try {
      const response = await nodeService.getTrending(limit)
      if (response.success && response.data) {
        setTrendingNodes(response.data)
      } else {
        setError(response.error || 'Error fetching nodes')
      }
    } catch (err) {
      setError('Network error fetching nodes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrending()
  }, [fetchTrending])

  return {
    trendingNodes,
    loading,
    error,
    refreshNodes: fetchTrending,
  }
}
