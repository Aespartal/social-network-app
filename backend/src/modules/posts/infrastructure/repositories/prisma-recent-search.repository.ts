import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { PrismaClient } from '@/generated/prisma'
import type {
  RecentSearch,
  RecentSearchRepository,
} from '../../domain/repositories/recent-search.repository.interface'

@injectable()
export class PrismaRecentSearchRepository implements RecentSearchRepository {
  constructor(
    @inject(TYPES.PrismaClient)
    private readonly prisma: PrismaClient
  ) {}

  async findByUserId(userId: string, limit = 10): Promise<RecentSearch[]> {
    return this.prisma.recentSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  async save(userId: string, query: string): Promise<RecentSearch> {
    // Check if query already exists for this user to update timestamp instead of duplicating
    const existing = await this.prisma.recentSearch.findFirst({
      where: { userId, query },
    })

    if (existing) {
      return this.prisma.recentSearch.update({
        where: { id: existing.id },
        data: { createdAt: new Date() },
      })
    }

    return this.prisma.recentSearch.create({
      data: { userId, query },
    })
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.recentSearch.deleteMany({
      where: { id, userId },
    })
  }

  async clearAll(userId: string): Promise<void> {
    await this.prisma.recentSearch.deleteMany({
      where: { userId },
    })
  }
}
