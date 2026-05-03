import { useState, useCallback, useEffect } from 'react'
import {
  achievementService,
  UserAchievement,
  AchievementsResponse,
} from '@/services/post.service'

interface UseAchievementsReturn {
  achievements: UserAchievement[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  getAchievementsByCategory: (category: string) => UserAchievement[]
  totalXP: number
  level: number
  levelTitle: string
  nextLevelXP: number
  progressToNextLevel: number
  completedCount: number
}

export const useAchievements = (userId?: string): UseAchievementsReturn => {
  const [data, setData] = useState<{
    achievements: UserAchievement[]
    totalXP: number
    level: number
    levelTitle: string
    nextLevelXP: number
    progressToNextLevel: number
  }>({
    achievements: [],
    totalXP: 0,
    level: 1,
    levelTitle: 'Novato',
    nextLevelXP: 100,
    progressToNextLevel: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let response: AchievementsResponse
      if (userId) {
        response = await achievementService.getUserAchievements(userId)
      } else {
        response = await achievementService.getMyAchievements()
      }

      setData(response)
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || 'Error al cargar logros'
      )
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  const getAchievementsByCategory = useCallback(
    (category: string) => {
      return data.achievements.filter(a => a.category === category)
    },
    [data.achievements]
  )

  const completedCount = data.achievements.filter(
    a => a.completedAt !== null
  ).length

  return {
    achievements: data.achievements,
    loading,
    error,
    refetch: fetchAchievements,
    getAchievementsByCategory,
    totalXP: data.totalXP,
    level: data.level,
    levelTitle: data.levelTitle,
    nextLevelXP: data.nextLevelXP,
    progressToNextLevel: data.progressToNextLevel,
    completedCount,
  }
}
