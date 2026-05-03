import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

export const getSearchBarStyles = (theme: Theme, isFocused: boolean) => ({
  container: {
    position: 'relative',
    width: '100%',
  },
  searchPaper: {
    p: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    borderRadius: '50px', // Pill shape biofílica
    bgcolor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.6)
        : alpha(theme.palette.text.primary, 0.04),
    border: '1px solid',
    borderColor: isFocused ? 'primary.main' : 'transparent',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 11,
    position: 'relative',
    boxShadow: isFocused ? `0 0 15px ${theme.palette.primary.main}33` : 'none',
  },
  input: {
    ml: 1,
    flex: 1,
    fontSize: '0.95rem',
    fontFamily: theme.typography.body2.fontFamily,
  },
  dropdownPaper: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    mt: 1.5,
    zIndex: 10,
    maxHeight: '400px',
    overflowY: 'auto',
    borderRadius: theme.tokens.borderRadius.md,
    boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    backdropFilter: 'blur(10px)',
  },
  dropdownHeader: {
    p: 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownTitle: {
    fontFamily: theme.typography.h1.fontFamily,
    fontWeight: 800,
    fontSize: '0.9rem',
    letterSpacing: '-0.01em',
  },
  clearAll: {
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'primary.main',
    '&:hover': { textDecoration: 'underline' },
  },
  recentItem: {
    px: 2,
    py: 1.5,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': { bgcolor: 'action.hover' },
  },
})
