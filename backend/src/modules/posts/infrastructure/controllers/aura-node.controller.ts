import { injectable, inject } from 'inversify'
import { FastifyRequest, FastifyReply } from 'fastify'
import { TYPES } from '@/lib/di-types'
import { container } from '@/lib/di-container'
import { AuraNodeRepository } from '../../domain/repositories/aura-node.repository.interface'

@injectable()
export class AuraNodeController {
  constructor(
    @inject(TYPES.AuraNodeRepository)
    private readonly auraNodeRepository: AuraNodeRepository
  ) {}

  async getTrending(request: FastifyRequest, reply: FastifyReply) {
    const limit = (request.query as any).limit || 5
    const nodes = await this.auraNodeRepository.findTrending(Number(limit))

    return reply.send({
      success: true,
      data: nodes.map(n => ({
        id: n.id,
        slug: n.slug,
        name: n.name,
        description: n.description,
        icon: n.icon,
        color: n.color,
        vibration: n.vibration,
        pulse: n.pulse,
        category: n.category,
      })),
    })
  }

  async getBySlug(request: FastifyRequest, reply: FastifyReply) {
    const { slug } = request.params as { slug: string }
    const node = await this.auraNodeRepository.findBySlug(slug)

    if (!node) {
      return reply.status(404).send({
        success: false,
        error: 'Nodo no encontrado',
      })
    }

    let isTuned = false
    const userId = (request.user as any)?.id

    if (userId) {
      const handler = container.get<any>(Symbol.for('PrismaClient'))
      const existing = await handler.userNode.findUnique({
        where: {
          userId_nodeId: {
            userId,
            nodeId: node.id,
          },
        },
      })
      isTuned = !!existing
    }

    return reply.send({
      success: true,
      data: {
        id: node.id,
        slug: node.slug,
        name: node.name,
        description: node.description,
        icon: node.icon,
        color: node.color,
        vibration: node.vibration,
        pulse: node.pulse,
        category: node.category,
        isTuned,
      },
    })
  }

  async tuneIntoNode(request: FastifyRequest, reply: FastifyReply) {
    const { slug } = request.params as { slug: string }
    const userId = (request.user as any).id

    const handler = container.get<any>(TYPES.TuneIntoNodeHandler)
    const result = await handler.execute(slug, userId)

    return reply.send({
      success: true,
      data: result,
    })
  }
}
