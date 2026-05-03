export const LEVELS = [
  { level: 1, minXP: 0, title: 'Novato', icon: '🌱' },
  { level: 2, minXP: 100, title: 'Explorador', icon: '🔍' },
  { level: 3, minXP: 300, title: 'Contribuidor', icon: '📣' },
  { level: 4, minXP: 600, title: 'Veterano', icon: '⭐' },
  { level: 5, minXP: 1000, title: 'Maestro', icon: '🏆' },
  { level: 6, minXP: 2000, title: 'Leyenda', icon: '👑' },
] as const

export const LEVEL_COLORS = {
  1: '#4CAF50',
  2: '#2196F3',
  3: '#9C27B0',
  4: '#FF9800',
  5: '#FFD700',
  6: '#E91E63',
} as const

export type LevelInfo = {
  level: number
  title: string
  icon: string
  currentXP: number
  nextLevelXP: number
  minXP: number
  progress: number
}

export const getLevelByXP = (totalXP: number): LevelInfo => {
  let level = 1
  let minXP: number = 0
  let maxXP: number = LEVELS[1].minXP

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].minXP) {
      level = LEVELS[i].level
      minXP = LEVELS[i].minXP
      maxXP = LEVELS[i + 1]?.minXP ?? LEVELS[i].minXP
      break
    }
  }

  return {
    level,
    title: LEVELS[level - 1].title,
    icon: LEVELS[level - 1].icon,
    currentXP: totalXP,
    nextLevelXP: maxXP,
    minXP,
    progress: maxXP > minXP ? ((totalXP - minXP) / (maxXP - minXP)) * 100 : 100,
  }
}

export const getLevelColor = (level: number): string => {
  return LEVEL_COLORS[level as keyof typeof LEVEL_COLORS] || LEVEL_COLORS[1]
}
