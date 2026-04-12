import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { PrismaClient } from '@/generated/prisma'
import { NotificationRepository } from '../../domain/repositories/notification.repository.interface'
import {
  Notification,
  NotificationType,
} from '../../domain/entities/notification.entity'

@injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async create(notification: Notification): Promise<Notification | void> {
    if (notification.recipientId === notification.issuerId) return

    const created = await this.prisma.notification.create({
      data: {
        type: notification.type,
        recipientId: notification.recipientId,
        issuerId: notification.issuerId,
        postId: notification.postId,
        read: false,
      },
      include: {
        issuer: {
          select: {
            username: true,
            name: true,
            avatar: true,
          },
        },
        post: {
          select: {
            content: true,
          },
        },
      },
    })

    return new Notification({
      id: created.id,
      type: created.type as NotificationType,
      recipientId: created.recipientId,
      issuerId: created.issuerId,
      postId: created.postId || undefined,
      read: created.read,
      createdAt: created.createdAt,
      issuer: created.issuer,
      post: created.post || undefined,
    })
  }

  async markAsRead(id: string): Promise<void> {
    await this.prisma.notification.update({
      where: { id },
      data: { read: true },
    })
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { recipientId: userId, read: false },
      data: { read: true },
    })
  }
}
