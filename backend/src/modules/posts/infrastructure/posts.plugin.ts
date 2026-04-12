import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { Type } from '@sinclair/typebox'
import { container } from '@/lib/di-container'
import { TYPES } from '@/lib/di-types'
import { PostController } from './controllers'
import {
  PostParamsSchema,
  GetFeedQuerySchema,
  PaginationQuerySchema,
  TagNameParamsSchema,
  UpdatePostBodySchema,
  ToggleLikeResponseSchema,
  ToggleBookmarkResponseSchema,
  SuccessResponseSchema,
  PostDetailResponseSchema,
  ErrorResponseSchema,
} from './schemas'
import { authenticateToken, optionalAuth } from '@/middleware/auth.middleware'

/**
 * Rate limiting configuration
 * Prevents abuse and ensures system stability
 * Disabled in test environment
 */
const RATE_LIMITS = {
  // General API rate limit
  global: {
    max: process.env.NODE_ENV === 'test' ? 10000 : 100,
    timeWindow: '15 minutes',
  },
  // Strict limit for post creation
  createPost: {
    max: process.env.NODE_ENV === 'test' ? 10000 : 10,
    timeWindow: '5 minutes',
  },
  // Moderate limit for interactions
  interactions: {
    max: process.env.NODE_ENV === 'test' ? 10000 : 50,
    timeWindow: '1 minute',
  },
}

export default fp(async function postsPlugin(fastify: FastifyInstance) {
  // Resolve PostController from the DI container (InversifyJS)
  // This automatically resolves the repository and all 15 handlers
  const postController = container.get<PostController>(TYPES.PostController)

  fastify.register(async function (publicRoutes) {
    publicRoutes.addHook('preHandler', optionalAuth)

    publicRoutes.get(
      '/posts/feed',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener feed de posts',
          querystring: GetFeedQuerySchema,
          response: {
            200: SuccessResponseSchema,
            400: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      postController.getFeed.bind(postController)
    )

    publicRoutes.get(
      '/posts/following',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener feed de usuarios seguidos',
          security: [{ bearerAuth: [] }],
          querystring: GetFeedQuerySchema,
          response: {
            200: SuccessResponseSchema,
            401: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      postController.getFollowingFeed.bind(postController)
    )

    publicRoutes.get(
      '/posts/:id',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener post por ID',
          params: PostParamsSchema,
          response: {
            200: Type.Object({
              success: Type.Literal(true),
              data: PostDetailResponseSchema,
              message: Type.Optional(Type.String()),
            }),
            404: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      postController.getPost.bind(postController)
    )

    publicRoutes.get(
      '/posts/:id/replies',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener respuestas de un post',
          params: PostParamsSchema,
          querystring: PaginationQuerySchema,
          response: {
            200: SuccessResponseSchema,
            404: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      postController.getPostReplies.bind(postController)
    )

    publicRoutes.get(
      '/posts/trending',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener posts trending',
          querystring: PaginationQuerySchema,
          response: {
            200: SuccessResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      postController.getTrendingPosts.bind(postController)
    )

    publicRoutes.get(
      '/posts/tag/:tagName',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener posts por etiqueta',
          params: TagNameParamsSchema,
          querystring: PaginationQuerySchema,
          response: {
            200: SuccessResponseSchema,
            404: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      postController.getPostsByTag.bind(postController)
    )

    publicRoutes.get(
      '/posts/media',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener posts con imagen',
          querystring: PaginationQuerySchema,
          response: {
            200: SuccessResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      postController.getPostsWithMedia.bind(postController)
    )

    publicRoutes.get(
      '/posts/user/:username',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener posts de un usuario',
          params: {
            type: 'object',
            properties: {
              username: { type: 'string' },
            },
            required: ['username'],
          },
          querystring: PaginationQuerySchema,
          response: {
            200: SuccessResponseSchema,
            404: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      postController.getPostsByUser.bind(postController)
    )

    publicRoutes.get(
      '/posts/search',
      {
        schema: {
          tags: ['posts'],
          summary: 'Buscar posts por texto o hashtag',
          querystring: {
            type: 'object',
            properties: {
              q: { type: 'string' },
              cursor: { type: 'string' },
              limit: { type: 'number' },
            },
            required: ['q'],
          },
          response: {
            200: SuccessResponseSchema,
            400: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      postController.searchPosts.bind(postController)
    )
  })

  fastify.register(async function (privateRoutes) {
    privateRoutes.addHook('preHandler', authenticateToken)

    privateRoutes.post(
      '/posts',
      {
        schema: {
          tags: ['posts'],
          summary: 'Crear nuevo post (multipart/form-data)',
          security: [{ bearerAuth: [] }],
          consumes: ['multipart/form-data'],
          // body: CreatePostBodySchema,
          response: {
            201: SuccessResponseSchema,
            400: ErrorResponseSchema,
            401: ErrorResponseSchema,
            429: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                error: { type: 'string' },
                message: { type: 'string' },
              },
            },
            500: ErrorResponseSchema,
          },
        },
        config: {
          rateLimit: RATE_LIMITS.createPost,
        },
      },
      postController.createPost.bind(postController)
    )

    privateRoutes.put(
      '/posts/:id',
      {
        schema: {
          tags: ['posts'],
          summary: 'Editar post (solo autor)',
          security: [{ bearerAuth: [] }],
          params: PostParamsSchema,
          body: UpdatePostBodySchema,
          response: {
            200: SuccessResponseSchema,
            400: ErrorResponseSchema,
            401: ErrorResponseSchema,
            403: ErrorResponseSchema,
            404: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      postController.updatePost.bind(postController)
    )

    privateRoutes.post(
      '/posts/:id/like',
      {
        schema: {
          tags: ['posts'],
          summary: 'Dar/quitar like',
          security: [{ bearerAuth: [] }],
          params: PostParamsSchema,
          response: {
            200: ToggleLikeResponseSchema,
            401: ErrorResponseSchema,
            404: ErrorResponseSchema,
            429: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
        config: {
          rateLimit: RATE_LIMITS.interactions,
        },
      },
      postController.toggleLike.bind(postController)
    )

    privateRoutes.post(
      '/posts/:id/bookmark',
      {
        schema: {
          tags: ['posts'],
          summary: 'Guardar/quitar bookmark',
          security: [{ bearerAuth: [] }],
          params: PostParamsSchema,
          response: {
            200: ToggleBookmarkResponseSchema,
            401: ErrorResponseSchema,
            404: ErrorResponseSchema,
            429: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
        config: {
          rateLimit: RATE_LIMITS.interactions,
        },
      },
      postController.toggleBookmark.bind(postController)
    )

    privateRoutes.get(
      '/posts/bookmarked',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener posts guardados (favoritos)',
          security: [{ bearerAuth: [] }],
          querystring: PaginationQuerySchema,
          response: {
            200: SuccessResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      postController.getBookmarkedPosts.bind(postController)
    )

    privateRoutes.get(
      '/posts/liked',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener posts con me gusta',
          security: [{ bearerAuth: [] }],
          querystring: PaginationQuerySchema,
          response: {
            200: SuccessResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      postController.getLikedPosts.bind(postController)
    )

    privateRoutes.delete(
      '/posts/:id',
      {
        schema: {
          tags: ['posts'],
          summary: 'Eliminar post',
          security: [{ bearerAuth: [] }],
          params: PostParamsSchema,
          response: {
            200: SuccessResponseSchema,
            401: ErrorResponseSchema,
            403: ErrorResponseSchema,
            404: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      postController.deletePost.bind(postController)
    )

    // Búsquedas Recientes
    privateRoutes.get(
      '/posts/search/recent',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener búsquedas recientes',
          security: [{ bearerAuth: [] }],
          response: {
            200: SuccessResponseSchema,
            401: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      postController.getRecentSearches.bind(postController)
    )

    privateRoutes.delete(
      '/posts/search/recent/:id',
      {
        schema: {
          tags: ['posts'],
          summary: 'Eliminar una búsqueda reciente',
          security: [{ bearerAuth: [] }],
          params: {
            type: 'object',
            properties: {
              id: { type: 'string' },
            },
            required: ['id'],
          },
          response: {
            200: SuccessResponseSchema,
            401: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      postController.deleteRecentSearch.bind(postController)
    )

    privateRoutes.delete(
      '/posts/search/recent',
      {
        schema: {
          tags: ['posts'],
          summary: 'Limpiar todas las búsquedas recientes',
          security: [{ bearerAuth: [] }],
          response: {
            200: SuccessResponseSchema,
            401: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      postController.clearRecentSearches.bind(postController)
    )
  })
})
