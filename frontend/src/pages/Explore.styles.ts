import { styled, Box, alpha } from '@mui/material'

export const ExploreContainer = styled(Box)(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
}))

export const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(0, 2),
  gap: theme.spacing(4),
}))

export const MainColumn = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  maxWidth: '650px',
  minHeight: '100vh',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}))

export const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '350px',
  position: 'sticky',
  top: 20,
  padding: theme.spacing(2, 0),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  [theme.breakpoints.down('lg')]: {
    display: 'none',
  },
}))

export const StickyHeader = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  // backgroundColor: alpha(theme.palette.background.default, 0.8),
  backdropFilter: 'blur(20px)',
  zIndex: theme.zIndex.appBar - 1,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: theme.spacing(2, 4),
}))

export const ResonanceGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: theme.spacing(2),
  padding: theme.spacing(3, 0),
  width: '100%',
}))

export const ResonanceNode = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '24px',
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(15px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  '&:hover': {
    transform: 'translateY(-5px)',
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    borderColor: theme.palette.primary.main,
    boxShadow:
      theme.palette.mode === 'dark'
        ? `0 12px 24px rgba(0, 0, 0, 0.3)`
        : `0 12px 24px rgba(0, 0, 0, 0.05)`,
  },
}))

export const DiscoveryMosaic = styled(Box)(({ theme }) => ({
  width: '100%',
  flexGrow: 1,
  padding: theme.spacing(2, 0),
}))
