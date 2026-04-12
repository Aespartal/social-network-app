/**
 * Sistema de Tokens de Diseño - Centralización completa
 *
 * Este archivo es la fuente única de verdad para todos los valores de diseño.
 * Modificar estos valores afectará consistentemente toda la aplicación.
 *
 * Principios:
 * - Un solo lugar de configuración
 * - Tipado estricto mediante 'as const'
 * - Soporte para múltiples temas (light/dark) donde aplique
 */

// ============================================================================
// 1. ESPACIADO
// ============================================================================

export const spacing = {
  /** 4px - Micro ajustes */
  xs: 4,
  /** 8px - Elementos pequeños, iconos */
  sm: 8,
  /** 16px - Estándar, padding base */
  md: 16,
  /** 24px - Secciones, cards */
  lg: 24,
  /** 32px - Grandes separaciones */
  xl: 32,
  /** 48px - Máximas separaciones */
  xxl: 48,
} as const

// ============================================================================
// 2. TIPOGRAFÍA
// ============================================================================

export const fontSize = {
  /** 12px - Etiquetas, captions */
  xs: '0.75rem',
  /** 14px - Texto secundario */
  sm: '0.875rem',
  /** 16px - Texto base */
  base: '1rem',
  /** 18px - Subtítulos */
  lg: '1.125rem',
  /** 20px - Títulos pequeños */
  xl: '1.25rem',
  /** 24px - Títulos medianos */
  '2xl': '1.5rem',
  /** 30px - Títulos grandes */
  '3xl': '1.875rem',
  /** 36px - Displays */
  '4xl': '2.25rem',
} as const

export const fontWeight = {
  /** 400 */
  normal: 400,
  /** 500 */
  medium: 500,
  /** 600 */
  semibold: 600,
  /** 700 */
  bold: 700,
  /** 800 */
  extrabold: 800,
} as const

export const lineHeight = {
  /** 1.2 - Compacto */
  tight: 1.2,
  /** 1.5 - Estándar */
  normal: 1.5,
  /** 1.6 - Espaciado cómodo */
  relaxed: 1.6,
  /** 1.8 - Máximo espaciado */
  loose: 1.8,
} as const

export const letterSpacing = {
  tight: '-0.02em',
  normal: '0',
  wide: '0.01em',
} as const

// ============================================================================
// 3. COLORES SEMÁNTICOS (independientes del tema)
// ============================================================================

export const semanticColors = {
  /** Azul Twitter/X primario */
  primary: '#1d9bf0',
  /** Like/Rosa */
  like: '#f91880',
  /** Retweet/Verde */
  retweet: '#00ba7c',
  /** Verificado */
  verified: '#1d9bf0',
  /** Error */
  error: '#f4212e',
  /** Warning */
  warning: '#ffad1f',
  /** Success */
  success: '#00ba7c',
  /** Información */
  info: '#1d9bf0',
} as const

// ============================================================================
// 4. COLORES DE TEMA (Light/Dark)
// ============================================================================

export const themeColors = {
  light: {
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      elevated: '#f7f9f9',
    },
    text: {
      primary: '#0f1419',
      secondary: '#536471',
      disabled: '#8899a6',
    },
    border: 'rgba(0, 0, 0, 0.08)',
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  dark: {
    background: {
      default: '#000000',
      paper: '#16181c',
      elevated: '#202327',
    },
    text: {
      primary: '#e7e9ea',
      secondary: '#71767b',
      disabled: '#56595c',
    },
    border: '#2f3336',
    divider: '#2f3336',
  },
} as const

// ============================================================================
// 5. BORDES Y RADIOS
// ============================================================================

export const borderRadius = {
  /** 0px */
  none: 0,
  /** 4px - Muy suave */
  sm: 4,
  /** 8px - Suave */
  md: 8,
  /** 12px - Moderado */
  lg: 12,
  /** 16px - Pronunciado */
  xl: 16,
  /** 24px - Muy pronunciado (botones) */
  '2xl': 24,
  /** 9999px - Completo */
  full: 9999,
} as const

export const borderWidth = {
  none: 0,
  thin: 1,
  normal: 2,
  thick: 4,
} as const

// ============================================================================
// 6. SOMBRAS (adaptativas por tema)
// ============================================================================

export const shadows = {
  none: 'none',
  card: {
    light: '0 4px 12px rgba(0, 0, 0, 0.03)',
    dark: 'none',
  },
  hover: {
    light: '0 8px 24px rgba(0, 0, 0, 0.08)',
    dark: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  dropdown: {
    light: '0 4px 20px rgba(0, 0, 0, 0.15)',
    dark: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },
  modal: {
    light: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    dark: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
} as const

// ============================================================================
// 7. TAMAÑOS DE AVATAR
// ============================================================================

export const avatar = {
  /** 20px */
  xs: 20,
  /** 32px */
  sm: 32,
  /** 40px - Estándar */
  md: 40,
  /** 48px */
  lg: 48,
  /** 64px */
  xl: 64,
  /** 128px - Perfil */
  xxl: 128,
} as const

// ============================================================================
// 8. TAMAÑOS DE ICONOS
// ============================================================================

export const iconSize = {
  /** 16px */
  xs: '1rem',
  /** 20px */
  sm: '1.25rem',
  /** 24px - Estándar MUI */
  md: '1.5rem',
  /** 28.8px */
  lg: '1.8rem',
  /** 36px */
  xl: '2.25rem',
  /** 48px */
  '2xl': '3rem',
} as const

// ============================================================================
// 9. LAYOUT Y DIMENSIONES
// ============================================================================

export const layout = {
  maxWidth: {
    post: '600px',
    sidebar: '350px',
    container: '1200px',
    content: '990px',
  },
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
} as const

// ============================================================================
// 10. TRANSICIONES Y ANIMACIONES
// ============================================================================

export const transition = {
  /** 150ms */
  fast: '0.15s',
  /** 200ms - Estándar */
  normal: '0.2s',
  /** 300ms */
  slow: '0.3s',
  /** ease-in-out */
  easing: 'ease-in-out',
  /** cubic-bezier(0.4, 0, 0.2, 1) */
  easingMui: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const

// ============================================================================
// 11. Z-INDEX
// ============================================================================

export const zIndex = {
  base: 1,
  dropdown: 1000,
  sticky: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
} as const

// ============================================================================
// 12. OPACIDADES
// ============================================================================

export const opacity = {
  /** 0.38 - MUI disabled */
  disabled: 0.38,
  /** 0.04 - Hover sutil */
  hover: 0.04,
  /** 0.08 - Seleccionado */
  selected: 0.08,
  /** 0.12 - Foco */
  focus: 0.12,
  /** 0.85 - Backdrop */
  backdrop: 0.85,
} as const

// ============================================================================
// 13. TOKEN COMPLETO (exportación única)
// ============================================================================

export const tokens = {
  spacing,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  semanticColors,
  themeColors,
  borderRadius,
  borderWidth,
  shadows,
  avatar,
  iconSize,
  layout,
  transition,
  zIndex,
  opacity,
} as const

// ============================================================================
// 14. TIPOS DERIVADOS (para TypeScript)
// ============================================================================

export type Tokens = typeof tokens
export type SpacingToken = keyof typeof spacing
export type FontSizeToken = keyof typeof fontSize
export type FontWeightToken = keyof typeof fontWeight
export type BorderRadiusToken = keyof typeof borderRadius
export type AvatarToken = keyof typeof avatar
export type IconSizeToken = keyof typeof iconSize
export type ThemeColorScheme = keyof typeof themeColors

// Exportación por defecto para facilitar imports
export default tokens
