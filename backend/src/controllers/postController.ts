import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '@/lib/prisma'
import type { FeedRequest } from '@/shared/types/social.type'
import type { ApiResponse } from '@/shared/types/api.type'
import { extractPostData } from '@/utils/multipart-helper'

export const createPost = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { content, parentId, tagsRaw, imageUrl } = await extractPostData(
      request.parts()
    )

    if (!content.trim() && !imageUrl) {
      return reply.status(400).send({
        success: false,
        error: 'El post debe tener al menos texto o una imagen',
      })
    }

    const tags = parseTags(tagsRaw)
    const userId = request.user!.id
    const post = await savePostToDb({
      content,
      imageUrl,
      userId,
      parentId,
      tags,
    })

    return reply.status(201).send({
      success: true,
      data: { post: formatPostResponse(post) },
      message: parentId ? 'Respuesta publicada' : 'Post publicado con éxito',
    })
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({
      success: false,
      error: 'Error interno al procesar el post',
    })
  }
}

export const getFeed = async (
  request: FastifyRequest<{ Querystring: FeedRequest }>,
  reply: FastifyReply
) => {
  try {
    const { cursor, limit = 10 } = request.query
    const pageSize = Math.min(Number(limit), 50)
    const userId = request.user?.id

    const posts = await prisma.post.findMany({
      where: { parentId: null },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
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
        parent: {
          include: { author: true },
        },
        tags: { include: { tag: true } },
        _count: { select: { likes: true, replies: true, bookmarks: true } },

        likes: userId ? { where: { userId }, select: { id: true } } : false,
        bookmarks: userId ? { where: { userId }, select: { id: true } } : false,
      },
    })

    const hasMore = posts.length > pageSize
    const results = hasMore ? posts.slice(0, -1) : posts

    const formattedPosts = results.map(p => ({
      ...p,
      isLiked: p.likes ? p.likes.length > 0 : false,
      isBookmarked: p.bookmarks ? p.bookmarks.length > 0 : false,

      likesCount: p._count.likes,
      repliesCount: p._count.replies,
      bookmarksCount: p._count.bookmarks,

      likes: undefined,
      bookmarks: undefined,
      _count: undefined,
    }))

    return reply.send({
      success: true,
      data: { posts: formattedPosts },
      meta: {
        hasNext: hasMore,
        nextCursor:
          hasMore && results.length > 0
            ? results[results.length - 1]!.id
            : null,
      },
    } as ApiResponse)
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({
      success: false,
      error: 'Error al obtener el feed',
    } as ApiResponse)
  }
}

export const getPost = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params
    const userId = request.user?.id

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
        replies: {
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
              select: { likes: true, replies: true, bookmarks: true },
            },
            likes: userId ? { where: { userId }, select: { id: true } } : false,
          },
          orderBy: { createdAt: 'asc' },
        },
        parent: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        likes: userId ? { where: { userId }, select: { id: true } } : false,
        bookmarks: userId ? { where: { userId }, select: { id: true } } : false,
        _count: {
          select: {
            likes: true,
            replies: true,
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
      isLiked: userId ? (post as any).likes?.length > 0 : false,
      isBookmarked: userId ? (post as any).bookmarks?.length > 0 : false,
      likesCount: post._count.likes,
      repliesCount: post._count.replies,
      bookmarksCount: post._count.bookmarks,
      parent: post.parent
        ? {
            id: post.parent.id,
            content: post.parent.content,
            author: post.parent.author,
            createdAt: post.parent.createdAt,
          }
        : null,
      replies: post.replies.map((r: any) => ({
        ...r,
        likesCount: r._count.likes,
        repliesCount: r._count.replies,
        bookmarksCount: r._count.bookmarks,
        isLiked: userId ? r.likes?.length > 0 : false,
        _count: undefined,
        likes: undefined,
      })),

      likes: undefined,
      bookmarks: undefined,
      _count: undefined,
    }

    reply.send({
      success: true,
      data: {
        post: formattedPost,
      },
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
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const postId = request.params.id
    const userId = request.user!.id

    const existingLike = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    })

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } })
    } else {
      await prisma.like.create({ data: { userId, postId } })
    }

    const count = await prisma.like.count({ where: { postId } })

    return reply.send({
      success: true,
      data: { isLiked: !existingLike, likesCount: count },
    } as ApiResponse)
  } catch (error) {
    console.error('Toggle like error:', error)
    reply.status(500).send({
      success: false,
      error: 'Error interno del servidor',
    })
  }
}

export const toggleBookmark = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const userId = request.user!.id
    const { id: postId } = request.params

    const postExists = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    })

    if (!postExists) {
      return reply.status(404).send({
        success: false,
        error: 'El post que intentas guardar no existe',
      } as ApiResponse)
    }

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
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
          userId,
          postId,
        },
      })
      isBookmarked = true
    }

    const response: ApiResponse = {
      success: true,
      data: { isBookmarked },
      message: isBookmarked
        ? 'Guardado en favoritos'
        : 'Eliminado de favoritos',
    }

    return reply.send(response)
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({
      success: false,
      error: 'Error interno al procesar el marcador',
    } as ApiResponse)
  }
}

export const getUserPosts = async (
  request: FastifyRequest<{
    Params: { username: string }
    Querystring: { page?: number; limit?: number }
  }>,
  reply: FastifyReply
) => {
  try {
    const { username } = request.params
    const page = Number(request.query.page) || 1
    const limit = Number(request.query.limit) || 10
    const skip = (page - 1) * limit

    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    })

    if (!user) {
      return reply.status(404).send({
        success: false,
        error: 'Usuario no encontrado',
      } as ApiResponse)
    }

    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
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
            replies: true,
            bookmarks: true,
          },
        },
      },
    })

    const formattedPosts = posts.map(post => ({
      ...post,
      likesCount: post._count.likes,
      repliesCount: post._count.replies,
      bookmarksCount: post._count.bookmarks,
    }))

    return reply.send({
      success: true,
      data: { posts: formattedPosts },
    } as ApiResponse)
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({
      success: false,
      error: 'Error al obtener los posts del usuario',
    } as ApiResponse)
  }
}

function parseTags(tagsRaw: string): string[] {
  if (!tagsRaw) return []
  try {
    const parsed = JSON.parse(tagsRaw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return tagsRaw
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
  }
}

async function savePostToDb(data: {
  content: string
  imageUrl?: string
  userId: string
  parentId: string | null
  tags: string[]
}) {
  return await prisma.$transaction(async tx => {
    const tagObjects = await Promise.all(
      data.tags.map(name =>
        tx.tag.upsert({
          where: { name: name.toLowerCase().trim() },
          update: {},
          create: { name: name.toLowerCase().trim() },
        })
      )
    )

    return await tx.post.create({
      data: {
        content: data.content.trim(),
        image: data.imageUrl,
        authorId: data.userId,
        parentId: data.parentId,
        tags:
          tagObjects.length > 0
            ? { create: tagObjects.map(t => ({ tagId: t.id })) }
            : undefined,
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
        parent: {
          include: { author: { select: { username: true, name: true } } },
        },
        tags: { include: { tag: true } },
        _count: { select: { likes: true, replies: true, bookmarks: true } },
      },
    })
  })
}

function formatPostResponse(post: any) {
  const { _count, ...rest } = post
  return {
    ...rest,
    likesCount: _count.likes,
    repliesCount: _count.replies,
    bookmarksCount: _count.bookmarks,
  }
}
