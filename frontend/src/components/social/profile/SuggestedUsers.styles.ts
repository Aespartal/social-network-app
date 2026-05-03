import type { Theme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'

export const getSuggestedUsersStyles = (theme: Theme) => ({
  container: {
    borderRadius: theme.tokens.borderRadius.aura, // Usando token centralizado
    overflow: 'hidden',
    bgcolor: alpha('#13191E', 0.7), // Glassmorphism
    backdropFilter: 'blur(15px)',
    border: `1px solid rgba(255, 255, 255, 0.05)`,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    position: 'relative',

    '&::before':
      theme.palette.mode === 'dark'
        ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            pointerEvents: 'none',
            backgroundImage:
              'url("https://www.transparenttextures.com/patterns/stardust.png")',
          }
        : {},
  },
  header: {
    p: 2.5,
    pb: 1.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 800,
    fontSize: '0.95rem',
    color: 'text.primary',
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
    opacity: 0.9,
  },
  list: {
    width: '100%',
    p: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    px: 1.5,
    py: 1.2,
    gap: 1.5,
    borderRadius: theme.tokens.borderRadius.md,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    '&:hover': {
      bgcolor: alpha(theme.palette.primary.main, 0.05),
      transform: 'translateX(4px)',
      '& .connect-button': {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
  },
  avatar: {
    border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    padding: '2px',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      transform: 'rotate(5deg) scale(1.1)',
    },
  },
  name: {
    display: 'block',
    textDecoration: 'none',
    color: 'text.primary',
    fontWeight: 600,
    fontFamily: 'Lora, serif',
    fontSize: '0.9rem',
    lineHeight: 1.2,
  },
  username: {
    color: 'text.secondary',
    fontSize: '0.75rem',
    fontFamily: 'Inter, sans-serif',
    opacity: 0.7,
  },
  button: (isFollowing: boolean) => ({
    borderRadius: theme.tokens.borderRadius.full,
    fontSize: '0.65rem',
    fontWeight: 900,
    flexShrink: 0,
    minWidth: '80px',
    height: '28px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    transition: 'all 0.3s ease',
    bgcolor: isFollowing ? alpha(theme.palette.text.disabled, 0.1) : '#E0FF4F',
    color: '#000000',
    border: 'none',
    boxShadow: isFollowing ? 'none' : `0 0 20px ${alpha('#E0FF4F', 0.6)}`,
    '&:hover': {
      bgcolor: isFollowing
        ? alpha(theme.palette.text.disabled, 0.2)
        : '#E0FF4F',
      boxShadow: isFollowing ? 'none' : `0 0 30px ${alpha('#E0FF4F', 0.8)}`,
      transform: 'scale(1.05)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
  }),
  footer: {
    p: 2,
    pt: 1,
    textAlign: 'center',
  },
  moreButton: {
    textTransform: 'none',
    fontWeight: 500,
    color: 'text.secondary',
    fontSize: '0.8rem',
    opacity: 0.6,
    '&:hover': {
      bgcolor: 'transparent',
      opacity: 1,
      color: 'primary.main',
    },
  },
})
