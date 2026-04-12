/**
 * Sistema de Diseño - Exportaciones Centralizadas
 *
 * Este archivo es el punto de entrada único para todo el sistema de diseño.
 * Importa desde aquí para acceder a tokens, hooks, componentes y temas.
 *
 * @example
 * // Tokens y tipos
 * import { tokens, type Tokens } from '@/theme'
 *
 * // Hooks
 * import { useTokens, useThemeColors, useSx } from '@/theme'
 *
 * // Componentes base
 * import { Box, Typography, Avatar, Button } from '@/theme'
 *
 * // Temas y Provider
 * import { ThemeProvider, useAppTheme, theme, darkTheme } from '@/theme'
 */

// ============================================================================
// 1. TOKENS Y TIPOS
// ============================================================================

export {
  tokens,
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
} from './tokens'

export type {
  Tokens,
  SpacingToken,
  FontSizeToken,
  FontWeightToken,
  BorderRadiusToken,
  AvatarToken,
  IconSizeToken,
  ThemeColorScheme,
} from './tokens'

// ============================================================================
// 2. TEMAS
// ============================================================================

export { theme, lightTheme, darkTheme, themes, type ThemeType } from './theme'

// ============================================================================
// 3. HOOKS
// ============================================================================

export {
  useTokens,
  useThemeColors,
  useSemanticColors,
  useThemeShadows,
  useSpacing,
  useSx,
  useAvatarSizes,
  useZIndex,
  useThemeInfo,
} from './hooks'

// ============================================================================
// 4. COMPONENTES BASE
// ============================================================================

export {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  Card,
  type BoxProps,
  type TypographyProps,
  type ButtonProps,
  type AvatarProps,
  type ChipProps,
  type CardProps,
} from './components'

// ============================================================================
// 5. THEME PROVIDER Y CONTEXTO
// ============================================================================

export {
  ThemeProvider,
  useAppTheme,
  type ThemeContextType,
} from './ThemeProvider'

// ============================================================================
// 6. HELPERS DE MIGRACIÓN (legacy - usar nuevos hooks)
// ============================================================================

export {
  useDesignTokens,
  migrationMap,
  migrationExamples,
  pxToToken,
  componentTemplate,
} from './migrationHelper'

// ============================================================================
// 7. EXPORTACIÓN POR DEFECTO
// ============================================================================

export { default } from './tokens'
