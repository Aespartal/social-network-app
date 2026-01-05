import { FastifyInstance } from 'fastify'
import {
  createPost,
  getFeed,
  getPost,
  toggleLike,
  toggleBookmark,
  getUserPosts,
} from '../controllers/postController'
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware'
import {
  CreatePostSchema,
  PostParamsSchema,
  PostsFeedQuerySchema,
  PostsResponseSchema,
  PostResponseSchema,
  LikeBookmarkResponseSchema,
} from '../schemas/post.schemas'
import { ErrorSchema } from '../schemas/index'

export async function postRoutes(fastify: FastifyInstance) {
  // --- RUTAS PÚBLICAS O CON AUTH OPCIONAL ---
  fastify.register(async function (publicContext) {
    publicContext.addHook('preHandler', optionalAuth)

    publicContext.get(
      '/posts/:id',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener post por ID',
          params: PostParamsSchema,
          response: {
            200: PostResponseSchema,
            404: ErrorSchema,
            500: ErrorSchema,
          },
        },
      },
      getPost
    )

    publicContext.get(
      '/posts/feed',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener feed de posts',
          querystring: PostsFeedQuerySchema,
          response: {
            200: PostsResponseSchema,
            500: ErrorSchema,
          },
        },
      },
      getFeed
    )

    publicContext.get(
      '/posts/user/:username',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener posts de un usuario por username',
          params: {
            type: 'object',
            required: ['username'],
            properties: {
              username: { type: 'string' },
            },
          },
          response: {
            200: PostsResponseSchema,
            404: ErrorSchema,
            500: ErrorSchema,
          },
        },
      },
      getUserPosts
    )
  })

  // --- RUTAS PRIVADAS (Requieren Token) ---
  fastify.register(async function (privateContext) {
    privateContext.addHook('preHandler', authenticateToken)

    privateContext.post(
      '/posts',
      {
        schema: {
          tags: ['posts'],
          summary: 'Crear nuevo post',
          security: [{ bearerAuth: [] }],
          // body: CreatePostSchema,
          response: {
            201: PostResponseSchema,
            400: ErrorSchema,
            401: ErrorSchema,
            500: ErrorSchema,
          },
        },
      },
      createPost
    )

    privateContext.post(
      '/posts/:id/like',
      {
        schema: {
          tags: ['social'],
          summary: 'Dar/quitar like',
          security: [{ bearerAuth: [] }],
          params: PostParamsSchema,
          response: {
            200: LikeBookmarkResponseSchema,
            401: ErrorSchema,
            404: ErrorSchema,
            500: ErrorSchema,
          },
        },
      },
      toggleLike
    )

    privateContext.post(
      '/posts/:id/bookmark',
      {
        schema: {
          tags: ['social'],
          summary: 'Guardar/quitar bookmark',
          security: [{ bearerAuth: [] }],
          params: PostParamsSchema,
          response: {
            200: LikeBookmarkResponseSchema,
            401: ErrorSchema,
            404: ErrorSchema,
            500: ErrorSchema,
          },
        },
      },
      toggleBookmark
    )
  })
}
