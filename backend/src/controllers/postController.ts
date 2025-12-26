import { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '../generated/prisma'
import {
  CreatePostRequest,
  // UpdatePostRequest, // Comentado porque no se usa aún
  FeedRequest,
  // Post, // Comentado porque no se usa aún
} from 'social-network-app-shared'

const prisma = new PrismaClient()

interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string
    email: string
    username: string
  }
}

export const createPost = async (
  request: FastifyRequest<{ Body: CreatePostRequest }> & AuthenticatedRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        error: 'No autorizado',
      })
    }

    const { content, image, tags } = request.body

    if (!content.trim() && !image) {
      return reply.status(400).send({
        success: false,
        error: 'El post debe tener contenido o una imagen',
      })
    }

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        image,
        authorId: request.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            verified: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
    })

    if (tags && tags.length > 0) {
      const tagOperations = tags.map(async tagName => {
        const tag = await prisma.tag.upsert({
          where: { name: tagName.toLowerCase() },
          update: {},
          create: { name: tagName.toLowerCase() },
        })

        return prisma.postTag.create({
          data: {
            postId: post.id,
            tagId: tag.id,
          },
        })
      })

      await Promise.all(tagOperations)
    }

    const completePost = await prisma.post.findUnique({
      where: { id: post.id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            verified: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
    })

    reply.send({
      success: true,
      data: completePost,
      message: 'Post creado exitosamente',
    })
  } catch (error) {
    console.error('Create post error:', error)
    reply.status(500).send({
      success: false,
      error: 'Error interno del servidor',
    })
  }
}

export const getFeed = async (
  request: FastifyRequest<{ Querystring: FeedRequest }> & AuthenticatedRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        error: 'No autorizado',
      })
    }

    const { cursor, limit = 10, page = 1 } = request.query
    const pageSize = Math.min(Number(limit), 50)

    const totalPosts = await prisma.post.count()

    const posts = await prisma.post.findMany({
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            verified: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        likes: {
          where: {
            userId: request.user.id,
          },
          select: {
            id: true,
          },
        },
        bookmarks: {
          where: {
            userId: request.user.id,
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
    })

    const hasMore = posts.length > pageSize
    const postsToReturn = hasMore ? posts.slice(0, -1) : posts
    const totalPages = Math.ceil(totalPosts / pageSize)

    const formattedPosts = postsToReturn.map(post => ({
      id: post.id,
      content: post.content,
      imageUrl: post.image || undefined, 
      authorId: post.authorId,
      author: post.author ? {
        ...post.author,
        isVerified: post.author.verified,
      } : undefined,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      bookmarksCount: post._count.bookmarks,
      isLiked: request.user ? post.likes.length > 0 : false,
      isBookmarked: request.user ? post.bookmarks.length > 0 : false,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }))

    reply.send({
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          page: Number(page),
          limit: pageSize,
          total: totalPosts,
          totalPages,
          hasNext: hasMore,
          hasPrev: Number(page) > 1,
        },
      },
      message: 'Feed obtenido exitosamente',
    })
  } catch (error) {
    console.error('Get feed error:', error)
    reply.status(500).send({
      success: false,
      error: 'Error interno del servidor',
    })
  }
}

export const getPost = async (
  request: FastifyRequest<{ Params: { id: string } }> & AuthenticatedRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            verified: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
                verified: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        likes: request.user
          ? {
              where: {
                userId: request.user.id,
              },
              select: {
                id: true,
              },
            }
          : false,
        bookmarks: request.user
          ? {
              where: {
                userId: request.user.id,
              },
              select: {
                id: true,
              },
            }
          : false,
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
    })

    if (!post) {
      return reply.status(404).send({
        success: false,
        error: 'Post no encontrado',
      })
    }

    const formattedPost = {
      ...post,
      isLiked: request.user ? post.likes.length > 0 : false,
      isBookmarked: request.user ? post.bookmarks.length > 0 : false,
      likes: [],
      bookmarks: [],
    }

    reply.send({
      success: true,
      data: formattedPost,
      message: 'Post obtenido exitosamente',
    })
  } catch (error) {
    console.error('Get post error:', error)
    reply.status(500).send({
      success: false,
      error: 'Error interno del servidor',
    })
  }
}

export const toggleLike = async (
  request: FastifyRequest<{ Params: { id: string } }> & AuthenticatedRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        error: 'No autorizado',
      })
    }

    const { id: postId } = request.params

    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return reply.status(404).send({
        success: false,
        error: 'Post no encontrado',
      })
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: request.user.id,
          postId,
        },
      },
    })

    let isLiked: boolean

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      })
      isLiked = false
    } else {
      await prisma.like.create({
        data: {
          userId: request.user.id,
          postId,
        },
      })
      isLiked = true
    }

    const likeCount = await prisma.like.count({
      where: { postId },
    })

    reply.send({
      success: true,
      data: {
        isLiked,
        likeCount,
      },
      message: isLiked ? 'Post liked' : 'Post unliked',
    })
  } catch (error) {
    console.error('Toggle like error:', error)
    reply.status(500).send({
      success: false,
      error: 'Error interno del servidor',
    })
  }
}

export const toggleBookmark = async (
  request: FastifyRequest<{ Params: { id: string } }> & AuthenticatedRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        error: 'No autorizado',
      })
    }

    const { id: postId } = request.params

    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return reply.status(404).send({
        success: false,
        error: 'Post no encontrado',
      })
    }

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: request.user.id,
          postId,
        },
      },
    })

    let isBookmarked: boolean

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      })
      isBookmarked = false
    } else {
      await prisma.bookmark.create({
        data: {
          userId: request.user.id,
          postId,
        },
      })
      isBookmarked = true
    }

    reply.send({
      success: true,
      data: {
        isBookmarked,
      },
      message: isBookmarked ? 'Post bookmarked' : 'Bookmark removed',
    })
  } catch (error) {
    console.error('Toggle bookmark error:', error)
    reply.status(500).send({
      success: false,
      error: 'Error interno del servidor',
    })
  }
}
