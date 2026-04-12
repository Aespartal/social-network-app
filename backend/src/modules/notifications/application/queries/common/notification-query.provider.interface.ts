import { Notification } from '../../../domain/entities/notification.entity'

export interface PagedNotifications {
  notifications: Notification[]
  meta: {
    hasMore: boolean
    nextCursor: string | null
  }
}

export interface NotificationQueryProvider {
  getUserNotifications(
    userId: string,
    limit: number,
    cursor?: string
  ): Promise<PagedNotifications>
  getUnreadCount(userId: string): Promise<number>
  getById(id: string): Promise<Notification | null>
}
