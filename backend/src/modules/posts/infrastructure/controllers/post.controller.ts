import { FastifyRequest, FastifyReply } from 'fastify'
import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import {
  // Command Handlers (Write)
  CreatePostCommandHandler,
  DeletePostCommandHandler,
  UpdatePostCommandHandler,
  ToggleLikeCommandHandler,
  ToggleBookmarkCommandHandler,
  // Query Handlers (Read)
  GetFeedHandler,
  GetFollowingFeedHandler,
  GetUserPostsHandler,
  GetTrendingPostsHandler,
  GetBookmarkedPostsHandler,
  GetLikedPostsHandler,
  GetPostsByTagHandler,
  GetPostsWithMediaHandler,
  GetPostRepliesHandler,
  GetPostDetailHandler,
  SearchPostsQueryHandler,
  GetRecentSearchesHandler,
  DeleteRecentSearchHandler,
  ClearRecentSearchesHandler,
  AddRecentSearchCommandHandler,
} from '../../application'
import {
  PostParams,
  GetFeedQuery,
  PaginationQuery,
  TrendingQuery,
  TagNameParams,
  UsernameParams,
  UpdatePostBody,
  SearchQuery,
} from '../schemas'
import { isPostError, POST_ERROR_HTTP_MAPPING } from '../../domain/errors'
import type { PrismaClient } from '@/generated/prisma'
import { parseCreatePostMultipart } from '@/utils/multipart-helper'
import { getLocationFromIp } from '@/utils/geo-ip'

@injectable()
export class PostController {
  constructor(
    @inject(TYPES.GetFeedHandler)
    private readonly getFeedHandler: GetFeedHandler,
    @inject(TYPES.GetFollowingFeedHandler)
    private readonly getFollowingFeedHandler: GetFollowingFeedHandler,
    @inject(TYPES.GetPostDetailHandler)
    private readonly getPostDetailHandler: GetPostDetailHandler,
    @inject(TYPES.GetPostRepliesHandler)
    private readonly getPostRepliesHandler: GetPostRepliesHandler,
    @inject(TYPES.GetTrendingPostsHandler)
    private readonly getTrendingPostsHandler: GetTrendingPostsHandler,
    @inject(TYPES.GetBookmarkedPostsHandler)
    private readonly getBookmarkedPostsHandler: GetBookmarkedPostsHandler,
    @inject(TYPES.GetLikedPostsHandler)
    private readonly getLikedPostsHandler: GetLikedPostsHandler,
    @inject(TYPES.GetPostsByTagHandler)
    private readonly getPostsByTagHandler: GetPostsByTagHandler,
    @inject(TYPES.GetPostsWithMediaHandler)
    private readonly getPostsWithMediaHandler: GetPostsWithMediaHandler,
    @inject(TYPES.GetUserPostsHandler)
    private readonly getPostsByUserHandler: GetUserPostsHandler,
    @inject(TYPES.CreatePostCommandHandler)
    private readonly createPostHandler: CreatePostCommandHandler,
    @inject(TYPES.DeletePostCommandHandler)
    private readonly deletePostHandler: DeletePostCommandHandler,
    @inject(TYPES.UpdatePostCommandHandler)
    private readonly updatePostHandler: UpdatePostCommandHandler,
    @inject(TYPES.ToggleLikeCommandHandler)
    private readonly toggleLikeHandler: ToggleLikeCommandHandler,
    @inject(TYPES.ToggleBookmarkCommandHandler)
    private readonly toggleBookmarkHandler: ToggleBookmarkCommandHandler,
    @inject(TYPES.SearchPostsHandler)
    private readonly searchPostsHandler: SearchPostsQueryHandler,
    @inject(TYPES.GetRecentSearchesHandler)
    private readonly getRecentSearchesHandler: GetRecentSearchesHandler,
    @inject(TYPES.DeleteRecentSearchHandler)
    private readonly deleteRecentSearchHandler: DeleteRecentSearchHandler,
    @inject(TYPES.ClearRecentSearchesHandler)
    private readonly clearRecentSearchesHandler: ClearRecentSearchesHandler,
    @inject(TYPES.AddRecentSearchCommandHandler)
    private readonly addRecentSearchHandler: AddRecentSearchCommandHandler,
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async createPost(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'No autenticado',
        })
      }

      if (!request.isMultipart()) {
        return reply
          .status(400)
          .send({ success: false, error: 'Se esperaba un FormData' })
      }
      const {
        content,
        parentId,
        tagsRaw,
        imageUrl,
        country: clientCountry,
        city: clientCity,
      } = await parseCreatePostMultipart(request.parts())

      // Detección automática de ubicación si no viene del cliente
      let finalCountry = clientCountry
      let finalCity = clientCity

      if (!finalCountry || !finalCity) {
        const geo = await getLocationFromIp(request.ip)
        finalCountry = finalCountry || (geo.country as string)
        finalCity = finalCity || (geo.city as string)
      }

      const post = await this.createPostHandler.execute({
        content,
        image: imageUrl,
        authorId: userId,
        parentId,
        tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [],
        country: finalCountry,
        city: finalCity,
      })

      return reply.status(201).send({
        success: true,
        data: { post },
        message: parentId ? 'Respuesta publicada' : 'Post publicado con éxito',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getFeed(
    request: FastifyRequest<{ Querystring: GetFeedQuery }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user?.id || 'anonymous'
      const query = request.query

      // Public Feed (all top level posts)
      const result = await this.getFeedHandler.execute({
        followingUserIds: [],
        userId,
        page: {
          cursor: query.cursor,
          limit: query.limit ? Number(query.limit) : 20,
        },
      })

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getFollowingFeed(
    request: FastifyRequest<{ Querystring: PaginationQuery }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user?.id
      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'Autenticación requerida para ver el feed de seguidos',
        })
      }

      const query = request.query

      // Get following IDs directly from Prisma
      const followers = await this.prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      })
      const followingUserIds = followers.map(f => f.followingId)

      const result = await this.getFollowingFeedHandler.execute({
        followingUserIds,
        userId,
        page: {
          cursor: query.cursor,
          limit: query.limit ? Number(query.limit) : 20,
        },
      })

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getPost(
    request: FastifyRequest<{
      Params: PostParams
      Querystring: PaginationQuery
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      const userId = request.user?.id
      const query = request.query

      const result = await this.getPostDetailHandler.execute({
        postId: id,
        userId,
        repliesPage: {
          cursor: query.cursor,
          limit: query.limit ? Number(query.limit) : 20,
        },
      })

      return reply.send({
        success: true,
        data: result,
        message: 'Post obtenido exitosamente',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async deletePost(
    request: FastifyRequest<{ Params: PostParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      const userId = request.user?.id
      const userRole = request.user?.role

      if (!userId || !userRole) {
        return reply.status(401).send({
          success: false,
          error: 'No autenticado',
        })
      }

      await this.deletePostHandler.execute({ postId: id, userId, userRole })

      return reply.send({
        success: true,
        data: {},
        message: 'Post eliminado exitosamente',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async updatePost(
    request: FastifyRequest<{ Params: PostParams; Body: UpdatePostBody }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'No autenticado',
        })
      }

      const { content, image } = request.body

      await this.updatePostHandler.execute({
        postId: id,
        content,
        image,
        userId,
        userRole: request.user?.role || '',
      })

      return reply.send({
        success: true,
        data: {},
        message: 'Post actualizado con éxito',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getPostReplies(
    request: FastifyRequest<{
      Params: PostParams
      Querystring: PaginationQuery
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      const userId = request.user?.id
      const query = request.query

      const result = await this.getPostRepliesHandler.execute({
        postId: id,
        userId,
        page: {
          cursor: query.cursor,
          limit: query.limit ? Number(query.limit) : 20,
        },
      })

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getTrendingPosts(
    request: FastifyRequest<{ Querystring: TrendingQuery }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user?.id
      const query = request.query

      const result = await this.getTrendingPostsHandler.execute({
        userId,
        country: query.country,
        city: query.city,
        page: {
          cursor: query.cursor,
          limit: query.limit ? Number(query.limit) : 20,
        },
      })

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getBookmarkedPosts(
    request: FastifyRequest<{ Querystring: PaginationQuery }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'No autenticado',
        })
      }

      const query = request.query

      const result = await this.getBookmarkedPostsHandler.execute({
        userId,
        page: {
          cursor: query.cursor,
          limit: query.limit ? Number(query.limit) : 20,
        },
      })

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getLikedPosts(
    request: FastifyRequest<{ Querystring: PaginationQuery }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'No autenticado',
        })
      }

      const query = request.query

      const result = await this.getLikedPostsHandler.execute({
        userId,
        page: {
          cursor: query.cursor,
          limit: query.limit ? Number(query.limit) : 20,
        },
      })

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getPostsByTag(
    request: FastifyRequest<{
      Params: TagNameParams
      Querystring: PaginationQuery
    }>,
    reply: FastifyReply
  ) {
    try {
      const { tagName } = request.params
      const userId = request.user?.id
      const query = request.query

      const result = await this.getPostsByTagHandler.execute({
        tagName,
        userId,
        page: {
          cursor: query.cursor,
          limit: query.limit ? Number(query.limit) : 20,
        },
      })

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getPostsWithMedia(
    request: FastifyRequest<{ Querystring: PaginationQuery }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user?.id
      const query = request.query

      const result = await this.getPostsWithMediaHandler.execute({
        userId,
        page: {
          cursor: query.cursor,
          limit: query.limit ? Number(query.limit) : 20,
        },
      })

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async toggleLike(
    request: FastifyRequest<{ Params: PostParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'No autenticado',
        })
      }

      const result = await this.toggleLikeHandler.execute({
        postId: id,
        userId,
      })

      return reply.send({
        success: true,
        data: result,
        message: result.isLiked ? 'Like agregado' : 'Like eliminado',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async toggleBookmark(
    request: FastifyRequest<{ Params: PostParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'No autenticado',
        })
      }

      const result = await this.toggleBookmarkHandler.execute({
        postId: id,
        userId,
      })

      return reply.send({
        success: true,
        data: result,
        message: result.isBookmarked
          ? 'Guardado en favoritos'
          : 'Eliminado de favoritos',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async searchPosts(
    request: FastifyRequest<{ Querystring: SearchQuery }>,
    reply: FastifyReply
  ) {
    try {
      const query = request.query
      const userId = request.user?.id

      if (!query.q || typeof query.q !== 'string') {
        return reply.status(400).send({
          success: false,
          error: 'Se requiere un término de búsqueda (q)',
        })
      }

      const result = await this.searchPostsHandler.execute({
        query: query.q,
        userId,
        cursor: query.cursor,
        limit: query.limit ? Number(query.limit) : 20,
      })

      // Guardar en búsquedas recientes si el usuario está autenticado
      if (userId) {
        this.addRecentSearchHandler
          .execute({
            userId,
            query: query.q,
          })
          .catch(err => console.error('Error saving recent search:', err))
      }

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getRecentSearches(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id
      if (!userId) {
        return reply
          .status(401)
          .send({ success: false, error: 'No autenticado' })
      }

      const result = await this.getRecentSearchesHandler.execute({ userId })

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async deleteRecentSearch(
    request: FastifyRequest<{ Params: PostParams }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user?.id
      if (!userId) {
        return reply
          .status(401)
          .send({ success: false, error: 'No autenticado' })
      }

      const { id } = request.params
      await this.deleteRecentSearchHandler.execute({ id, userId })

      return reply.send({
        success: true,
        data: {},
        message: 'Búsqueda reciente eliminada',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async clearRecentSearches(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id
      if (!userId) {
        return reply
          .status(401)
          .send({ success: false, error: 'No autenticado' })
      }

      await this.clearRecentSearchesHandler.execute({ userId })

      return reply.send({
        success: true,
        data: {},
        message: 'Todas las búsquedas recientes eliminadas',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getPostsByUser(
    request: FastifyRequest<{
      Params: UsernameParams
      Querystring: PaginationQuery
    }>,
    reply: FastifyReply
  ) {
    try {
      const { username } = request.params
      const query = request.query
      const userId = request.user?.id

      const result = await this.getPostsByUserHandler.execute({
        username,
        userId,
        page: {
          cursor: query.cursor,
          limit: query.limit ? Number(query.limit) : 20,
        },
      })

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  private handleError(error: unknown, reply: FastifyReply) {
    if (isPostError(error)) {
      const statusCode = POST_ERROR_HTTP_MAPPING[error.code] || 500
      return reply.status(statusCode).send({
        success: false,
        error: error.message,
        code: error.code,
        statusCode,
      })
    }

    console.error('PostController error:', error)
    if (error instanceof Error) {
      console.error('Error stack:', error.stack)
    }
    return reply.status(500).send({
      success: false,
      error:
        error instanceof Error ? error.message : 'Error interno del servidor',
    })
  }
}
