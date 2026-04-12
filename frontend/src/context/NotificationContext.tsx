import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { io, Socket } from 'socket.io-client'
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
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [, setSocket] = useState<Socket | null>(null)

  console.log('Next cursor for notifications:', nextCursor)

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
      setNextCursor(data.meta.nextCursor)
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

  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    // Usar la URL base de la API pero para el socket (quitando /api)
    const socketUrl = API_CONFIG.BASE_URL.replace('/api', '')

    const newSocket = io(socketUrl, {
      query: { userId: user.id },
      transports: ['websocket', 'polling'],
    })

    newSocket.on('connect', () => {
      console.log('✅ Socket conectado con ID:', newSocket.id)
    })

    newSocket.on('connect_error', error => {
      console.error('❌ Error de conexión Socket:', error)
    })

    newSocket.on('notification', data => {
      console.log('🔔 Nueva notificación recibida:', data)
      setUnreadCount(prev => prev + 1)

      // Si la data trae la notificación completa, la prependeamos
      if (data.id) {
        setNotifications(prev => [data, ...prev])
      } else {
        // Si es solo un aviso, refrescamos el contador
        fetchUnreadCount()
      }
    })

    setSocket(newSocket)
    fetchUnreadCount()

    return () => {
      console.log('🔌 Desconectando socket...')
      newSocket.disconnect()
    }
  }, [user, fetchUnreadCount])

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
