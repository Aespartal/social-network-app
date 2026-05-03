export interface GetUserAchievementsQuery {
  userId: string
  includeHidden?: boolean
}

export interface UserAchievementDTO {
  id: string
  achievementId: string
  achievementName: string
  achievementSlug: string
  description: string | null
  category: string
  tierAchieved: string | null
  progress: number
  iconEmoji: string | null
  completedAt: Date | null
  xpEarned: number
}
