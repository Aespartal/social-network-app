import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { container } from '@/lib/di-container'
import { TYPES } from '@/lib/di-types'
import { UserController } from './controllers/user.controller'
import { authenticateToken, optionalAuth } from '@/middleware/auth.middleware'

export default fp(async function usersPlugin(fastify: FastifyInstance) {
  const userController = container.get<UserController>(TYPES.UserController)

  fastify.register(async function (publicRoutes) {
    publicRoutes.addHook('preHandler', optionalAuth)

    publicRoutes.get(
      '/users/:id/followers',
      userController.getFollowers.bind(userController)
    )
    publicRoutes.get(
      '/users/:id/following',
      userController.getFollowing.bind(userController)
    )
    publicRoutes.get(
      '/users/:id/is-following',
      userController.isFollowing.bind(userController)
    )
    publicRoutes.get(
      '/users/:id/level',
      userController.getUserLevel.bind(userController)
    )
  })

  fastify.register(async function (privateRoutes) {
    privateRoutes.addHook('preHandler', authenticateToken)

    privateRoutes.post(
      '/users/:id/follow',
      userController.follow.bind(userController)
    )
    privateRoutes.post(
      '/users/:id/unfollow',
      userController.unfollow.bind(userController)
    )
  })
})
