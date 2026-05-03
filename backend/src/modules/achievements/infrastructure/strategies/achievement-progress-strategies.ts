import type { PrismaClient } from '@/generated/prisma'

export type ProgressClient = Pick<
  PrismaClient,
  'post' | 'like' | 'follow' | '$queryRaw'
>
export type ProgressCalculator = (
  tx: ProgressClient,
  userId: string
) => Promise<number>

export const EVENT_PROGRESS_STRATEGIES: Record<string, ProgressCalculator> = {
  'post.created': (tx, userId) =>
    tx.post.count({ where: { authorId: userId, deletedAt: null } }),

  'post.liked': (tx, userId) =>
    tx.like.count({
      where: {
        userId,
        post: { authorId: { not: userId } },
      },
    }),

  'user.followed': (tx, userId) =>
    tx.follow.count({ where: { followerId: userId } }),

  'comment.created': (tx, userId) =>
    tx.post.count({
      where: { authorId: userId, parentId: { not: null } },
    }),

  'post.shared': (tx, userId) =>
    tx.post.count({
      where: { authorId: userId, parentId: { not: null } },
    }),

  'post.created_with_tags': (tx, userId) =>
    tx.post.count({
      where: {
        authorId: userId,
        deletedAt: null,
        tags: { some: {} },
      },
    }),
}

export const SLUG_PROGRESS_STRATEGIES: Record<string, ProgressCalculator> = {
  // 'daily_voice' debe contar días distintos, no posts totales
  daily_voice: async (tx, userId) => {
    type DailyVoiceCountRow = { count: bigint | number | string | null }
    const result = await tx.$queryRaw<DailyVoiceCountRow[]>`
      SELECT COUNT(DISTINCT DATE("createdAt")) as "count"
      FROM posts
      WHERE "authorId" = ${userId} AND "deletedAt" IS NULL
    `
    const count = Number(result[0]?.count ?? 0)
    return count
  },
}
