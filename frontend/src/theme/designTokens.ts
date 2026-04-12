/**
 * Design Tokens - Sistema de Diseño Centralizado
 *
 * Este archivo contiene todos los valores de diseño de la aplicación.
 * Cambiar estos valores afectará toda la UI de manera consistente.
 */

export const designTokens = {
  /**
   * ESPACIADO
   * Valores base para márgenes, paddings, gaps, etc.
   */
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  /**
   * BORDES Y RADIOS
   */
  borderRadius: {
    none: 0,
    sm: 4, // Muy suave - para cards pequeños y elementos sutiles
    md: 8, // Suave - para imágenes y cards principales
    lg: 12, // Moderado - para modales y elementos destacados
    xl: 24, // Muy redondeado - para botones
    full: 9999, // Para elementos completamente redondeados
  },

  /**
   * TAMAÑOS DE AVATAR
   */
  avatar: {
    xs: 20,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    xxl: 128,
  },

  /**
   * ANCHOS MÁXIMOS
   */
  maxWidth: {
    post: '600px',
    sidebar: '350px',
    container: '1200px',
  },

  /**
   * TRANSICIONES
   */
  transition: {
    fast: '0.15s',
    normal: '0.2s',
    slow: '0.3s',
    easing: 'ease-in-out',
  },

  /**
   * SOMBRAS (además de las de MUI)
   */
  shadows: {
    card: {
      light: '0 4px 12px rgba(0,0,0,0.03)',
      dark: 'none',
    },
    hover: {
      light: '0 8px 24px rgba(0,0,0,0.08)',
      dark: '0 8px 24px rgba(0,0,0,0.3)',
    },
  },

  /**
   * COLORES ESPECÍFICOS DE LA APP
   * (además de los del tema de MUI)
   */
  colors: {
    twitter: '#1d9bf0',
    like: '#f91880',
    retweet: '#00ba7c',
    verified: '#1d9bf0',
  },

  /**
   * OPACIDADES
   */
  opacity: {
    disabled: 0.38,
    hover: 0.04,
    selected: 0.08,
    backdrop: 0.85,
  },

  /**
   * Z-INDEX
   */
  zIndex: {
    base: 1,
    dropdown: 1000,
    sticky: 1100,
    modal: 1300,
    tooltip: 1500,
  },

  /**
   * TAMAÑOS DE FUENTE ADICIONALES
   */
  iconSize: {
    sm: '1.5rem', // 24px (MUI default icon)
    lg: '1.8rem', // 28.8px (Para el nav móvil)
    xl: '2.25rem', // 36px
  },

  /**
   * PESOS DE FUENTE
   */
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  /**
   * ALTURAS DE LÍNEA
   */
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
  },
} as const

// Type helper para autocompletado
export type DesignTokens = typeof designTokens
