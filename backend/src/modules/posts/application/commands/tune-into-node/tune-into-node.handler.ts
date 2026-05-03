import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { AuraNodeRepository } from '../../../domain/repositories/aura-node.repository.interface'
import { PostError } from '../../../domain/errors'
import type { PrismaClient } from '@/generated/prisma'

@injectable()
export class TuneIntoNodeHandler {
  constructor(
    @inject(TYPES.AuraNodeRepository)
    private readonly auraNodeRepository: AuraNodeRepository,
    @inject(TYPES.PrismaClient)
    private readonly prisma: PrismaClient
  ) {}

  async execute(slug: string, userId: string): Promise<{ isTuned: boolean }> {
    const node = await this.auraNodeRepository.findBySlug(slug)

    if (!node) {
      throw PostError.notFound(`Node with slug ${slug} not found`)
    }

    const existingUserNode = await this.prisma.userNode.findUnique({
      where: {
        userId_nodeId: {
          userId,
          nodeId: node.id,
        },
      },
    })

    if (existingUserNode) {
      // Untune
      await this.prisma.userNode.delete({
        where: {
          userId_nodeId: {
            userId,
            nodeId: node.id,
          },
        },
      })
      return { isTuned: false }
    } else {
      // Tune in
      await this.prisma.userNode.create({
        data: {
          userId,
          nodeId: node.id,
        },
      })
      return { isTuned: true }
    }
  }
}
