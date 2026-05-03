import { injectable } from 'inversify'
import {
  EVENT_PROGRESS_STRATEGIES,
  ProgressClient,
  SLUG_PROGRESS_STRATEGIES,
} from '../../infrastructure/strategies/achievement-progress-strategies'
import { AchievementTierType } from '../entities/achievement.entity'

export const LEVEL_XP_THRESHOLDS = [0, 100, 300, 600, 1000, 2000] as const

@injectable()
export class GamificationService {
  /**
   * Calcula el progreso actual para un logro específico usando de forma reactiva las estrategias
   */
  public async calculateProgress(
    tx: ProgressClient,
    userId: string,
    achievement: { slug: string; triggerEvent: string }
  ): Promise<number> {
    const strategy =
      SLUG_PROGRESS_STRATEGIES[achievement.slug] ||
      EVENT_PROGRESS_STRATEGIES[achievement.triggerEvent]

    if (strategy) {
      return await strategy(tx, userId)
    }

    return 0
  }
  /**
   * Calcula el nivel basado en la experiencia total
   */
  public calculateLevel(totalXP: number): number {
    for (let i = LEVEL_XP_THRESHOLDS.length - 1; i >= 0; i--) {
      const threshold = LEVEL_XP_THRESHOLDS[i]
      if (threshold !== undefined && totalXP >= threshold) {
        return i + 1
      }
    }
    return 1
  }

  /**
   * Calcula si se ha alcanzado un nuevo tier basado en el progreso
   */
  public calculateTier(
    achievement: {
      tierType: string
      tiers: { tier: string; threshold: number }[]
    },
    progress: number
  ): string | null {
    if (achievement.tierType === AchievementTierType.BINARY) {
      return progress >= 1 ? 'completed' : null
    }

    const sortedTiers = [...achievement.tiers].sort(
      (a, b) => b.threshold - a.threshold
    )

    for (const tier of sortedTiers) {
      if (progress >= tier.threshold) {
        return tier.tier
      }
    }

    return null
  }

  /**
   * Obtiene la recompensa de XP para un tier específico
   */
  public getXPReward(
    achievement: {
      xpReward: number
      tiers: { tier: string; xpReward: number }[]
    },
    tierName: string | null
  ): number {
    if (!tierName) return 0
    const tier = achievement.tiers.find(t => t.tier === tierName)
    return tier?.xpReward || achievement.xpReward
  }

  /**
   * Obtiene el umbral de XP para un nivel específico
   */
  public getLevelThreshold(level: number): number {
    return LEVEL_XP_THRESHOLDS[level - 1] ?? 0
  }
}
