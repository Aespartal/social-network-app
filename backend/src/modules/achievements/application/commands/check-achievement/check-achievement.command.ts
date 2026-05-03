export interface CheckAchievementCommand {
  userId: string
  triggerEvent: string
  metadata?: Record<string, unknown>
}

export interface CheckAchievementResult {
  achievementId: string
  achievementName: string
  tierAchieved?: string
  xpEarned: number
  badgeSlug?: string
  profileFrameSlug?: string
  isNew: boolean
}
