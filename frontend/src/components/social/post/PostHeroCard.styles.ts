import { alpha } from '@mui/material'
import type { Theme } from '@mui/material/styles'

export const getPostHeroCardStyles = (theme: Theme, auraStyle: string) => ({
  container: {
    position: 'relative',
    width: '100%',
    mb: 4,
  },
  card: {
    p: 4,
    borderRadius: theme.tokens.borderRadius.aura,
    background:
      auraStyle !== 'none'
        ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.95)}), ${auraStyle}`
        : alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(15px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
  },
  // Cuerpo del Hero (Grande y majestuoso)
  content: {
    fontFamily: 'Lora, serif',
    fontSize: '1.8rem', // Más grande para el Hero
    lineHeight: 1.5,
    fontWeight: 400,
    color: 'text.primary',
    mb: 3,
    whiteSpace: 'pre-wrap',
    letterSpacing: '-0.01em',
  },
  mediaContainer: {
    mb: 3,
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    '& img': {
      width: '100%',
      display: 'block',
    },
  },
  meta: {
    mb: 3,
    opacity: 0.6,
    fontSize: '0.9rem',
    display: 'flex',
    gap: 1,
    alignItems: 'center',
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
    pb: 2,
  },
  // Footer: Autor y Acciones
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mt: 2,
  },
  authorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    textDecoration: 'none',
    color: 'inherit',
    opacity: 0.9,
    '&:hover': { opacity: 1 },
  },
  authorName: {
    fontWeight: 700,
    fontSize: '1rem',
  },
  actions: {
    display: 'flex',
    gap: 1,
  },
  actionIcon: (activeColor?: string) => ({
    p: 1.5,
    color: activeColor || 'text.secondary',
    '& svg': {
      fontSize: '1.5rem',
      strokeWidth: '1.5px',
    },
    '&:hover': {
      color: activeColor || 'primary.main',
      bgcolor: alpha(theme.palette.primary.main, 0.05),
      transform: 'scale(1.1)',
    },
  }),
  parentPreview: {
    p: 2,
    mb: 2,
    borderRadius: '24px',
    bgcolor: alpha(theme.palette.background.paper, 0.4),
    border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      bgcolor: alpha(theme.palette.background.paper, 0.6),
    },
  },
  parentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 1,
  },
  parentContent: {
    opacity: 0.8,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
})
