import React, { useEffect } from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  CircularProgress,
  Button,
} from '@mui/material'
import { OptimizedAvatar } from '@/components/common'
import {
  DoneAll as DoneAllIcon,
  Favorite as FavoriteIcon,
  ChatBubble as ReplyIcon,
  PersonAdd as FollowIcon,
  AlternateEmail as MentionIcon,
} from '@mui/icons-material'
import { useNotifications } from '@/context/NotificationContext'
import { formatTimeAgo } from '@/utils/date'
import { useNavigate } from 'react-router-dom'
import { Notification } from 'social-network-app-shared/types/social.type'

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    loading,
    hasMore,
    fetchNotifications,
    markAllAsRead,
    markOneAsRead,
  } = useNotifications()
  const navigate = useNavigate()

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const getIcon = (type: string) => {
    switch (type) {
      case 'LIKE':
        return <FavoriteIcon sx={{ color: 'error.main' }} />
      case 'REPLY':
        return <ReplyIcon sx={{ color: 'primary.main' }} />
      case 'FOLLOW':
        return <FollowIcon sx={{ color: 'info.main' }} />
      case 'MENTION':
        return <MentionIcon sx={{ color: 'warning.main' }} />
      default:
        return null
    }
  }

  const getMessage = (notification: Notification) => {
    const issuerName = <strong>{notification.issuer.name}</strong>
    switch (notification.type) {
      case 'LIKE':
        return <>{issuerName} le dio me gusta a tu post</>
      case 'REPLY':
        return <>{issuerName} respondió a tu post</>
      case 'FOLLOW':
        return <>{issuerName} comenzó a seguirte</>
      case 'MENTION':
        return <>{issuerName} te mencionó en un post</>
      default:
        return ''
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    markOneAsRead(notification.id)
    if (notification.postId) {
      navigate(`/post/${notification.postId}`)
    } else if (notification.type === 'FOLLOW') {
      navigate(`/profile/${notification.issuer.username}`)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant='h5' fontWeight='bold'>
          Notificaciones
        </Typography>
        <Tooltip title='Marcar todas como leídas'>
          <IconButton onClick={markAllAsRead}>
            <DoneAllIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Paper variant='outlined' sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <List sx={{ p: 0 }}>
          {notifications.map((notification, index) => {
            if (!notification || !notification.issuer) return null

            return (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems='flex-start'
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 56 }}>
                    <Box sx={{ position: 'relative' }}>
                      <OptimizedAvatar
                        src={notification.issuer.avatar}
                        alt={notification.issuer.name || 'Usuario'}
                        size='md'
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: -4,
                          right: -4,
                          bgcolor: 'background.paper',
                          borderRadius: '50%',
                          p: 0.2,
                          display: 'flex',
                        }}
                      >
                        {getIcon(notification.type)}
                      </Box>
                    </Box>
                  </ListItemAvatar>
                  <ListItemText
                    primary={getMessage(notification)}
                    secondary={
                      <Box
                        component='span'
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          mt: 0.5,
                        }}
                      >
                        {notification.post && (
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            noWrap
                            sx={{ fontStyle: 'italic', mb: 0.5 }}
                          >
                            "{notification.post.content}"
                          </Typography>
                        )}
                        <Typography variant='caption' color='text.disabled'>
                          {notification.createdAt
                            ? formatTimeAgo(new Date(notification.createdAt))
                            : ''}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider component='li' />}
              </React.Fragment>
            )
          })}

          {notifications.length === 0 && !loading && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color='text.secondary'>
                No tienes notificaciones aún.
              </Typography>
            </Box>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {hasMore && !loading && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button
                onClick={() =>
                  fetchNotifications(notifications[notifications.length - 1].id)
                }
              >
                Cargar más
              </Button>
            </Box>
          )}
        </List>
      </Paper>
    </Box>
  )
}
