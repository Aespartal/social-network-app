export interface AuraNodeProps {
  id: string
  slug: string
  name: string
  description?: string | null
  icon?: string | null
  color?: string | null
  vibration: number
  pulse: number
  category?: string | null
  tagId?: string | null
  createdAt: Date
  updatedAt: Date
  lastPulseAt: Date
}

export class AuraNode {
  constructor(private readonly props: AuraNodeProps) {}

  get id() {
    return this.props.id
  }
  get slug() {
    return this.props.slug
  }
  get name() {
    return this.props.name
  }
  get description() {
    return this.props.description
  }
  get icon() {
    return this.props.icon
  }
  get color() {
    return this.props.color
  }
  get vibration() {
    return this.props.vibration
  }
  get pulse() {
    return this.props.pulse
  }
  get category() {
    return this.props.category
  }
  get tagId() {
    return this.props.tagId
  }
  get createdAt() {
    return this.props.createdAt
  }
  get updatedAt() {
    return this.props.updatedAt
  }
  get lastPulseAt() {
    return this.props.lastPulseAt
  }

  /**
   * Calcula la nueva intensidad (Vibración y Pulso)
   * El pulso es la velocidad de cambio reciente.
   * La vibración es la actividad acumulada.
   */
  public updateActivity(newActivityCount: number): void {
    const now = new Date()
    const timeDiff = (now.getTime() - this.props.lastPulseAt.getTime()) / 1000 // Segundos

    // Si ha pasado poco tiempo, el pulso aumenta drásticamente con la actividad
    // Si ha pasado mucho tiempo, el pulso decae
    const decayFactor = Math.exp(-timeDiff / 3600) // Decaimiento cada hora

    this.props.pulse =
      this.props.pulse * decayFactor + newActivityCount * (1 - decayFactor)
    this.props.vibration = this.props.vibration * decayFactor + newActivityCount
    this.props.lastPulseAt = now
  }
}
