import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { PrismaPostRepository } from './repositories'
import { PrismaPostQueryProvider } from './services/prisma-post-query.service'
import {
  // Command Handlers (Write)
  CreatePostCommandHandler,
  DeletePostCommandHandler,
  UpdatePostCommandHandler,
  ToggleLikeCommandHandler,
  ToggleBookmarkCommandHandler,
  // Query Handlers (Read)
  GetFeedHandler,
  GetUserPostsHandler,
  GetTrendingPostsHandler,
  GetPostByIdHandler,
  GetBookmarkedPostsHandler,
  GetLikedPostsHandler,
  GetPostsByTagHandler,
  GetPostsWithMediaHandler,
  GetPostRepliesHandler,
} from '../application'
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
  ErrorResponseSchema,
} from './schemas'
import { prisma } from '@/lib/prisma'
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
  const postRepository = new PrismaPostRepository(prisma)
  const postQueryProvider = new PrismaPostQueryProvider(prisma)

  // Command Handlers - Write Operations
  const createPostHandler = new CreatePostCommandHandler(postRepository)
  const updatePostHandler = new UpdatePostCommandHandler(postRepository)
  const deletePostHandler = new DeletePostCommandHandler(postRepository)
  const toggleLikeHandler = new ToggleLikeCommandHandler(postRepository)
  const toggleBookmarkHandler = new ToggleBookmarkCommandHandler(postRepository)

  // Query Handlers - Read Operations
  const getFeedHandler = new GetFeedHandler(postQueryProvider)
  const getPostHandler = new GetPostByIdHandler(postQueryProvider)
  const getPostRepliesHandler = new GetPostRepliesHandler(postQueryProvider)
  const getTrendingPostsHandler = new GetTrendingPostsHandler(postQueryProvider)
  const getBookmarkedPostsHandler = new GetBookmarkedPostsHandler(
    postQueryProvider
  )
  const getLikedPostsHandler = new GetLikedPostsHandler(postQueryProvider)
  const getPostsByTagHandler = new GetPostsByTagHandler(postQueryProvider)
  const getPostsWithMediaHandler = new GetPostsWithMediaHandler(
    postQueryProvider
  )
  const getPostsByUserHandler = new GetUserPostsHandler(postQueryProvider)

  const postController = new PostController(
    getFeedHandler,
    getPostHandler,
    getPostRepliesHandler,
    getTrendingPostsHandler,
    getBookmarkedPostsHandler,
    getLikedPostsHandler,
    getPostsByTagHandler,
    getPostsWithMediaHandler,
    getPostsByUserHandler,
    createPostHandler,
    deletePostHandler,
    updatePostHandler,
    toggleLikeHandler,
    toggleBookmarkHandler
  )

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
      '/posts/:id',
      {
        schema: {
          tags: ['posts'],
          summary: 'Obtener post por ID',
          params: PostParamsSchema,
          response: {
            200: SuccessResponseSchema,
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
  })
})
