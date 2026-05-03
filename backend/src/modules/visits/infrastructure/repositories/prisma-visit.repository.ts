import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { VisitRepository } from '../../domain/repositories/visit.repository.interface'
import { ProfileVisit } from '../../domain/entities/visit.entity'
import { PrismaClient } from '../../../../generated/prisma/client'

interface VisitWithVisitor {
  visitorId: string
  visitedId: string
  createdAt: Date
  visitor: {
    id: string
    username: string
    name: string
    avatar: string | null
  } | null
}

@injectable()
export class PrismaVisitRepository implements VisitRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async recordVisit(visitorId: string, visitedId: string): Promise<void> {
    await this.prisma.profileVisit.upsert({
      where: {
        visitorId_visitedId: {
          visitorId,
          visitedId,
        },
      },
      update: {
        createdAt: new Date(),
      },
      create: {
        visitorId,
        visitedId,
      },
    })
  }

  async getProfileVisits(userId: string, limit = 10): Promise<ProfileVisit[]> {
    const visits = await this.prisma.profileVisit.findMany({
      where: { visitedId: userId },
      include: {
        visitor: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['visitorId'],
      take: limit,
    })

    return visits.map((v: VisitWithVisitor) => ({
      visitorId: v.visitorId,
      visitedId: v.visitedId,
      createdAt: v.createdAt,
      visitor: v.visitor ?? undefined,
    }))
  }

  async countVisits(userId: string): Promise<number> {
    return this.prisma.profileVisit.count({
      where: { visitedId: userId },
    })
  }
}
