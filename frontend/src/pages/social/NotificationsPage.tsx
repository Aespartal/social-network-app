import React, { useEffect } from 'react'
import {
  Box,
  Text as Typography,
  IconButton,
  Tooltip,
  Loading,
  Button,
} from '@/components/ui'
import { OptimizedAvatar } from '@/components/common'
import {
  DoneAll as DoneAllIcon,
  FavoriteBorder as LikeIcon,
  ChatBubbleOutline as ReplyIcon,
  PersonAddOutlined as FollowIcon,
  AlternateEmail as MentionIcon,
  EmojiEventsOutlined as AchievementIcon,
} from '@mui/icons-material'
import { useNotifications } from '@/contexts/NotificationContext'
import { formatTimeAgo } from '@/utils/date'
import { useNavigate } from 'react-router-dom'
import { Notification } from 'social-network-app-shared/types/social.type'

// Estilos Zen
import {
  NotificationsContainer,
  SyncHeader,
  SyncTitle,
  NotificationCard,
  SyncMessage,
  SyncIconBox,
} from './Notifications.styles'

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
        return <LikeIcon fontSize='small' />
      case 'REPLY':
        return <ReplyIcon fontSize='small' />
      case 'FOLLOW':
        return <FollowIcon fontSize='small' />
      case 'MENTION':
        return <MentionIcon fontSize='small' />
      case 'ACHIEVEMENT':
        return <AchievementIcon fontSize='small' />
      default:
        return null
    }
  }

  const getSyncMessage = (notification: Notification) => {
    const issuer = <strong>{notification.issuer.name}</strong>
    switch (notification.type) {
      case 'LIKE':
        return <>Tu pensamiento ha resonado con {issuer}</>
      case 'REPLY':
        return <>{issuer} ha expandido tu idea</>
      case 'FOLLOW':
        return <>Has entrado en sincronía con {issuer}</>
      case 'MENTION':
        return <>{issuer} ha invocado tu presencia</>
      case 'ACHIEVEMENT':
        return (
          <>
            Tu Aura ha evolucionado:{' '}
            <strong>{notification.metadata?.achievementName}</strong>
          </>
        )
      default:
        return ''
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    markOneAsRead(notification.id)
    if (notification.type === 'ACHIEVEMENT') {
      navigate(`/profile/${notification.issuer.username}/achievements`)
      return
    }
    if (notification.postId) {
      navigate(`/post/${notification.postId}`)
    } else if (notification.type === 'FOLLOW') {
      navigate(`/profile/${notification.issuer.username}`)
    }
  }

  return (
    <NotificationsContainer>
      <SyncHeader>
        <SyncTitle>
          <Typography variant='h1' component='h1'>
            Registro de Sincronicidad
          </Typography>
          <Typography variant='body1'>
            Momentos en los que tu Aura ha resonado con otros.
          </Typography>
        </SyncTitle>
        <Tooltip title='Marcar todos como leídos'>
          <IconButton
            onClick={markAllAsRead}
            sx={{
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'primary.main', color: 'white' },
            }}
          >
            <DoneAllIcon />
          </IconButton>
        </Tooltip>
      </SyncHeader>

      <Box sx={{ mt: 4 }}>
        {notifications.map(notification => {
          if (!notification || !notification.issuer) return null

          return (
            <NotificationCard
              key={notification.id}
              unread={!notification.read}
              onClick={() => handleNotificationClick(notification)}
            >
              <Box sx={{ position: 'relative' }}>
                <OptimizedAvatar
                  src={notification.issuer.avatar}
                  alt={notification.issuer.name}
                  size={56}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    bgcolor: 'background.paper',
                    borderRadius: '50%',
                    p: 0.5,
                    display: 'flex',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  {getIcon(notification.type)}
                </Box>
              </Box>

              <SyncMessage>
                <Typography variant='body1'>
                  {getSyncMessage(notification)}
                </Typography>

                {notification.post && (
                  <Typography variant='body2' color='text.secondary'>
                    "{notification.post.content}"
                  </Typography>
                )}

                <Typography
                  variant='caption'
                  color='text.disabled'
                  sx={{ mt: 1, display: 'block' }}
                >
                  {notification.createdAt
                    ? formatTimeAgo(new Date(notification.createdAt))
                    : ''}
                </Typography>
              </SyncMessage>

              <SyncIconBox>{getIcon(notification.type)}</SyncIconBox>
            </NotificationCard>
          )
        })}

        {notifications.length === 0 && !loading && (
          <Box sx={{ py: 12, textAlign: 'center', opacity: 0.5 }}>
            <Typography
              variant='h5'
              sx={{ fontFamily: 'Lora, serif', fontStyle: 'italic' }}
            >
              Aún no hay ecos en tu lienzo.
            </Typography>
            <Typography variant='body2' sx={{ mt: 1 }}>
              Sigue compartiendo tu aura para generar nuevas sincronías.
            </Typography>
          </Box>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <Loading size='md' />
          </Box>
        )}

        {hasMore && !loading && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant='outline'
              onClick={() =>
                fetchNotifications(notifications[notifications.length - 1].id)
              }
              sx={{ borderRadius: '50px', px: 6 }}
            >
              Explorar más sincronías
            </Button>
          </Box>
        )}
      </Box>
    </NotificationsContainer>
  )
}
