/**
 * Hooks especializados para el sistema de diseño
 *
 * Proporcionan acceso tipado y consistente a los tokens del tema.
 */

import { useTheme as useMuiTheme } from '@mui/material/styles'
import { tokens, themeColors, semanticColors, type Tokens } from './tokens'

// ============================================================================
// 1. HOOK PRINCIPAL - Acceso completo a tokens
// ============================================================================

/**
 * Hook para acceder a todos los tokens del diseño con tipado estricto.
 * @returns Objeto con todos los tokens tipados
 * @example
 * const t = useTokens()
 * <Box sx={{ padding: t.spacing.md, borderRadius: t.borderRadius.lg }} />
 */
export const useTokens = (): Tokens => {
  const theme = useMuiTheme()
  return (theme.tokens as Tokens) || tokens
}

// ============================================================================
// 2. HOOK ESPECÍFICO - Colores del tema actual
// ============================================================================

/**
 * Hook para obtener los colores del tema actual (light/dark).
 * @returns Colores adaptados al tema activo
 * @example
 * const colors = useThemeColors()
 * <Box sx={{ backgroundColor: colors.background.default }} />
 */
export const useThemeColors = () => {
  const theme = useMuiTheme()
  const mode = theme.palette.mode
  return themeColors[mode as keyof typeof themeColors]
}

// ============================================================================
// 3. HOOK ESPECÍFICO - Colores semánticos
// ============================================================================

/**
 * Hook para acceder a colores semánticos consistentes.
 * @returns Colores semánticos (primary, success, error, etc.)
 * @example
 * const colors = useSemanticColors()
 * <Button sx={{ color: colors.like }} />
 */
export const useSemanticColors = () => semanticColors

// ============================================================================
// 4. HOOK ESPECÍFICO - Sombras adaptativas
// ============================================================================

/**
 * Hook para obtener sombras adaptadas al tema actual.
 * @returns Objeto con sombras para light/dark
 * @example
 * const shadows = useThemeShadows()
 * <Card sx={{ boxShadow: shadows.card }} />
 */
export const useThemeShadows = () => {
  const theme = useMuiTheme()
  const mode = theme.palette.mode as 'light' | 'dark'

  return {
    card: tokens.shadows.card[mode],
    hover: tokens.shadows.hover[mode],
    dropdown: tokens.shadows.dropdown[mode],
    modal: tokens.shadows.modal[mode],
    none: tokens.shadows.none,
  }
}

// ============================================================================
// 5. HOOK ESPECÍFICO - Spacing con multiplicador
// ============================================================================

/**
 * Hook para obtener valores de espaciado multiplicados.
 * @param multiplier - Factor de multiplicación (default: 1)
 * @returns Función que recibe un token y retorna el valor multiplicado
 * @example
 * const spacing = useSpacing(2)
 * <Box sx={{ p: spacing('md') }} /> // 32px (16 * 2)
 */
export const useSpacing = (multiplier = 1) => {
  const t = useTokens()

  return (token: keyof typeof t.spacing): number => {
    return t.spacing[token] * multiplier
  }
}

// ============================================================================
// 6. HOOK ESPECÍFICO - Generador de estilos SX
// ============================================================================

/**
 * Hook para generar objetos de estilos sx consistentes.
 * @returns Funciones helper para construir estilos
 * @example
 * const sx = useSx()
 * <Box sx={sx.padding('md', 'lg')} />
 * <Box sx={sx.margin('sm')} />
 * <Box sx={sx.rounded('lg')} />
 */
export const useSx = () => {
  const t = useTokens()

  return {
    /** Padding uniforme */
    padding: (size: keyof typeof t.spacing) => ({
      padding: t.spacing[size],
    }),
    /** Padding horizontal */
    px: (size: keyof typeof t.spacing) => ({
      paddingLeft: t.spacing[size],
      paddingRight: t.spacing[size],
    }),
    /** Padding vertical */
    py: (size: keyof typeof t.spacing) => ({
      paddingTop: t.spacing[size],
      paddingBottom: t.spacing[size],
    }),
    /** Margin uniforme */
    margin: (size: keyof typeof t.spacing) => ({
      margin: t.spacing[size],
    }),
    /** Margin horizontal */
    mx: (size: keyof typeof t.spacing) => ({
      marginLeft: t.spacing[size],
      marginRight: t.spacing[size],
    }),
    /** Margin vertical */
    my: (size: keyof typeof t.spacing) => ({
      marginTop: t.spacing[size],
      marginBottom: t.spacing[size],
    }),
    /** Border radius */
    rounded: (size: keyof typeof t.borderRadius) => ({
      borderRadius: t.borderRadius[size],
    }),
    /** Transición */
    transition: (speed: keyof typeof t.transition = 'normal') => ({
      transition: `all ${t.transition[speed]} ${t.transition.easing}`,
    }),
    /** Gap */
    gap: (size: keyof typeof t.spacing) => ({
      gap: t.spacing[size],
    }),
  }
}

// ============================================================================
// 7. HOOK ESPECÍFICO - Tamaños de avatar
// ============================================================================

/**
 * Hook para obtener tamaños de avatar.
 * @returns Tamaños predefinidos de avatar
 * @example
 * const sizes = useAvatarSizes()
 * <Avatar sx={{ width: sizes.md, height: sizes.md }} />
 */
export const useAvatarSizes = () => tokens.avatar

// ============================================================================
// 8. HOOK ESPECÍFICO - Z-index
// ============================================================================

/**
 * Hook para obtener valores de z-index consistentes.
 * @returns Valores de z-index tipados
 * @example
 * const z = useZIndex()
 * <Modal sx={{ zIndex: z.modal }} />
 */
export const useZIndex = () => tokens.zIndex

// ============================================================================
// 9. HOOK ESPECÍFICO - Info completa del tema
// ============================================================================

/**
 * Hook para obtener información completa del tema actual.
 * @returns Objeto con modo, colores, y tokens
 * @example
 * const theme = useThemeInfo()
 * if (theme.isDark) { ... }
 */
export const useThemeInfo = () => {
  const theme = useMuiTheme()
  const t = useTokens()

  return {
    isDark: theme.palette.mode === 'dark',
    isLight: theme.palette.mode === 'light',
    mode: theme.palette.mode as 'light' | 'dark',
    colors: useThemeColors(),
    semanticColors: useSemanticColors(),
    shadows: useThemeShadows(),
    tokens: t,
  }
}
