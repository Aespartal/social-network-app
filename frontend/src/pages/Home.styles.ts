import { Box, Tabs, styled, alpha } from '@mui/material'

export const HomeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  width: '100%',
}))

export const MainColumn = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  maxWidth: '600px',
  borderRight: `1px solid ${theme.palette.divider}`,
  minHeight: '100vh',
  position: 'relative',
}))

export const StickyHeader = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  backdropFilter: 'blur(12px)',
  zIndex: theme.zIndex.appBar - 1,
  borderBottom: `1px solid ${theme.palette.divider}`,
}))

export const HomeTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-root': {
    fontWeight: 700,
    textTransform: 'none',
    minHeight: '53px',
    fontSize: '0.95rem',
    transition: theme.transitions.create(['background-color', 'color'], {
      duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
  },
  '& .MuiTabs-indicator': {
    height: 4,
    borderRadius: '4px 4px 0 0',
  },
}))

export const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '350px',
  padding: theme.spacing(2),
  display: 'none',
  flexShrink: 0,
  [theme.breakpoints.up('lg')]: {
    display: 'block',
  },
}))
