import { Box, styled, alpha } from '@mui/material'
import { motion } from 'framer-motion'

export const HomeContainer = styled(Box)(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
}))

export const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: '100%',
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
  backdropFilter: 'blur(20px)',
  zIndex: theme.zIndex.appBar - 1,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: theme.spacing(2, 4),
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
    fontSize: '1rem',
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
  height: '4px',
  borderRadius: '4px 4px 0 0',
  backgroundColor: '#E0FF4F',
  boxShadow: `0 0 20px ${alpha('#E0FF4F', 0.8)}, 0 0 10px ${alpha('#E0FF4F', 0.4)}`,
  zIndex: 1,
}))
