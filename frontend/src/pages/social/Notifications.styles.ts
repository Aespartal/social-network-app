import { styled, Box, alpha } from '@mui/material'

export const NotificationsContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(4),
  minHeight: '100vh',
}))

export const SyncHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}))

export const SyncTitle = styled(Box)(({ theme }) => ({
  '& h1': {
    fontSize: '2.5rem',
    fontWeight: 800,
    fontFamily: theme.typography.h1.fontFamily,
    letterSpacing: '-0.03em',
    marginBottom: theme.spacing(0.5),
  },
  '& p': {
    color: theme.palette.text.secondary,
    fontSize: '1rem',
    opacity: 0.7,
  },
}))

export const NotificationCard = styled(Box, {
  shouldForwardProp: prop => prop !== 'unread',
})<{ unread?: boolean }>(({ theme, unread }) => ({
  padding: theme.spacing(3),
  borderRadius: '24px',
  backgroundColor: unread
    ? alpha(theme.palette.primary.main, 0.03)
    : alpha(theme.palette.background.paper, 0.6),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${unread ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.divider, 0.1)}`,
  marginBottom: theme.spacing(2),
  display: 'flex',
  gap: theme.spacing(3),
  alignItems: 'center',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateX(10px)',
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    borderColor: theme.palette.primary.main,
    boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.05)}`,
  },
  ...(unread && {
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '4px',
      backgroundColor: theme.palette.primary.main,
      boxShadow: `0 0 15px ${theme.palette.primary.main}`,
    },
  }),
}))

export const SyncMessage = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  '& strong': {
    fontWeight: 700,
    color: theme.palette.text.primary,
  },
  '& p': {
    marginTop: theme.spacing(0.5),
    fontFamily: 'Lora, serif',
    fontStyle: 'italic',
    opacity: 0.8,
    lineHeight: 1.5,
  },
}))

export const SyncIconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1.5),
  borderRadius: '16px',
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  color: theme.palette.text.secondary,
}))
