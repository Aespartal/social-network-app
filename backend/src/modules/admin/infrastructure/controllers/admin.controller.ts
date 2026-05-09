import { FastifyReply, FastifyRequest } from 'fastify'
import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { PrismaClient } from '@/generated/prisma'
import { Role } from '@/enums/role.enum'
import type { Logger } from '@/lib/logger/logger.interface'

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
    @inject(TYPES.Logger) private readonly logger: Logger
  ) {}

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const [totalUsers, totalPosts, activeUsers] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.post.count({ where: { deletedAt: null } }),
        this.prisma.session
          .groupBy({
            by: ['userId'],
            where: { expiresAt: { gte: new Date() } },
          })
          .then(res => res.length),
      ])

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const dailyGrowth = await this.prisma.user.groupBy({
        by: ['createdAt'],
        where: { createdAt: { gte: sevenDaysAgo } },
        _count: true,
      })

      return reply.send({
        success: true,
        data: {
          totalUsers,
          totalPosts,
          activeUsers,
          reportsPending: 0,
          dailyGrowth,
        },
      })
    } catch (error) {
      this.logger.error('Error fetching admin stats:', error as Error)
      return reply
        .status(500)
        .send({ success: false, error: 'Error al obtener estadísticas' })
    }
  }

  async getUsers(request: FastifyRequest, reply: FastifyReply) {
    const { page = 1, limit = 10 } = request.query as {
      page?: number
      limit?: number
    }
    const skip = (page - 1) * limit

    try {
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            username: true,
            name: true,
            avatar: true,
            role: true,
            active: true,
            createdAt: true,
            totalXP: true,
            currentLevel: true,
          },
        }),
        this.prisma.user.count(),
      ])

      return reply.send({
        success: true,
        data: users,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      })
    } catch (error) {
      this.logger.error('Error fetching admin users:', error as Error)
      return reply
        .status(500)
        .send({ success: false, error: 'Error al obtener usuarios' })
    }
  }

  async updateUserRole(
    request: FastifyRequest<{ Params: { id: string }; Body: { role: Role } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params
    const { role } = request.body

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, role: true },
      })

      return reply.send({ success: true, data: updatedUser })
    } catch (error) {
      this.logger.error('Error updating user role:', error as Error)
      return reply
        .status(500)
        .send({ success: false, error: 'Error al actualizar rol' })
    }
  }

  async toggleUserActive(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params

    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { active: true },
      })
      if (!user)
        return reply
          .status(404)
          .send({ success: false, error: 'Usuario no encontrado' })

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: { active: !user.active },
        select: { id: true, active: true },
      })

      return reply.send({ success: true, data: updatedUser })
    } catch (error) {
      this.logger.error('Error toggling user status:', error as Error)
      return reply
        .status(500)
        .send({ success: false, error: 'Error al cambiar estado' })
    }
  }
}
