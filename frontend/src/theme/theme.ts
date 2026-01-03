import { createTheme, alpha, ThemeOptions } from '@mui/material/styles'
import { esES } from '@mui/material/locale'

/**
 * 1. CONFIGURACIÓN COMPARTIDA
 * Definimos lo que no cambia entre luz y oscuridad para mantener DRY (Don't Repeat Yourself).
 */
const baseTypography: ThemeOptions['typography'] = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'sans-serif',
  ].join(','),
  h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
  h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' },
  h3: { fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.01em' },
  h4: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.01em' },
  h5: { fontSize: '1.25rem', fontWeight: 600 },
  h6: { fontSize: '1rem', fontWeight: 600 },
  body1: { fontSize: '1rem', lineHeight: 1.6 },
  body2: { fontSize: '0.875rem', lineHeight: 1.57 },
  button: { textTransform: 'none', fontWeight: 600 },
}

const sharedComponents: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 24, // Botones redondeados modernos
        padding: '8px 20px',
        transition: 'all 0.2s ease-in-out',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
          transform: 'translateY(-1px)',
        },
        '&:active': { transform: 'translateY(0)' },
      },
      sizeLarge: { padding: '12px 28px' },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        backgroundImage: 'none',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 12,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { fontWeight: 600 },
    },
  },
}

/**
 * 2. TEMA CLARO
 */
export const theme = createTheme(
  {
    palette: {
      mode: 'light',
      primary: { main: '#1d9bf0', contrastText: '#ffffff' }, // Azul estilo social moderno
      secondary: { main: '#673ab7' },
      background: { default: '#ffffff', paper: '#ffffff' },
      text: { primary: '#0f1419', secondary: '#536471' },
      divider: 'rgba(0, 0, 0, 0.08)',
    },
    typography: baseTypography,
    shape: { borderRadius: 12 },
    components: {
      ...sharedComponents,
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: alpha('#ffffff', 0.8),
            backdropFilter: 'blur(12px)',
            color: '#0f1419',
            boxShadow: 'none',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            ...(sharedComponents.MuiCard!.styleOverrides!.root as object),
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          },
        },
      },
    },
  },
  esES
)

/**
 * 3. TEMA OSCURO
 * Mejorado con un tono "Lights Out" (negro profundo)
 */
export const darkTheme = createTheme(
  {
    palette: {
      mode: 'dark',
      primary: { main: '#1d9bf0', contrastText: '#ffffff' },
      background: { default: '#000000', paper: '#16181c' },
      text: { primary: '#e7e9ea', secondary: '#71767b' },
      divider: '#2f3336',
    },
    typography: baseTypography,
    shape: { borderRadius: 12 },
    components: {
      ...sharedComponents,
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: alpha('#000000', 0.7),
            backdropFilter: 'blur(12px)',
            backgroundImage: 'none',
            boxShadow: 'none',
            borderBottom: '1px solid #2f3336',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            ...sharedComponents?.MuiCard?.styleOverrides?.root as object,
            border: '1px solid #2f3336',
            boxShadow: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
    },
  },
  esES
)

export default theme
