import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { PrismaClient } from '@/generated/prisma'
import {
  GetUserAchievementsQuery,
  UserAchievementDTO,
} from './get-user-achievements.query'
import { GamificationService } from '../../../domain/services/gamification.service'
import type { Logger } from '@/lib/logger/logger.interface'

@injectable()
export class GetUserAchievementsHandler {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
    @inject(TYPES.GamificationService)
    private readonly gamificationService: GamificationService,
    @inject(TYPES.Logger)
    private readonly logger: Logger
  ) {}

  async execute(query: GetUserAchievementsQuery): Promise<{
    achievements: UserAchievementDTO[]
    totalXP: number
    level: number
    levelTitle: string
    nextLevelXP: number
    progressToNextLevel: number
  }> {
    const { userId, includeHidden = false } = query

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { totalXP: true, currentLevel: true },
    })

    if (!user) {
      this.logger.error('Usuario no encontrado', { userId })
      throw new Error('Usuario no encontrado')
    }

    const achievements = await this.prisma.achievement.findMany({
      where: includeHidden ? {} : { isHidden: false },
      include: { tiers: true },
    })

    const userUnlockedTiers = await this.prisma.userAchievement.findMany({
      where: { userId, tierAchieved: { not: null } },
    })
    const achievementResults = await Promise.all(
      achievements.map(async achievement => {
        const progress = await this.gamificationService.calculateProgress(
          this.prisma,
          userId,
          achievement
        )

        const highestUnlockedTier = userUnlockedTiers
          .filter(ua => ua.achievementId === achievement.id)
          .sort(
            (a, b) =>
              (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0)
          )[0]

        const tierDetails = achievement.tiers?.find(
          t => t.tier === highestUnlockedTier?.tierAchieved
        )

        return {
          id: highestUnlockedTier?.id || `progress-${achievement.id}`,
          achievementId: achievement.id,
          achievementName: achievement.name,
          achievementSlug: achievement.slug,
          description: achievement.description,
          category: achievement.category,
          tierAchieved: highestUnlockedTier?.tierAchieved || null,
          progress: progress,
          iconEmoji: achievement.iconEmoji,
          completedAt: highestUnlockedTier?.completedAt || null,
          xpEarned: tierDetails?.xpReward || achievement.xpReward,
        }
      })
    )

    const currentXP = user.totalXP || 0
    const level = this.gamificationService.calculateLevel(currentXP)
    const nextLevelXP =
      this.gamificationService.getLevelThreshold(level + 1) || currentXP
    const minXP = this.gamificationService.getLevelThreshold(level)

    const levelTitle = this.getLevelTitle(level)

    const progressToNextLevel =
      nextLevelXP > minXP
        ? Math.round(((currentXP - minXP) / (nextLevelXP - minXP)) * 100)
        : 100

    return {
      achievements: achievementResults.sort((a, b) => {
        if (a.completedAt && !b.completedAt) return -1
        if (!a.completedAt && b.completedAt) return 1
        if (a.completedAt && b.completedAt)
          return b.completedAt.getTime() - a.completedAt.getTime()
        return b.progress - a.progress
      }),
      totalXP: currentXP,
      level: level,
      levelTitle: levelTitle,
      nextLevelXP: nextLevelXP,
      progressToNextLevel: progressToNextLevel,
    }
  }

  private getLevelTitle(level: number): string {
    const titles = [
      'Novato',
      'Explorador',
      'Contribuidor',
      'Veterano',
      'Maestro',
      'Leyenda',
    ]
    return titles[level - 1] || 'Usuario'
  }
}
