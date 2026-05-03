import { styled, Box, alpha } from '@mui/material'

export const AchievementsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
}))

export const AuraEvolutionCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '32px',
  background: alpha(theme.palette.background.paper, 0.4),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '150px',
    height: '150px',
    background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
    zIndex: 0,
  },
}))

export const SlimProgress = styled(Box)(({ theme }) => ({
  height: '4px',
  width: '100%',
  backgroundColor: alpha(theme.palette.divider, 0.1),
  borderRadius: '2px',
  position: 'relative',
  overflow: 'hidden',
  '& div': {
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    boxShadow: `0 0 10px ${theme.palette.primary.main}`,
    transition: 'width 1s ease-in-out',
  },
}))

export const AchievementCircle = styled(Box, {
  shouldForwardProp: prop => prop !== 'completed' && prop !== 'color',
})<{ completed?: boolean; color?: string }>(({ theme, completed, color }) => ({
  width: 56,
  height: 56,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  backgroundColor: completed
    ? alpha(color || theme.palette.primary.main, 0.1)
    : alpha(theme.palette.divider, 0.05),
  border: `2px solid ${
    completed
      ? alpha(color || theme.palette.primary.main, 0.4)
      : alpha(theme.palette.divider, 0.1)
  }`,
  filter: completed ? 'none' : 'grayscale(1) opacity(0.3)',
  '&:hover': {
    transform: 'scale(1.15)',
    boxShadow: completed
      ? `0 0 20px ${alpha(color || theme.palette.primary.main, 0.3)}`
      : 'none',
    filter: 'none',
  },
}))

export const CategoryLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  '& span': {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    fontWeight: 800,
    color: theme.palette.text.secondary,
  },
}))

export const ZenModal = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '380px',
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(20px)',
  borderRadius: '32px',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  padding: theme.spacing(4),
  outline: 'none',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
}))
