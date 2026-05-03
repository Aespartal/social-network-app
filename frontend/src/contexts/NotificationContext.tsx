import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { Snackbar, Alert, AlertTitle } from '@mui/material'
import { io } from 'socket.io-client'
import {
  notificationService,
  Notification,
} from '@/services/notification.service'
import { API_CONFIG } from '@/constants'
import { useAuth } from '@/hooks'

interface NotificationContextType {
  unreadCount: number
  notifications: Notification[]
  loading: boolean
  hasMore: boolean
  fetchNotifications: (cursor?: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  markOneAsRead: (id: string) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [achievementShow, setAchievementShow] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState<{
    name: string
    xp: number
  } | null>(null)

  const { user } = useAuth()

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }, [])

  const fetchNotifications = useCallback(async (cursor?: string) => {
    setLoading(true)
    try {
      const data = await notificationService.getNotifications(20, cursor)
      if (cursor) {
        setNotifications(prev => [...prev, ...data.notifications])
      } else {
        setNotifications(data.notifications)
      }
      setHasMore(data.meta.hasMore)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const markAllAsRead = async () => {
    try {
      await notificationService.markAsRead(undefined, true)
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const markOneAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      setUnreadCount(prev => Math.max(0, prev - 1))
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  useEffect(() => {
    if (!user?.id) return

    const socketUrl = API_CONFIG.BASE_URL.replace('/api', '')
    const socket = io(socketUrl, {
      query: { userId: user.id },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    })

    socket.on('connect', () => {
      console.log(`✅ Socket conectado [user:${user.id}] ID: ${socket.id}`)
    })

    socket.on('connect_error', error => {
      console.error('❌ Error de conexión Socket:', error)
    })

    socket.on('notification', data => {
      console.log('🔔 Nueva notificación recibida:', data)
      setUnreadCount(prev => prev + 1)

      if (data.type === 'ACHIEVEMENT') {
        const achievementName =
          data.metadata?.achievementName ||
          data.achievementName ||
          '¡Nuevo Logro!'
        const xp = data.metadata?.xpEarned || data.xpEarned || 0

        console.log(`🏆 LOGRO DESBLOQUEADO: ${achievementName} (+${xp} XP)`)

        setCurrentAchievement({ name: achievementName, xp })
        setAchievementShow(true)
      }

      if (data.id) {
        setNotifications(prev => [data, ...prev])
      } else {
        fetchUnreadCount()
      }
    })

    fetchUnreadCount()

    // Cleanup: desconectar cuando cambie el usuario o se desmonte
    return () => {
      console.log(`🔌 Desconectando socket de user:${user.id}`)
      socket.disconnect()
    }
  }, [user?.id, fetchUnreadCount])

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        loading,
        hasMore,
        fetchNotifications,
        markAllAsRead,
        markOneAsRead,
      }}
    >
      {children}

      {/* 🏆 Toast discreto de Logro */}
      <Snackbar
        open={achievementShow}
        autoHideDuration={4000}
        onClose={() => setAchievementShow(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity='success'
          variant='filled'
          onClose={() => setAchievementShow(false)}
          icon={<span style={{ fontSize: 18 }}>🏆</span>}
          sx={{
            bgcolor: 'background.paper',
            color: 'text.primary',
            border: '1px solid',
            borderColor: 'warning.main',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '& .MuiAlert-icon': { alignItems: 'center' },
            '& .MuiAlert-action': { alignItems: 'center' },
          }}
        >
          <AlertTitle
            sx={{
              fontWeight: 700,
              fontSize: '0.85rem',
              mb: 0.2,
              color: 'warning.main',
            }}
          >
            ¡Logro desbloqueado!
          </AlertTitle>
          <span style={{ fontSize: '0.8rem' }}>
            {currentAchievement?.name}
            {currentAchievement?.xp ? (
              <strong style={{ marginLeft: 4, color: '#FFA500' }}>
                +{currentAchievement.xp} XP
              </strong>
            ) : null}
          </span>
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    )
  }
  return context
}
