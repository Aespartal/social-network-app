import { Notification } from '../../domain/entities/notification.entity'

export interface NotificationDTO {
  id: string
  type: string
  recipientId: string
  issuerId: string
  postId?: string
  read: boolean
  createdAt: string
  issuer?: {
    username: string
    name: string
    avatar: string | null
  }
  post?: {
    content: string
  }
}

export class NotificationMapper {
  static toDTO(notification: Notification): NotificationDTO {
    return {
      id: notification.id,
      type: notification.type,
      recipientId: notification.recipientId,
      issuerId: notification.issuerId,
      postId: notification.postId || undefined,
      read: notification.read,
      createdAt: notification.createdAt.toISOString(),
      issuer: notification.issuer,
      post: notification.post,
    }
  }

  static toDTOs(notifications: Notification[]): NotificationDTO[] {
    return notifications.map(n => this.toDTO(n))
  }
}
