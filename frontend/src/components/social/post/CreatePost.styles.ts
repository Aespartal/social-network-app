import { alpha } from '@mui/material'
import type { Theme } from '@mui/material/styles'

export const getCreatePostStyles = (theme: Theme, isWriting: boolean) => ({
  dialog: {
    '& .MuiPaper-root': {
      borderRadius: theme.tokens.borderRadius.aura,
      backgroundImage: 'none',
      bgcolor: alpha(theme.palette.background.paper, 0.8),
      backdropFilter: 'blur(15px)',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      boxShadow: isWriting
        ? `0 20px 50px ${theme.palette.primary.main}15`
        : '0 10px 40px rgba(0,0,0,0.2)',
    },
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    py: 2,
    px: 4,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  },
  titleText: {
    fontWeight: 800,
    fontFamily: theme.typography.h1.fontFamily,
    fontSize: '1rem',
    letterSpacing: '-0.01em',
    color: 'text.primary',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    mt: 2,
    px: 4,
    pb: 3,
  },
  inputLayout: {
    display: 'flex',
    gap: 2,
  },
  textField: {
    '& .MuiInputBase-root': {
      fontSize: '1.4rem',
      lineHeight: 1.6,
      mt: 0.5,
      fontFamily: 'Lora, serif',
      color: 'text.primary',
    },
    '& .MuiInputBase-input::placeholder': {
      fontFamily: 'Lora, serif',
      fontStyle: 'italic',
      opacity: 0.5,
    },
  },
  footer: {
    px: 4,
    py: 2,
    justifyContent: 'space-between',
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  },
  charCount: (isOver: boolean, isNear: boolean) => ({
    fontWeight: 600,
    fontSize: '0.75rem',
    color: isOver ? 'error.main' : isNear ? 'warning.main' : 'text.secondary',
    opacity: 0.7,
  }),
  submitButton: {
    borderRadius: '50px',
    px: 5,
    py: 1,
    fontWeight: 800,
    textTransform: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    '&:not(:disabled):hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 20px ${theme.palette.primary.main}33`,
    },
  },
  imagePreviewContainer: {
    mt: 2,
    position: 'relative',
    borderRadius: '24px',
    overflow: 'hidden',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    bgcolor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    color: 'white',
    zIndex: 2,
    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
  },
})
