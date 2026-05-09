import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { Logger } from '@/lib/logger/logger.interface'
import type { PrismaClient } from '@/generated/prisma'
import type { DomainEvent, EventBus } from '@/lib/events/event-bus.interface'
import {
  CheckAchievementCommand,
  CheckAchievementResult,
} from './check-achievement.command'
import {
  AchievementUnlockedEvent,
  XPEarnedEvent,
} from '../../../domain/events/achievement.events'
import { GamificationService } from '../../../domain/services/gamification.service'
import {
  EVENT_PROGRESS_STRATEGIES,
  SLUG_PROGRESS_STRATEGIES,
} from '@/modules/achievements/infrastructure/strategies/achievement-progress-strategies'

type UserTransactionClient = Pick<PrismaClient, 'user'>

@injectable()
export class CheckAchievementHandler {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
    @inject(TYPES.EventBus) private readonly eventBus: EventBus,
    @inject(TYPES.GamificationService)
    private readonly gamificationService: GamificationService,
    @inject(TYPES.Logger) private readonly logger: Logger
  ) {}

  async execute(
    command: CheckAchievementCommand
  ): Promise<CheckAchievementResult[]> {
    const { userId, triggerEvent } = command

    this.logger.info('Procesando verificación de logros', {
      userId,
      triggerEvent,
    })

    await new Promise(resolve => setTimeout(resolve, 200))

    const achievements = await this.prisma.achievement.findMany({
      where: { triggerEvent },
      include: { tiers: { orderBy: { threshold: 'asc' } } },
    })

    if (achievements.length === 0) return []

    const progressData = await Promise.all(
      achievements.map(async achievement => {
        const strategy =
          SLUG_PROGRESS_STRATEGIES[achievement.slug] ||
          EVENT_PROGRESS_STRATEGIES[triggerEvent]
        let newProgress = 0

        if (strategy) {
          newProgress = await strategy(this.prisma, userId)
          this.logger.debug('Progreso calculado mediante estrategia', {
            achievementSlug: achievement.slug,
            triggerEvent,
            newProgress,
          })
        } else {
          const existing = await this.prisma.userAchievement.findFirst({
            where: {
              userId,
              achievementId: achievement.id,
              tierAchieved: null,
            },
            orderBy: { progress: 'desc' },
          })
          newProgress = (existing?.progress || 0) + 1
        }

        return { achievement, newProgress }
      })
    )

    const userAchievements = await this.prisma.userAchievement.findMany({
      where: {
        userId,
        achievementId: { in: achievements.map(a => a.id) },
      },
    })

    const results: CheckAchievementResult[] = []
    const eventsToPublish: DomainEvent[] = []
    let totalXPEarnedThisExecution = 0

    try {
      await this.prisma.$transaction(async tx => {
        const dbOperations: Promise<unknown>[] = []

        for (const { achievement, newProgress } of progressData) {
          const tierAchieved = this.gamificationService.calculateTier(
            achievement,
            newProgress
          )

          if (tierAchieved) {
            const existingTierRecord = userAchievements.find(
              ua =>
                ua.achievementId === achievement.id &&
                ua.tierAchieved === tierAchieved
            )

            if (!existingTierRecord) {
              this.logger.info('¡Logro desbloqueado!', {
                userId,
                achievementName: achievement.name,
                tierAchieved,
              })
              dbOperations.push(
                tx.userAchievement.create({
                  data: {
                    userId,
                    achievementId: achievement.id,
                    tierAchieved,
                    progress: newProgress,
                    completedAt: new Date(),
                  },
                })
              )

              const xpEarned = this.gamificationService.getXPReward(
                achievement,
                tierAchieved
              )
              const tier = achievement.tiers.find(t => t.tier === tierAchieved)

              results.push({
                achievementId: achievement.id,
                achievementName: achievement.name,
                tierAchieved,
                xpEarned,
                badgeSlug:
                  tier?.badgeSlug || achievement.badgeSlug || undefined,
                profileFrameSlug:
                  tier?.profileFrameSlug ||
                  achievement.profileFrameSlug ||
                  undefined,
                isNew: true,
              })

              totalXPEarnedThisExecution += xpEarned

              eventsToPublish.push(
                new AchievementUnlockedEvent(
                  userId,
                  achievement.id,
                  achievement.name,
                  tierAchieved || 'completed',
                  xpEarned,
                  tier?.badgeSlug || achievement.badgeSlug || undefined,
                  tier?.profileFrameSlug ||
                    achievement.profileFrameSlug ||
                    undefined
                )
              )

              if (xpEarned > 0) {
                eventsToPublish.push(
                  new XPEarnedEvent(
                    userId,
                    xpEarned,
                    'achievement',
                    achievement.id
                  )
                )
              }
            } else if (newProgress > existingTierRecord.progress) {
              this.logger.info('Actualizando progreso de hito', {
                userId,
                achievementName: achievement.name,
                tierAchieved,
                oldProgress: existingTierRecord.progress,
                newProgress,
              })
              dbOperations.push(
                tx.userAchievement.update({
                  where: { id: existingTierRecord.id },
                  data: { progress: newProgress },
                })
              )
            }
          }
        }

        if (dbOperations.length > 0) {
          this.logger.debug('Ejecutando persistencia de logros', {
            operationsCount: dbOperations.length,
            userId,
          })
          await Promise.all(dbOperations)
        }

        if (totalXPEarnedThisExecution > 0) {
          this.logger.info('Sumando experiencia ganada por logros', {
            userId,
            xpEarned: totalXPEarnedThisExecution,
          })
          await this.applyUserExperience(tx, userId, totalXPEarnedThisExecution)
        }
      })
    } catch (error) {
      this.logger.error(
        'Error crítico en la transacción de logros',
        { userId },
        error as Error
      )
      throw error
    }

    if (eventsToPublish.length > 0) {
      this.logger.info('Publicando eventos de gamificación', {
        userId,
        eventsCount: eventsToPublish.length,
      })
      await this.eventBus.publish(eventsToPublish).catch(err => {
        this.logger.error(
          'Error al publicar eventos de logros',
          { userId },
          err
        )
      })
    }

    return results
  }

  private async applyUserExperience(
    tx: UserTransactionClient,
    userId: string,
    xpToAdd: number
  ): Promise<void> {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { totalXP: true, currentLevel: true },
    })

    if (!user) return

    const newTotalXP = user.totalXP + xpToAdd
    const newLevel = this.gamificationService.calculateLevel(newTotalXP)

    await tx.user.update({
      where: { id: userId },
      data: {
        totalXP: newTotalXP,
        currentLevel: Math.max(user.currentLevel, newLevel),
      },
    })
  }
}
