import { FastifyRequest, FastifyReply } from 'fastify'
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
} from '../../application'
import { isPostError, POST_ERROR_HTTP_MAPPING } from '../../domain/errors'
import { parseCreatePostMultipart } from '@/utils/multipart-helper'

export class PostController {
  constructor(
    private readonly getFeedHandler: GetFeedHandler,
    private readonly getPostHandler: GetPostByIdHandler,
    private readonly getPostRepliesHandler: GetPostRepliesHandler,
    private readonly getTrendingPostsHandler: GetTrendingPostsHandler,
    private readonly getBookmarkedPostsHandler: GetBookmarkedPostsHandler,
    private readonly getLikedPostsHandler: GetLikedPostsHandler,
    private readonly getPostsByTagHandler: GetPostsByTagHandler,
    private readonly getPostsWithMediaHandler: GetPostsWithMediaHandler,
    private readonly getPostsByUserHandler: GetUserPostsHandler,
    private readonly createPostHandler: CreatePostCommandHandler,
    private readonly deletePostHandler: DeletePostCommandHandler,
    private readonly updatePostHandler: UpdatePostCommandHandler,
    private readonly toggleLikeHandler: ToggleLikeCommandHandler,
    private readonly toggleBookmarkHandler: ToggleBookmarkCommandHandler
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
      const { content, parentId, tagsRaw, imageUrl } =
        await parseCreatePostMultipart(request.parts())

      const post = await this.createPostHandler.execute({
        content,
        image: imageUrl,
        authorId: userId,
        parentId,
        tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [],
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

  async getFeed(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id || 'anonymous'
      const query = request.query as any

      const followingUserIds: string[] = []

      const result = await this.getFeedHandler.execute({
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

  async getPost(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const userId = request.user?.id

      const post = await this.getPostHandler.execute({ postId: id, userId })

      return reply.send({
        success: true,
        data: { post },
        message: 'Post obtenido exitosamente',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async deletePost(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
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

  async updatePost(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'No autenticado',
        })
      }

      const { content, image } = request.body as any

      await this.updatePostHandler.execute({
        postId: id,
        content,
        image,
        userId,
        userRole: request.user?.role || '',
      })

      return reply.send({
        success: true,
        message: 'Post actualizado con éxito',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getPostReplies(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const userId = request.user?.id
      const query = request.query as any

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

  async getTrendingPosts(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id
      const query = request.query as any

      const result = await this.getTrendingPostsHandler.execute({
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

  async getBookmarkedPosts(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'No autenticado',
        })
      }

      const query = request.query as any

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

  async getLikedPosts(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'No autenticado',
        })
      }

      const query = request.query as any

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

  async getPostsByTag(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { tagName } = request.params as { tagName: string }
      const userId = request.user?.id
      const query = request.query as any

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

  async getPostsWithMedia(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id
      const query = request.query as any

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

  async toggleLike(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
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

  async toggleBookmark(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
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

  async getPostsByUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { username } = request.params as { username: string }
      const query = request.query as any
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
    return reply.status(500).send({
      success: false,
      error: 'Error interno del servidor',
    })
  }
}
