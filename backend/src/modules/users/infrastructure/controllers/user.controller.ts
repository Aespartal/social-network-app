import { FastifyReply, FastifyRequest } from 'fastify'
import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { PrismaClient } from '@/generated/prisma'
import { GetUserMeHandler } from '../../application/queries/get-me/get-me.handler'
import { GetUserByUsernameHandler } from '../../application/queries/get-user-by-username/get-user-by-username.handler'
import { GetSuggestedUsersHandler } from '../../application/queries/get-suggested-users/get-suggested-users.handler'
import { UpdateUserHandler } from '../../application/commands/update-user/update-user.handler'
import { FollowUserHandler } from '../../application/commands/follow/follow-user.handler'
import { UnfollowUserHandler } from '../../application/commands/unfollow/unfollow-user.handler'
import { GetFollowersHandler } from '../../application/queries/get-followers/get-followers.handler'
import { GetFollowingHandler } from '../../application/queries/get-following/get-following.handler'
import { IsFollowingHandler } from '../../application/queries/is-following/is-following.handler'
import { parseUpdateProfileMultipart } from '@/utils/multipart-helper'
import { UserError } from '../../domain/errors/user.errors'
import { GamificationService } from '@/modules/achievements/domain/services/gamification.service'
import type { Logger } from '@/lib/logger/logger.interface'

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
    @inject(TYPES.GetUserMeHandler)
    private readonly getMeHandler: GetUserMeHandler,
    @inject(TYPES.GetUserByUsernameHandler)
    private readonly getUserByUsernameHandler: GetUserByUsernameHandler,
    @inject(TYPES.GetSuggestedUsersHandler)
    private readonly getSuggestedUsersHandler: GetSuggestedUsersHandler,
    @inject(TYPES.UpdateUserHandler)
    private readonly updateUserHandler: UpdateUserHandler,
    @inject(TYPES.FollowUserHandler)
    private readonly followUserHandler: FollowUserHandler,
    @inject(TYPES.UnfollowUserHandler)
    private readonly unfollowUserHandler: UnfollowUserHandler,
    @inject(TYPES.GetFollowersHandler)
    private readonly getFollowersHandler: GetFollowersHandler,
    @inject(TYPES.GetFollowingHandler)
    private readonly getFollowingHandler: GetFollowingHandler,
    @inject(TYPES.IsFollowingHandler)
    private readonly isFollowingHandler: IsFollowingHandler,
    @inject(TYPES.GamificationService)
    private readonly gamificationService: GamificationService,
    @inject(TYPES.Logger) private readonly logger: Logger
  ) {}

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user!.id
    try {
      const user = await this.getMeHandler.execute({ userId })
      return reply.send({ success: true, data: user })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getUserByUsername(
    request: FastifyRequest<{ Params: { username: string } }>,
    reply: FastifyReply
  ) {
    const { username } = request.params
    try {
      const user = await this.getUserByUsernameHandler.execute({ username })
      return reply.send({ success: true, data: user })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async follow(request: FastifyRequest, reply: FastifyReply) {
    const { id: followedId } = request.params as { id: string }
    const followerId = request.user!.id

    try {
      await this.followUserHandler.execute({ followerId, followedId })
      return reply.send({ success: true, message: 'User followed' })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async unfollow(request: FastifyRequest, reply: FastifyReply) {
    const { id: followedId } = request.params as { id: string }
    const followerId = request.user!.id

    try {
      await this.unfollowUserHandler.execute({ followerId, followedId })
      return reply.send({ success: true, message: 'User unfollowed' })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getFollowers(request: FastifyRequest, reply: FastifyReply) {
    const { id: userId } = request.params as { id: string }
    const currentUserId = request.user?.id

    try {
      const followers = await this.getFollowersHandler.execute({
        userId,
        currentUserId,
      })
      return reply.send({ success: true, data: followers })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getFollowing(request: FastifyRequest, reply: FastifyReply) {
    const { id: userId } = request.params as { id: string }
    const currentUserId = request.user?.id

    try {
      const following = await this.getFollowingHandler.execute({
        userId,
        currentUserId,
      })
      return reply.send({ success: true, data: following })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getSuggestedUsers(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user!.id
    const query = request.query as { limit?: string }
    const limit = Number(query.limit) || 5

    try {
      const suggestedUsers = await this.getSuggestedUsersHandler.execute({
        userId,
        limit,
      })
      return reply.send({ success: true, data: suggestedUsers })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async updateProfile(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params
    const userId = request.user!.id

    if (id !== userId) {
      this.logger.warn(
        'Intento de acceso no autorizado para actualizar perfil',
        {
          currentUserId: userId,
          targetUserId: id,
        }
      )
      return reply.status(403).send({
        success: false,
        error: 'No tienes permiso para actualizar este perfil',
      })
    }

    if (!request.isMultipart()) {
      this.logger.warn('Intento de actualizar perfil sin multipart/form-data', {
        userId: userId,
      })
      return reply.status(400).send({
        success: false,
        error: 'El contenido debe ser multipart/form-data',
      })
    }

    try {
      const { username, name, bio, avatarUrl } =
        await parseUpdateProfileMultipart(request.parts())

      const updateData: {
        username?: string
        name?: string
        bio?: string
        avatar?: string
      } = {}
      if (username !== undefined) updateData.username = username
      if (name !== undefined) updateData.name = name
      if (bio !== undefined) updateData.bio = bio
      if (avatarUrl !== undefined) updateData.avatar = avatarUrl

      const updatedUser = await this.updateUserHandler.execute({
        id: userId,
        input: updateData,
        currentUserId: userId,
        currentUserRole: request.user!.role,
      })

      return reply.send({
        success: true,
        data: updatedUser,
        message: 'Perfil actualizado exitosamente',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async isFollowing(request: FastifyRequest, reply: FastifyReply) {
    const { id: followedId } = request.params as { id: string }
    const followerId = request.user?.id

    if (!followerId) return reply.send({ success: true, data: false })

    try {
      const result = await this.isFollowingHandler.execute({
        followerId,
        followedId,
      })
      return reply.send({ success: true, data: result })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getUserLevel(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params

    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { totalXP: true, currentLevel: true },
      })

      if (!user) {
        return reply.status(404).send({
          success: false,
          error: 'Usuario no encontrado',
        })
      }

      const totalXP = user.totalXP || 0
      const level = this.gamificationService.calculateLevel(totalXP)
      const nextLevelXP =
        this.gamificationService.getLevelThreshold(level + 1) || totalXP
      const minXP = this.gamificationService.getLevelThreshold(level)

      const titles = [
        'Novato',
        'Explorador',
        'Contribuidor',
        'Veterano',
        'Maestro',
        'Leyenda',
      ]
      const icons = ['🌱', '🔍', '📣', '⭐', '🏆', '👑']

      const progress =
        nextLevelXP > minXP
          ? ((totalXP - minXP) / (nextLevelXP - minXP)) * 100
          : 100

      return reply.send({
        success: true,
        data: {
          level,
          title: titles[level - 1] || 'Usuario',
          icon: icons[level - 1] || '👤',
          currentXP: totalXP,
          nextLevelXP,
          minXP,
          progress,
        },
      })
    } catch (error) {
      this.logger.error('Error getting user level:', error as Error)
      return reply.status(500).send({
        success: false,
        error: 'Error interno del servidor',
      })
    }
  }

  private handleError(error: unknown, reply: FastifyReply) {
    if (error instanceof UserError) {
      this.logger.error('User Error:', error as Error)
      return reply.status(error.statusCode).send({
        success: false,
        error: error.message,
        code: error.code,
      })
    }

    this.logger.error('Unexpected User Error:', error as Error)
    return reply.status(500).send({
      success: false,
      error: 'An internal server error occurred',
    })
  }
}
