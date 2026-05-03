import { styled, Box, alpha } from '@mui/material'
import { motion } from 'framer-motion'

export const SearchContainer = styled(Box)(() => ({
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
  bgcolor: alpha(theme.palette.background.paper, 0.85),
  backdropFilter: 'blur(12px)',
  zIndex: 10,
  padding: theme.spacing(2, 0),
}))

export const FeedSelectorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  alignItems: 'center',
}))

export const FeedSelectorItem = styled(Box, {
  shouldForwardProp: prop => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  cursor: 'pointer',
  position: 'relative',
  padding: theme.spacing(1, 0),
  transition: 'all 0.3s ease',
  '& span': {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '0.95rem',
    fontWeight: active ? 800 : 400,
    color: active ? theme.palette.text.primary : theme.palette.text.secondary,
    opacity: active ? 1 : 0.6,
    transition: 'all 0.3s ease',
  },
  '&:hover span': {
    opacity: 1,
    color: theme.palette.primary.main,
  },
}))

export const AuraDot = styled(motion.div)(() => ({
  position: 'absolute',
  bottom: 0,
  left: '10%',
  right: '15%',
  height: '3px',
  borderRadius: '4px 4px 0 0',
  backgroundColor: '#88B04B',
  boxShadow: `0 0 15px ${alpha('#88B04B', 0.6)}`,
  zIndex: 1,
}))
