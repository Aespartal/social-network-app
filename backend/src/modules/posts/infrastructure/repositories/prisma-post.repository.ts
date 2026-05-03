import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { PostRepository } from '../../domain/repositories/post.repository.interface'
import type { PrismaClient } from '@/generated/prisma'
import { Post } from '../../domain/entities/post.entity'
import { PostMapper } from '../mappers/post.mapper'
import {
  COMMAND_POST_INCLUDE,
  ACTIVE_POST_WHERE,
  TRANSACTION_OPTIONS,
} from '../helpers/prisma-query.helpers'

/**
 * PrismaPostRepository - Infrastructure Implementation (CQRS - Command Side)
 *
 * Implements PostRepository for write operations using Prisma ORM.
 * Follows Clean Architecture: Infrastructure depends on Domain, not vice versa.
 *
 * Responsibilities:
 * - Persist, update, and delete Post aggregates
 * - Handle user interactions (likes, bookmarks) as commands
 * - Map between Prisma models and Domain entities
 * - Handle database transactions
 */
@injectable()
export class PrismaPostRepository implements PostRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  /**
   * Saves a new Post to the database
   * Uses transaction to ensure atomicity
   */
  async save(post: Post): Promise<Post> {
    console.log('[PrismaPostRepository] Starting save transaction...')
    try {
      return await this.prisma.$transaction(async tx => {
        const tagObjects =
          post.tags.length > 0
            ? await Promise.all(
                post.tags.map(name =>
                  tx.tag.upsert({
                    where: { name: name.toLowerCase().trim() },
                    update: {},
                    create: { name: name.toLowerCase().trim() },
                  })
                )
              )
            : []

        console.log(
          `[PrismaPostRepository] Tags processed: ${tagObjects.length}`
        )

        const prismaPost = await tx.post.create({
          data: {
            content: post.content,
            image: post.image,
            authorId: post.authorId,
            parentId: post.parentId,
            tags:
              tagObjects.length > 0
                ? { create: tagObjects.map(t => ({ tagId: t.id })) }
                : undefined,
            mentions:
              post.mentions.length > 0
                ? { create: post.mentions.map(userId => ({ userId })) }
                : undefined,
            country: post.country,
            city: post.city,
            readingTime: post.readingTime,
          },
          include: COMMAND_POST_INCLUDE,
        })

        console.log(
          `[PrismaPostRepository] Post created in DB: ${prismaPost.id}`
        )

        if (post.parentId) {
          console.log(
            `[PrismaPostRepository] Incrementing repliesCount for parent ${post.parentId}`
          )
          await tx.post.update({
            where: { id: post.parentId },
            data: { repliesCount: { increment: 1 } },
          })
        }

        return PostMapper.toDomain(prismaPost)
      }, TRANSACTION_OPTIONS.DEFAULT)
    } catch (error) {
      console.error('[PrismaPostRepository] Error in save transaction:', error)
      throw error
    }
  }

  /**
   * Finds a Post by ID
   */
  async findById(id: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: COMMAND_POST_INCLUDE,
    })

    if (!post) return null

    return PostMapper.toDomain(post)
  }

  /**
   * Updates an existing Post
   */
  async update(post: Post): Promise<Post> {
    const prismaPost = await this.prisma.post.update({
      where: { id: post.id },
      data: {
        content: post.content,
        image: post.image,
        updatedAt: post.updatedAt,
        deletedAt: post.deletedAt,
      },
      include: COMMAND_POST_INCLUDE,
    })

    return PostMapper.toDomain(prismaPost)
  }

  /**
   * Deletes a Post (soft delete)
   * Uses transaction to ensure atomicity
   */
  async delete(post: Post): Promise<void> {
    await this.prisma.$transaction(async tx => {
      await tx.post.update({
        where: { id: post.id },
        data: { deletedAt: new Date() },
      })

      if (post.parentId) {
        await tx.post.update({
          where: { id: post.parentId },
          data: { repliesCount: { decrement: 1 } },
        })
      }
    }, TRANSACTION_OPTIONS.SHORT)
  }

  /**
   * Checks if a Post exists
   */
  async exists(id: string): Promise<boolean> {
    const post = await this.prisma.post.findUnique({
      where: { id, ...ACTIVE_POST_WHERE },
      select: { id: true },
    })
    return post !== null
  }

  /**
   * Toggles a like on a post (Command)
   * Uses transaction to ensure atomicity
   */
  async toggleLike(
    postId: string,
    userId: string
  ): Promise<{ isLiked: boolean; likesCount: number }> {
    const existingLike = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    })

    if (existingLike) {
      await this.prisma.$transaction([
        this.prisma.like.delete({ where: { id: existingLike.id } }),
        this.prisma.post.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        }),
      ])
    } else {
      await this.prisma.$transaction([
        this.prisma.like.create({ data: { userId, postId } }),
        this.prisma.post.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        }),
      ])
    }

    const count = await this.prisma.like.count({ where: { postId } })

    return { isLiked: !existingLike, likesCount: count }
  }

  /**
   * Toggles a bookmark on a post
   * Uses transaction to ensure atomicity
   */
  async toggleBookmark(
    postId: string,
    userId: string
  ): Promise<{ isBookmarked: boolean }> {
    const existingBookmark = await this.prisma.bookmark.findUnique({
      where: { userId_postId: { userId, postId } },
    })

    if (existingBookmark) {
      await this.prisma.$transaction([
        this.prisma.bookmark.delete({ where: { id: existingBookmark.id } }),
        this.prisma.post.update({
          where: { id: postId },
          data: { bookmarksCount: { decrement: 1 } },
        }),
      ])
      return { isBookmarked: false }
    } else {
      await this.prisma.$transaction([
        this.prisma.bookmark.create({ data: { userId, postId } }),
        this.prisma.post.update({
          where: { id: postId },
          data: { bookmarksCount: { increment: 1 } },
        }),
      ])
      return { isBookmarked: true }
    }
  }
}
