export interface AchievementProps {
  id: string
  name: string
  description?: string
  slug: string
  category: AchievementCategory
  triggerEvent: string
  tierType: AchievementTierType
  iconEmoji?: string
  isHidden: boolean
  announced: boolean
  xpReward: number
  badgeSlug?: string
  profileFrameSlug?: string
}

export enum AchievementCategory {
  ONBOARDING = 'onboarding',
  ENGAGEMENT = 'engagement',
  CONTENT = 'content',
  EXPLORATION = 'exploration',
}

export enum AchievementTierType {
  BINARY = 'binary',
  MILESTONE = 'milestone',
  PROGRESSIVE = 'progressive',
  STREAK = 'streak',
}

export class Achievement {
  private readonly props: AchievementProps

  private constructor(props: AchievementProps) {
    this.props = props
  }

  static reconstitute(props: AchievementProps): Achievement {
    return new Achievement(props)
  }

  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get description(): string | undefined {
    return this.props.description
  }

  get slug(): string {
    return this.props.slug
  }

  get category(): AchievementCategory {
    return this.props.category
  }

  get triggerEvent(): string {
    return this.props.triggerEvent
  }

  get tierType(): AchievementTierType {
    return this.props.tierType
  }

  get iconEmoji(): string | undefined {
    return this.props.iconEmoji
  }

  get isHidden(): boolean {
    return this.props.isHidden
  }

  get announced(): boolean {
    return this.props.announced
  }

  get xpReward(): number {
    return this.props.xpReward
  }

  get badgeSlug(): string | undefined {
    return this.props.badgeSlug
  }

  get profileFrameSlug(): string | undefined {
    return this.props.profileFrameSlug
  }

  toDTO(): AchievementDTO {
    return {
      id: this.props.id,
      name: this.props.name,
      description: this.props.description,
      slug: this.props.slug,
      category: this.props.category,
      tierType: this.props.tierType,
      iconEmoji: this.props.iconEmoji,
      isHidden: this.props.isHidden,
      announced: this.props.announced,
    }
  }
}

export interface AchievementDTO {
  id: string
  name: string
  description?: string
  slug: string
  category: AchievementCategory
  tierType: AchievementTierType
  iconEmoji?: string
  isHidden: boolean
  announced: boolean
}
