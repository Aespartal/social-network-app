/**
 * Constantes y utilidades para el sistema de logros (Gamificación)
 */

export const ACHIEVEMENT_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  DIAMOND: 'diamond',
  COMPLETED: 'completed',
} as const

export const TIER_COLORS = {
  [ACHIEVEMENT_TIERS.BRONZE]: '#CD7F32',
  [ACHIEVEMENT_TIERS.SILVER]: '#C0C0C0',
  [ACHIEVEMENT_TIERS.GOLD]: '#FFD700',
  [ACHIEVEMENT_TIERS.PLATINUM]: '#E5E4E2',
  [ACHIEVEMENT_TIERS.DIAMOND]: '#B9F2FF',
  [ACHIEVEMENT_TIERS.COMPLETED]: '#4CAF50',
  DEFAULT: '#9E9E9E',
} as const

export const ACHIEVEMENT_CATEGORIES = [
  { id: 'onboarding', label: 'Primeros Pasos', color: '#2196F3' },
  { id: 'engagement', label: 'Interacción', color: '#4CAF50' },
  { id: 'content', label: 'Crea Contenido', color: '#FF9800' },
  { id: 'exploration', label: 'Explorador', color: '#9C27B0' },
] as const

/**
 * Retorna el color hexadecimal asociado a un tier de logro
 */
export const getTierColor = (tier: string | null): string => {
  if (!tier) return TIER_COLORS.DEFAULT
  const normalizedTier = tier.toLowerCase()
  return (
    TIER_COLORS[normalizedTier as keyof typeof TIER_COLORS] ||
    TIER_COLORS.DEFAULT
  )
}
