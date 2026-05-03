import { alpha } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'

export const getPostCardStyles = (theme: Theme, auraStyle: string) => ({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  card: (sx?: SxProps<Theme>): SxProps<Theme> => [
    {
      p: 3,
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      borderRadius: theme.tokens.borderRadius.aura, // Token Aura centralizado
      background:
        auraStyle !== 'none'
          ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.95)}), ${auraStyle}`
          : alpha(theme.palette.background.paper, 0.8),
      backdropFilter: 'blur(20px)', // Stronger blur
      transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
      position: 'relative',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        borderColor: alpha(theme.palette.primary.main, 0.3),
      },
    },
    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
  ],
  // Nueva Cabecera: Contexto y Lectura
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 2.5,
  },
  tag: {
    px: 1.5,
    py: 0.5,
    borderRadius: '8px',
    bgcolor: 'rgba(58, 120, 50, 0.15)',
    color: '#88B04B', // Muted green from design
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  readingTime: {
    fontSize: '0.7rem',
    color: 'text.secondary',
    opacity: 0.5,
    fontStyle: 'normal',
  },
  // Cuerpo: Tipografía y Aire
  contentArea: {
    flexGrow: 1,
    position: 'relative',
    mb: 2,
  },
  title: {
    fontFamily: 'Montserrat, sans-serif', // Title usually sans
    fontWeight: 800,
    fontSize: '1.25rem',
    mb: 1.5,
    color: 'text.primary',
    lineHeight: 1.3,
  },
  text: (isLong: boolean) => ({
    fontFamily: 'Lora, serif',
    fontSize: '1.15rem',
    lineHeight: 1.6,
    color: 'text.secondary', // Use theme text color
    opacity: 0.95,
    position: 'relative',
    // Degradado si el texto es largo
    ...(isLong && {
      maxHeight: '160px',
      overflow: 'hidden',
      maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
      WebkitMaskImage:
        'linear-gradient(to bottom, black 60%, transparent 100%)',
    }),
  }),
  media: {
    mt: 2,
    borderRadius: '24px', // Esquinas redondeadas sugeridas
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  // Footer: Autor y Acciones Minimalistas
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mt: 'auto',
    pt: 2,
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  },
  authorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    opacity: 0.8,
    '&:hover': { opacity: 1 },
  },
  authorName: {
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  actions: {
    display: 'flex',
    gap: 1,
  },
  actionIcon: (activeColor?: string) => ({
    p: 0.8,
    color: activeColor || 'text.secondary',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0.2,
    '& svg': {
      fontSize: '1.1rem',
      strokeWidth: '1.2px',
      opacity: 0.7,
    },
    '&:hover': {
      color: activeColor || 'primary.main',
      bgcolor: alpha(theme.palette.primary.main, 0.05),
      transform: 'scale(1.1)',
      '& svg': { opacity: 1 },
    },
  }),
  countText: {
    fontSize: '0.65rem',
    fontWeight: 700,
    opacity: 0.8,
    mt: -0.5,
  },
})
