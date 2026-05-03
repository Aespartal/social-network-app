import { useState, useEffect, useCallback } from 'react'
import { profileService } from '@/services/profile.service'
import { LevelInfo } from '@/constants/levels'

interface UseUserLevelReturn {
  levelInfo: LevelInfo | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useUserLevel = (
  userId: string | undefined
): UseUserLevelReturn => {
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLevel = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await profileService.getUserLevel(userId)
      setLevelInfo(data)
    } catch (err) {
      setError('Error al cargar nivel')
      console.error('Error fetching user level:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchLevel()
  }, [fetchLevel])

  return {
    levelInfo,
    loading,
    error,
    refetch: fetchLevel,
  }
}
