import { FastifyInstance } from 'fastify'
import {
  createPost,
  getFeed,
  getPost,
  toggleLike,
  toggleBookmark,
} from '../controllers/postController'
import { authenticateToken, optionalAuth } from '../middleware/auth'
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
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', optionalAuth)

    fastify.get(
      '/posts/:id',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener post por ID',
          description:
            'Retorna un post específico por su ID. Si el usuario está autenticado, incluye información de interacciones.',
          params: PostParamsSchema,
          response: {
            200: PostResponseSchema,
            404: ErrorSchema,
            500: ErrorSchema,
          },
        },
      },
      getPost as any
    )
  })

  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticateToken)

    fastify.post(
      '/posts',
      {
        schema: {
          tags: ['posts'],
          summary: 'Crear nuevo post',
          description:
            'Crea un nuevo post con contenido y opcionalmente una imagen',
          security: [{ bearerAuth: [] }],
          body: CreatePostSchema,
          response: {
            201: PostResponseSchema,
            400: ErrorSchema,
            401: ErrorSchema,
            500: ErrorSchema,
          },
        },
      },
      createPost as any
    )

    fastify.get(
      '/feed',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener feed de posts',
          description:
            'Retorna una lista paginada de posts. Puede filtrar por autor o solo seguidos.',
          security: [{ bearerAuth: [] }],
          querystring: PostsFeedQuerySchema,
          response: {
            200: PostsResponseSchema,
            401: ErrorSchema,
            500: ErrorSchema,
          },
        },
      },
      getFeed as any
    )

    fastify.post(
      '/posts/:id/like',
      {
        schema: {
          tags: ['social'],
          summary: 'Dar/quitar like a un post',
          description:
            'Alterna el estado de like del usuario en un post específico',
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
      toggleLike as any
    )

    fastify.post(
      '/posts/:id/bookmark',
      {
        schema: {
          tags: ['social'],
          summary: 'Guardar/quitar bookmark de un post',
          description:
            'Alterna el estado de bookmark del usuario en un post específico',
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
      toggleBookmark as any
    )
  })
}
