import { Notification } from '../entities/notification.entity'

export interface NotificationRepository {
  create(notification: Notification): Promise<Notification | void>
  markAsRead(id: string): Promise<void>
  markAllAsRead(userId: string): Promise<void>
}
