import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
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
    private readonly gamificationService: GamificationService
  ) {}

  async execute(
    command: CheckAchievementCommand
  ): Promise<CheckAchievementResult[]> {
    const { userId, triggerEvent } = command

    console.log(
      `🔍 [CheckAchievement] Procesando evento: ${triggerEvent} para usuario: ${userId}`
    )

    // Pequeño delay de 200ms para asegurar consistencia en la lectura de DB
    await new Promise(resolve => setTimeout(resolve, 200))

    // 1. Cargar metadatos de logros
    const achievements = await this.prisma.achievement.findMany({
      where: { triggerEvent },
      include: { tiers: { orderBy: { threshold: 'asc' } } },
    })

    if (achievements.length === 0) return []

    // 2. Ejecutar estrategias de cálculo en paralelo (fuera de la transacción de escritura)
    // Esto evita bloquear la base de datos durante los conteos.
    const progressData = await Promise.all(
      achievements.map(async achievement => {
        const strategy =
          SLUG_PROGRESS_STRATEGIES[achievement.slug] ||
          EVENT_PROGRESS_STRATEGIES[triggerEvent]
        let newProgress = 0

        if (strategy) {
          newProgress = await strategy(this.prisma, userId)
          console.log(
            `📊 [CheckAchievement] Progreso para '${achievement.slug}' (${triggerEvent}): ${newProgress}`
          )
        } else {
          // Si no hay estrategia, buscamos el progreso actual
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

    // 3. Cargar logros ya obtenidos para validación de tiers
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: {
        userId,
        achievementId: { in: achievements.map(a => a.id) },
      },
    })

    const results: CheckAchievementResult[] = []
    const eventsToPublish: DomainEvent[] = []
    let totalXPEarnedThisExecution = 0

    // 4. Iniciar transacción solo para persistencia en bloque
    // 4. Iniciar transacción solo para persistencia de nuevos hitos alcanzados
    try {
      await this.prisma.$transaction(async tx => {
        const dbOperations: Promise<unknown>[] = []

        for (const { achievement, newProgress } of progressData) {
          // Calcular tiers alcanzados
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
              console.log(
                `🏆 [CheckAchievement] ¡Logro desbloqueado! ${achievement.name} - Tier: ${tierAchieved}`
              )
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
              // Si ya tiene el tier, pero el progreso ha aumentado, actualizamos el registro
              console.log(
                `📈 [CheckAchievement] Actualizando progreso para ${achievement.name} (${tierAchieved}): ${existingTierRecord.progress} -> ${newProgress}`
              )
              dbOperations.push(
                tx.userAchievement.update({
                  where: { id: existingTierRecord.id },
                  data: { progress: newProgress },
                })
              )
            }
          }
        }

        // Ejecutar persistencias en paralelo (solo si hubo hitos nuevos)
        if (dbOperations.length > 0) {
          console.log(
            `[CheckAchievement] Ejecutando ${dbOperations.length} operaciones de DB...`
          )
          await Promise.all(dbOperations)
        }

        // Actualizar experiencia si se consiguieron logros
        if (totalXPEarnedThisExecution > 0) {
          console.log(
            `[CheckAchievement] Sumando ${totalXPEarnedThisExecution} XP al usuario ${userId}`
          )
          await this.applyUserExperience(tx, userId, totalXPEarnedThisExecution)
        }
      })
    } catch (error) {
      console.error(
        `❌ [CheckAchievement] Error en transacción para usuario ${userId}:`,
        error
      )
      throw error
    }

    // 5. Notificar eventos
    if (eventsToPublish.length > 0) {
      console.log(
        `[CheckAchievement] Publishing ${eventsToPublish.length} events for user ${userId}`
      )
      await this.eventBus.publish(eventsToPublish).catch(err => {
        console.error(`❌ [CheckAchievement] Error al publicar eventos:`, err)
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
