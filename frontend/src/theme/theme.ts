import { createTheme, alpha, ThemeOptions } from '@mui/material/styles'
import { esES } from '@mui/material/locale'
import { tokens, themeColors, semanticColors } from './tokens'

/**
 * Sistema de Temas - Arquitectura Centralizada
 *
 * Este archivo define los temas Light y Dark usando los tokens centralizados.
 * Para cambiar el tema completo, solo modifica los tokens en './tokens.ts'
 */

// ============================================================================
// 1. CONFIGURACIÓN TIPOGRÁFICA COMPARTIDA
// ============================================================================

const baseTypography: ThemeOptions['typography'] = {
  fontFamily: ['Inter', 'Montserrat', 'Lora', 'sans-serif'].join(','),
  h1: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: tokens.fontSize['4xl'],
    fontWeight: tokens.fontWeight.bold,
    letterSpacing: tokens.letterSpacing.tight,
    lineHeight: tokens.lineHeight.tight,
  },
  h2: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: tokens.fontSize['3xl'],
    fontWeight: tokens.fontWeight.bold,
    letterSpacing: tokens.letterSpacing.tight,
    lineHeight: tokens.lineHeight.tight,
  },
  h3: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: tokens.fontSize['2xl'],
    fontWeight: tokens.fontWeight.semibold,
    letterSpacing: tokens.letterSpacing.tight,
  },
  h4: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: tokens.fontSize.xl,
    fontWeight: tokens.fontWeight.semibold,
    letterSpacing: tokens.letterSpacing.tight,
  },
  h5: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: tokens.fontSize.lg,
    fontWeight: tokens.fontWeight.semibold,
  },
  h6: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: tokens.fontSize.base,
    fontWeight: tokens.fontWeight.semibold,
  },
  body1: {
    fontFamily: 'Lora, serif',
    fontSize: tokens.fontSize.base,
    lineHeight: tokens.lineHeight.relaxed,
  },
  body2: {
    fontFamily: 'Lora, serif',
    fontSize: tokens.fontSize.sm,
    lineHeight: tokens.lineHeight.normal,
  },
  caption: {
    fontSize: tokens.fontSize.xs,
    lineHeight: tokens.lineHeight.normal,
  },
  button: {
    textTransform: 'none',
    fontWeight: tokens.fontWeight.semibold,
    fontSize: tokens.fontSize.base,
  },
  overline: {
    fontSize: tokens.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: tokens.letterSpacing.wide,
  },
}

// ============================================================================
// 2. CONFIGURACIÓN DE COMPONENTES COMPARTIDA
// ============================================================================

const sharedComponents: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: tokens.borderRadius['2xl'],
        padding: `${tokens.spacing.sm}px ${tokens.spacing.lg - 4}px`,
        transition: `all ${tokens.transition.normal} ${tokens.transition.easing}`,
        boxShadow: tokens.shadows.none,
        '&:hover': {
          boxShadow: tokens.shadows.none,
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      },
      sizeLarge: {
        padding: `${tokens.spacing.md - 4}px ${tokens.spacing.lg + 4}px`,
      },
      sizeSmall: {
        padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`,
        fontSize: tokens.fontSize.sm,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: tokens.borderRadius.lg,
        backgroundImage: 'none',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: tokens.borderRadius.md,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: tokens.fontWeight.semibold,
        borderRadius: tokens.borderRadius.xl,
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        border: `2px solid currentColor`,
      },
    },
  },
}

// ============================================================================
// 3. TEMA CLARO
// ============================================================================

export const lightTheme = createTheme(
  {
    palette: {
      mode: 'light',
      primary: {
        main: semanticColors.primary,
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#673ab7',
        contrastText: '#ffffff',
      },
      background: {
        default: themeColors.light.background.default,
        paper: themeColors.light.background.paper,
      },
      text: {
        primary: themeColors.light.text.primary,
        secondary: themeColors.light.text.secondary,
      },
      divider: themeColors.light.divider,
      error: {
        main: semanticColors.error,
      },
      warning: {
        main: semanticColors.warning,
      },
      success: {
        main: semanticColors.success,
      },
      info: {
        main: semanticColors.info,
      },
    },
    typography: baseTypography,
    shape: {
      borderRadius: 8,
    },
    components: {
      ...sharedComponents,
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: alpha(
              themeColors.light.background.default,
              tokens.opacity.backdrop
            ),
            backdropFilter: 'blur(12px)',
            color: themeColors.light.text.primary,
            boxShadow: tokens.shadows.none,
            borderBottom: `1px solid ${themeColors.light.border}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            ...(sharedComponents.MuiCard!.styleOverrides!.root as object),
            border: `1px solid ${themeColors.light.border}`,
            boxShadow: tokens.shadows.card.light,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${themeColors.light.border}`,
          },
        },
      },
    },
  },
  esES
)

// ============================================================================
// 4. TEMA OSCURO (Lights Out)
// ============================================================================

export const darkTheme = createTheme(
  {
    palette: {
      mode: 'dark',
      primary: {
        main: semanticColors.primary,
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#673ab7',
        contrastText: '#ffffff',
      },
      background: {
        default: themeColors.dark.background.default,
        paper: themeColors.dark.background.paper,
      },
      text: {
        primary: themeColors.dark.text.primary,
        secondary: themeColors.dark.text.secondary,
      },
      divider: themeColors.dark.divider,
      error: {
        main: semanticColors.error,
      },
      warning: {
        main: semanticColors.warning,
      },
      success: {
        main: semanticColors.success,
      },
      info: {
        main: semanticColors.info,
      },
    },
    typography: baseTypography,
    shape: {
      borderRadius: 8,
    },
    components: {
      ...sharedComponents,
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: alpha(themeColors.dark.background.default, 0.7),
            backdropFilter: 'blur(12px)',
            backgroundImage: 'none',
            boxShadow: tokens.shadows.none,
            borderBottom: `1px solid ${themeColors.dark.border}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            ...(sharedComponents.MuiCard!.styleOverrides!.root as object),
            border: `1px solid ${themeColors.dark.border}`,
            boxShadow: tokens.shadows.card.dark,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${themeColors.dark.border}`,
            backgroundColor: themeColors.dark.background.default,
          },
        },
      },
    },
  },
  esES
)

// ============================================================================
// 5. EXTENSIÓN DE TIPOS DE MUI
// ============================================================================

declare module '@mui/material/styles' {
  interface Theme {
    tokens: typeof tokens
    themeMode: 'light' | 'dark'
  }
  interface ThemeOptions {
    tokens?: typeof tokens
    themeMode?: 'light' | 'dark'
  }
}

// ============================================================================
// 6. INYECCIÓN DE TOKENS EN TEMAS
// ============================================================================

// Añadir tokens y modo al tema claro
;(
  lightTheme as typeof lightTheme & {
    tokens: typeof tokens
    themeMode: 'light'
  }
).tokens = tokens
;(
  lightTheme as typeof lightTheme & {
    tokens: typeof tokens
    themeMode: 'light'
  }
).themeMode = 'light'

// Añadir tokens y modo al tema oscuro
;(
  darkTheme as typeof darkTheme & { tokens: typeof tokens; themeMode: 'dark' }
).tokens = tokens
;(
  darkTheme as typeof darkTheme & { tokens: typeof tokens; themeMode: 'dark' }
).themeMode = 'dark'

// ============================================================================
// 7. EXPORTACIONES
// ============================================================================

/** Tema por defecto (claro) */
export const theme = lightTheme

/** Mapa de temas disponibles */
export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const

/** Tipos de temas disponibles */
export type ThemeType = keyof typeof themes

// Exportación por defecto
export default theme
