import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { PrismaClient } from '@/generated/prisma'
import {
  NotificationQueryProvider,
  PagedNotifications,
} from '../../application/queries/common/notification-query.provider.interface'
import {
  Notification,
  NotificationType,
} from '../../domain/entities/notification.entity'

@injectable()
export class PrismaNotificationQueryProvider implements NotificationQueryProvider {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async getUserNotifications(
    userId: string,
    limit: number,
    cursor?: string
  ): Promise<PagedNotifications> {
    const notifications = await this.prisma.notification.findMany({
      where: { recipientId: userId },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
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

    const hasMore = notifications.length > limit
    const results = hasMore ? notifications.slice(0, limit) : notifications
    const nextCursor = hasMore ? results[results.length - 1]!.id : null

    return {
      notifications: results.map(
        n =>
          new Notification({
            id: n.id,
            type: n.type as NotificationType,
            recipientId: n.recipientId,
            issuerId: n.issuerId,
            postId: n.postId,
            read: n.read,
            createdAt: n.createdAt,
            issuer: n.issuer || undefined,
            post: n.post || undefined,
            metadata: (n.metadata as Record<string, unknown>) || undefined,
          })
      ),
      meta: {
        hasMore,
        nextCursor,
      },
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        recipientId: userId,
        read: false,
      },
    })
  }

  async getById(id: string): Promise<Notification | null> {
    const n = await this.prisma.notification.findUnique({
      where: { id },
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

    if (!n) return null

    return new Notification({
      id: n.id,
      type: n.type as NotificationType,
      recipientId: n.recipientId,
      issuerId: n.issuerId,
      postId: n.postId,
      read: n.read,
      createdAt: n.createdAt,
      issuer: n.issuer || undefined,
      post: n.post || undefined,
      metadata: (n.metadata as Record<string, unknown>) || undefined,
    })
  }
}
