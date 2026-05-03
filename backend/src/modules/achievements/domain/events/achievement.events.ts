import { DomainEvent } from '@/lib/events/event-bus.interface'

export class AchievementUnlockedEvent implements DomainEvent {
  readonly eventName = 'AchievementUnlockedEvent'
  readonly occurredOn: Date

  constructor(
    readonly userId: string,
    readonly achievementId: string,
    readonly achievementName: string,
    readonly tierAchieved: string,
    readonly xpEarned: number,
    readonly badgeSlug?: string,
    readonly profileFrameSlug?: string
  ) {
    this.occurredOn = new Date()
  }
}

export class StreakUpdatedEvent implements DomainEvent {
  readonly eventName = 'StreakUpdatedEvent'
  readonly occurredOn: Date

  constructor(
    readonly userId: string,
    readonly streakType: 'login' | 'post' | 'engagement',
    readonly newStreakCount: number,
    readonly xpEarned: number
  ) {
    this.occurredOn = new Date()
  }
}

export class XPEarnedEvent implements DomainEvent {
  readonly eventName = 'XPEarnedEvent'
  readonly occurredOn: Date

  constructor(
    readonly userId: string,
    readonly amount: number,
    readonly source: string,
    readonly sourceId?: string
  ) {
    this.occurredOn = new Date()
  }
}
