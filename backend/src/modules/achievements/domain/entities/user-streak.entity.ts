export enum StreakType {
  LOGIN = 'login',
  POST = 'post',
  ENGAGEMENT = 'engagement',
}

export class UserStreak {
  private readonly _id: string
  private readonly _userId: string
  private readonly _streakType: StreakType
  private _currentCount: number
  private _longestCount: number
  private _lastActivityAt: Date
  private _freezeTokens: number
  private _streakShieldUsed: boolean

  private constructor(props: UserStreakProps) {
    this._id = props.id
    this._userId = props.userId
    this._streakType = props.streakType
    this._currentCount = props.currentCount
    this._longestCount = props.longestCount
    this._lastActivityAt = props.lastActivityAt
    this._freezeTokens = props.freezeTokens
    this._streakShieldUsed = props.streakShieldUsed
  }

  static reconstitute(props: UserStreakProps): UserStreak {
    return new UserStreak(props)
  }

  get id(): string {
    return this._id
  }

  get userId(): string {
    return this._userId
  }

  get streakType(): StreakType {
    return this._streakType
  }

  get currentCount(): number {
    return this._currentCount
  }

  get longestCount(): number {
    return this._longestCount
  }

  get lastActivityAt(): Date {
    return this._lastActivityAt
  }

  get freezeTokens(): number {
    return this._freezeTokens
  }

  get streakShieldUsed(): boolean {
    return this._streakShieldUsed
  }

  get canUseFreezeToken(): boolean {
    return this._freezeTokens > 0
  }

  get multiplier(): number {
    // Multiplier increases every 7 days
    return Math.min(1 + Math.floor(this._currentCount / 7) * 0.5, 3.0)
  }

  recordActivity(): void {
    const now = new Date()
    const daysDiff = Math.floor(
      (now.getTime() - this._lastActivityAt.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysDiff === 0) {
      // Same day, no change
      return
    }

    if (daysDiff === 1) {
      // Consecutive day, increment
      this._currentCount++
      if (this._currentCount > this._longestCount) {
        this._longestCount = this._currentCount
      }
    } else {
      // Streak broken
      this._currentCount = 1
    }

    this._lastActivityAt = now
  }

  useFreezeToken(): boolean {
    if (!this.canUseFreezeToken) {
      return false
    }
    this._freezeTokens--
    return true
  }

  useStreakShield(): void {
    this._streakShieldUsed = true
  }

  resetWeekly(): void {
    // Reset freeze tokens weekly (called by scheduler)
    if (this._freezeTokens < 1) {
      this._freezeTokens = 1
    }
  }

  getXPReward(): number {
    const baseXP =
      this._streakType === StreakType.POST
        ? 25
        : this._streakType === StreakType.ENGAGEMENT
          ? 15
          : 10
    return Math.floor(baseXP * this.multiplier)
  }

  toDTO(): UserStreakDTO {
    return {
      id: this._id,
      userId: this._userId,
      streakType: this._streakType,
      currentCount: this._currentCount,
      longestCount: this._longestCount,
      lastActivityAt: this._lastActivityAt,
      freezeTokens: this._freezeTokens,
      streakShieldUsed: this._streakShieldUsed,
      multiplier: this.multiplier,
      xpReward: this.getXPReward(),
    }
  }
}

export interface UserStreakProps {
  id: string
  userId: string
  streakType: StreakType
  currentCount: number
  longestCount: number
  lastActivityAt: Date
  freezeTokens: number
  streakShieldUsed: boolean
}

export interface UserStreakDTO {
  id: string
  userId: string
  streakType: StreakType
  currentCount: number
  longestCount: number
  lastActivityAt: Date
  freezeTokens: number
  streakShieldUsed: boolean
  multiplier: number
  xpReward: number
}
