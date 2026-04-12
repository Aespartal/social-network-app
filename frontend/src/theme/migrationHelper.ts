/**
 * Helper para migrar componentes a usar Design Tokens
 *
 * Este archivo contiene funciones helper y ejemplos para facilitar
 * la migración de componentes con valores hardcodeados.
 */

import { useTheme } from '@mui/material'
import { designTokens } from './designTokens'

/**
 * Hook personalizado para acceder fácilmente a los tokens
 *
 * @example
 * const tokens = useDesignTokens()
 * <Box sx={{ borderRadius: tokens.borderRadius.md }}>
 */
export const useDesignTokens = () => {
  const theme = useTheme()
  return theme.tokens || designTokens
}

/**
 * Mapeo de valores hardcodeados comunes a tokens
 * Usa esta guía para saber qué token usar
 */
export const migrationMap = {
  // Border Radius
  'borderRadius: 0': 'theme.tokens.borderRadius.none',
  'borderRadius: 2': 'theme.tokens.borderRadius.sm',
  'borderRadius: 4': 'theme.tokens.borderRadius.sm',
  'borderRadius: 8': 'theme.tokens.borderRadius.sm',
  'borderRadius: 10': 'theme.tokens.borderRadius.md',
  'borderRadius: 12': 'theme.tokens.borderRadius.md',
  "borderRadius: '12px'": 'theme.tokens.borderRadius.md',
  'borderRadius: 16': 'theme.tokens.borderRadius.lg',
  "borderRadius: '16px'": 'theme.tokens.borderRadius.lg',
  'borderRadius: 20': 'theme.tokens.borderRadius.xl',
  "borderRadius: '20px'": 'theme.tokens.borderRadius.xl',
  'borderRadius: 24': 'theme.tokens.borderRadius.xl',

  // Avatar Sizes
  'width: 20, height: 20': 'theme.tokens.avatar.xs',
  'width: 32, height: 32': 'theme.tokens.avatar.sm',
  'width: 40, height: 40': 'theme.tokens.avatar.md',
  'width: 48, height: 48': 'theme.tokens.avatar.lg',
  'width: 64, height: 64': 'theme.tokens.avatar.xl',

  // Spacing (para padding/margin)
  'p: 1': 'p: theme.tokens.spacing.sm / 8',
  'p: 2': 'p: theme.tokens.spacing.md / 8',
  'p: 3': 'p: theme.tokens.spacing.lg / 8',
  'px: 1': 'px: theme.tokens.spacing.sm / 8',
  'px: 2': 'px: theme.tokens.spacing.md / 8',
  'px: 3': 'px: theme.tokens.spacing.lg / 8',

  // Transitions
  "transition: 'all 0.2s'": `transition: \`all \${theme.tokens.transition.normal}\``,
  "transition: 'all 0.2s ease-in-out'": `transition: \`all \${theme.tokens.transition.normal} \${theme.tokens.transition.easing}\``,
} as const

/**
 * Ejemplos de migración
 */
export const migrationExamples = {
  // Ejemplo 1: Avatar con tamaño hardcodeado
  before: `
    <Avatar 
      src={user.avatar} 
      sx={{ width: 40, height: 40 }}
    />
  `,
  after: `
    <Avatar 
      src={user.avatar} 
      sx={{ 
        width: theme.tokens.avatar.md,
        height: theme.tokens.avatar.md 
      }}
    />
  `,

  // Ejemplo 2: Card con border radius
  before2: `
    <Card sx={{ borderRadius: '12px', p: 2 }}>
      Content
    </Card>
  `,
  after2: `
    <Card sx={{ 
      borderRadius: theme.tokens.borderRadius.md,
      p: theme.tokens.spacing.md / 8 
    }}>
      Content
    </Card>
  `,

  // Ejemplo 3: Botón con transición
  before3: `
    <Button sx={{
      borderRadius: 20,
      transition: 'all 0.2s ease-in-out',
    }}>
      Click me
    </Button>
  `,
  after3: `
    <Button sx={{
      borderRadius: theme.tokens.borderRadius.xl,
      transition: \`all \${theme.tokens.transition.normal} \${theme.tokens.transition.easing}\`,
    }}>
      Click me
    </Button>
  `,

  // Ejemplo 4: Usando el hook personalizado
  withHook: `
    function MyComponent() {
      const tokens = useDesignTokens()
      
      return (
        <Box sx={{
          borderRadius: tokens.borderRadius.lg,
          p: tokens.spacing.md / 8,
          transition: \`all \${tokens.transition.normal}\`,
        }}>
          Content
        </Box>
      )
    }
  `,
}

/**
 * Función helper para convertir px a tokens
 * Útil durante la migración
 */
export const pxToToken = (
  px: number,
  type: 'borderRadius' | 'avatar' = 'borderRadius'
): string => {
  const borderRadiusMap: Record<number, string> = {
    0: 'borderRadius.none',
    2: 'borderRadius.sm',
    4: 'borderRadius.sm',
    8: 'borderRadius.sm',
    12: 'borderRadius.md',
    16: 'borderRadius.lg',
    20: 'borderRadius.xl',
    24: 'borderRadius.xl',
    32: 'borderRadius.xl',
  }

  const avatarMap: Record<number, string> = {
    20: 'avatar.xs',
    32: 'avatar.sm',
    40: 'avatar.md',
    48: 'avatar.lg',
    64: 'avatar.xl',
  }

  const map = type === 'borderRadius' ? borderRadiusMap : avatarMap
  return map[px] || `${px}px (no token found)`
}

/**
 * Template para componentes migrados
 */
export const componentTemplate = `
import { useTheme } from '@mui/material'
// o
import { useDesignTokens } from '@/theme/migrationHelper'

function MyComponent() {
  const theme = useTheme()
  // o
  const tokens = useDesignTokens()
  
  return (
    <Box sx={{
      // Usar tokens del tema
      borderRadius: theme.tokens.borderRadius.md,
      p: theme.tokens.spacing.md / 8,
      
      // O usar directamente
      borderRadius: tokens.borderRadius.md,
      p: tokens.spacing.md / 8,
    }}>
      Content
    </Box>
  )
}
`

export default {
  useDesignTokens,
  migrationMap,
  migrationExamples,
  pxToToken,
  componentTemplate,
}
