import { FastifyInstance } from 'fastify'
import {
  createPost,
  getFeed,
  getPost,
  toggleLike,
  toggleBookmark,
} from '../controllers/postController'
import { authenticateToken, optionalAuth } from '../middleware/auth'

export async function postRoutes(fastify: FastifyInstance) {
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', optionalAuth)

    fastify.get('/posts/:id', getPost as any)
  })

  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticateToken)

    fastify.post('/posts', createPost as any)
    fastify.get('/feed', getFeed as any)
    fastify.post('/posts/:id/like', toggleLike as any)
    fastify.post('/posts/:id/bookmark', toggleBookmark as any)
  })
}
