import { FastifyReply, FastifyRequest } from 'fastify'
import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { FollowUserHandler } from '../../application/commands/follow/follow-user.handler'
import { UnfollowUserHandler } from '../../application/commands/unfollow/unfollow-user.handler'
import { GetFollowersHandler } from '../../application/queries/get-followers/get-followers.handler'
import { GetFollowingHandler } from '../../application/queries/get-following/get-following.handler'
import { IsFollowingHandler } from '../../application/queries/is-following/is-following.handler'
import { UserError } from '../../domain/errors/user.errors'

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.FollowUserHandler)
    private readonly followUserHandler: FollowUserHandler,
    @inject(TYPES.UnfollowUserHandler)
    private readonly unfollowUserHandler: UnfollowUserHandler,
    @inject(TYPES.GetFollowersHandler)
    private readonly getFollowersHandler: GetFollowersHandler,
    @inject(TYPES.GetFollowingHandler)
    private readonly getFollowingHandler: GetFollowingHandler,
    @inject(TYPES.IsFollowingHandler)
    private readonly isFollowingHandler: IsFollowingHandler
  ) {}

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

  private handleError(error: unknown, reply: FastifyReply) {
    if (error instanceof UserError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: error.message,
        code: error.code,
      })
    }

    console.error('Unexpected User Error:', error)
    return reply.status(500).send({
      success: false,
      error: 'An internal server error occurred',
    })
  }
}
