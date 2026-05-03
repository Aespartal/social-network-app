import { styled, Box, alpha } from '@mui/material'

export const ProfileContainer = styled(Box)(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
}))

export const ProfileMainColumn = styled(Box)(() => ({
  flexGrow: 1,
  width: '100%',
  minHeight: '100vh',
  position: 'relative',
}))

export const ProfileContentWrapper = styled(Box)(() => ({
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
}))

export const AuraHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '280px',
  width: '100%',
  background: `linear-gradient(to bottom, ${theme.palette.primary.main}22, transparent)`,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  paddingBottom: theme.spacing(4),
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'radial-gradient(circle at center, transparent 30%, background.default 100%)',
    opacity: 0.8,
  },
}))

export const ProfileTabContainer = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  backdropFilter: 'blur(8px)',
  position: 'sticky',
  top: 0,
  zIndex: 10,
  '& .MuiTabs-root': {
    minHeight: '48px',
  },
  '& .MuiTab-root': {
    fontWeight: 700,
    textTransform: 'none',
    fontSize: '0.9rem',
    minHeight: '48px',
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
  },
}))
