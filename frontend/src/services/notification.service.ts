import axiosInstance from './axiosInstance'
import { API_ENDPOINTS } from '@/constants'
import { Notification } from 'social-network-app-shared/types/social.type'
export type { Notification }

export interface NotificationsResponse {
  success: boolean
  data: {
    notifications: Notification[]
    meta: {
      hasMore: boolean
      nextCursor: string | null
    }
  }
}

class NotificationService {
  async getNotifications(
    limit = 20,
    cursor?: string
  ): Promise<NotificationsResponse['data']> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.NOTIFICATIONS.GET_ALL,
      {
        params: { limit, cursor },
      }
    )
    return response.data.data
  }

  async markAsRead(id?: string, all = false): Promise<void> {
    const url = id
      ? API_ENDPOINTS.NOTIFICATIONS.MARK_SINGLE_READ(id)
      : API_ENDPOINTS.NOTIFICATIONS.MARK_READ

    await axiosInstance.patch(
      url,
      {},
      {
        params: { all },
      }
    )
  }

  async getUnreadCount(): Promise<number> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT
    )
    return response.data.data
  }
}

export const notificationService = new NotificationService()
