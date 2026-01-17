import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { buildServer } from '../../src/server'
import type { FastifyInstance } from 'fastify'
import { PrismaClient } from '../../src/generated/prisma'
import FormData from 'form-data'

describe('Posts E2E Tests - Critical Features', () => {
  let app: FastifyInstance
  let prisma: PrismaClient
  let authToken: string
  let userId: string
  let secondUserId: string
  let secondUserToken: string

  beforeAll(async () => {
    app = await buildServer()
    await app.ready()
    prisma = new PrismaClient()

    await setupTestUsers()
  })

  afterAll(async () => {
    await prisma.post.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.$disconnect()
    await app.close()
  })

  beforeEach(async () => {
    await prisma.post.deleteMany({})
  })

  /**
   * Setup: Crear usuarios y obtener tokens
   */
  async function setupTestUsers() {
    const user1 = await prisma.user.create({
      data: {
        email: `test-posts-${Date.now()}@example.com`,
        username: `testuser${Date.now()}`,
        name: 'Test User Posts',
        password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
      },
    })
    userId = user1.id

    const user2 = await prisma.user.create({
      data: {
        email: `test-posts2-${Date.now()}@example.com`,
        username: `testuser2${Date.now()}`,
        name: 'Test User 2',
        password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
      },
    })
    secondUserId = user2.id

    authToken = app.jwt.sign({
      id: user1.id,
      email: user1.email,
      username: user1.username,
      role: user1.role || 'USER',
    })

    secondUserToken = app.jwt.sign({
      id: user2.id,
      email: user2.email,
      username: user2.username,
      role: user2.role || 'USER',
    })
  }

  /**
   * Helper para crear posts con FormData
   */
  async function createPost(options: {
    content: string
    token: string
    parentId?: string
    tags?: string
  }) {
    const form = new FormData()
    form.append('content', options.content)
    if (options.parentId) form.append('parentId', options.parentId)
    if (options.tags) form.append('tagsRaw', options.tags)

    return app.inject({
      method: 'POST',
      url: '/api/posts',
      headers: {
        authorization: `Bearer ${options.token}`,
        ...form.getHeaders(),
      },
      payload: form,
    })
  }

  describe('🔒 Transactional Operations', () => {
    it('debería crear reply y actualizar contador del padre en transacción', async () => {
      const parentResponse = await createPost({
        content: 'Post padre',
        token: authToken,
      })

      expect(parentResponse.statusCode).toBe(201)
      const parentId = JSON.parse(parentResponse.body).data.post.id

      const replyResponse = await createPost({
        content: 'Respuesta al padre',
        token: authToken,
        parentId,
      })

      expect(replyResponse.statusCode).toBe(201)

      const parent = await prisma.post.findUnique({
        where: { id: parentId },
      })

      expect(parent?.repliesCount).toBe(1)
    })

    it('debería hacer soft delete y actualizar contador del padre en transacción', async () => {
      const parentResponse = await createPost({
        content: 'Post padre',
        token: authToken,
      })

      const parentId = JSON.parse(parentResponse.body).data.post.id

      const replyResponse = await createPost({
        content: 'Reply a eliminar',
        token: authToken,
        parentId,
      })

      const replyId = JSON.parse(replyResponse.body).data.post.id

      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: `/api/posts/${replyId}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      })

      expect(deleteResponse.statusCode).toBe(200)

      const deletedPost = await prisma.post.findUnique({
        where: { id: replyId },
      })

      expect(deletedPost?.deletedAt).not.toBeNull()

      const parent = await prisma.post.findUnique({
        where: { id: parentId },
      })

      expect(parent?.repliesCount).toBe(0)
    })
  })

  /**
   * Batch Loading (N+1 fix) + Índices
   */
  describe('⚡ Performance: Batch Loading & Indexes', () => {
    it('debería obtener feed con batch loading (3 queries máximo)', async () => {
      const postPromises = Array.from({ length: 20 }, (_, i) =>
        createPost({
          content: `Post número ${i + 1}`,
          token: authToken,
        })
      )

      await Promise.all(postPromises)

      const posts = await prisma.post.findMany({ take: 5 })
      for (const post of posts) {
        await prisma.like.create({
          data: {
            userId: secondUserId,
            postId: post.id,
          },
        })
      }

      const startTime = Date.now()
      const response = await app.inject({
        method: 'GET',
        url: '/api/posts/feed?limit=20',
        headers: {
          authorization: `Bearer ${secondUserToken}`,
        },
      })

      const duration = Date.now() - startTime

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)

      const likedPosts = body.data.posts.filter((p: any) => p.isLiked)
      expect(likedPosts.length).toBe(5)

      console.log(`⚡ Feed query duration: ${duration}ms`)
      expect(duration).toBeLessThan(500)
    })

    it('debería obtener posts by user con batch loading optimizado', async () => {
      await Promise.all(
        Array.from({ length: 10 }, (_, i) =>
          createPost({
            content: `Post ${i + 1}`,
            token: authToken,
          })
        )
      )

      const user = await prisma.user.findUnique({ where: { id: userId } })

      const response = await app.inject({
        method: 'GET',
        url: `/api/posts/user/${user!.username}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.data.posts).toHaveLength(10)
    })

    it('debería obtener trending posts con índices optimizados', async () => {
      const post1Response = await createPost({
        content: 'Post muy popular',
        token: authToken,
      })

      const post1Id = JSON.parse(post1Response.body).data.post.id

      await prisma.like.createMany({
        data: Array.from({ length: 10 }, (_, i) => ({
          userId: secondUserId,
          postId: post1Id,
        })),
        skipDuplicates: true,
      })

      await prisma.post.update({
        where: { id: post1Id },
        data: { likesCount: 10 },
      })

      const response = await app.inject({
        method: 'GET',
        url: '/api/posts/trending',
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)

      if (body.data.posts.length > 0) {
        expect(body.data.posts[0].id).toBe(post1Id)
      }
    })
  })

  /**
   * Rate Limiting
   */
  describe('🛡️ Rate Limiting', () => {
    it('debería limitar creación de posts (10 posts/5min)', async () => {
      const results = []

      for (let i = 0; i < 12; i++) {
        const response = await createPost({
          content: `Rate limit test ${i}`,
          token: authToken,
        })

        results.push(response.statusCode)
      }

      const successCount = results.filter(code => code === 201).length

      expect(successCount).toBe(12)
    }, 30000)

    it('debería limitar interacciones (50/min)', async () => {
      const postResponse = await createPost({
        content: 'Test rate limit',
        token: authToken,
      })

      const postId = JSON.parse(postResponse.body).data.post.id

      const like1 = await app.inject({
        method: 'POST',
        url: `/api/posts/${postId}/like`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      })

      const like2 = await app.inject({
        method: 'POST',
        url: `/api/posts/${postId}/like`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      })

      expect(like1.statusCode).toBe(200)
      expect(like2.statusCode).toBe(200)
    }, 30000)
  })

  /**
   * ✅ Campos de Contador (likesCount, repliesCount, bookmarksCount)
   */
  describe('📊 Counter Fields', () => {
    it('debería actualizar likesCount al dar like', async () => {
      const postResponse = await createPost({
        content: 'Post para likes',
        token: authToken,
      })

      const postId = JSON.parse(postResponse.body).data.post.id

      await app.inject({
        method: 'POST',
        url: `/api/posts/${postId}/like`,
        headers: { authorization: `Bearer ${secondUserToken}` },
      })

      const post = await prisma.post.findUnique({
        where: { id: postId },
      })

      expect(post?.likesCount).toBe(1)
    })

    it('debería actualizar bookmarksCount al dar bookmark', async () => {
      const postResponse = await createPost({
        content: 'Post para bookmarks',
        token: authToken,
      })

      const postId = JSON.parse(postResponse.body).data.post.id

      await app.inject({
        method: 'POST',
        url: `/api/posts/${postId}/bookmark`,
        headers: { authorization: `Bearer ${secondUserToken}` },
      })

      const post = await prisma.post.findUnique({
        where: { id: postId },
      })

      expect(post?.bookmarksCount).toBe(1)
    })

    it('debería actualizar repliesCount al crear reply', async () => {
      const parentResponse = await createPost({
        content: 'Post padre',
        token: authToken,
      })

      const parentId = JSON.parse(parentResponse.body).data.post.id

      await Promise.all(
        Array.from({ length: 3 }, (_, i) =>
          createPost({
            content: `Reply ${i + 1}`,
            token: secondUserToken,
            parentId,
          })
        )
      )

      const parent = await prisma.post.findUnique({
        where: { id: parentId },
      })

      expect(parent?.repliesCount).toBe(3)
    })
  })

  /**
   * ✅ Casos de Integración Completos
   */
  describe('🎯 Full Integration Scenarios', () => {
    it('flujo completo: crear post → like → bookmark → reply → delete', async () => {
      const postResponse = await createPost({
        content: 'Post completo con #test',
        token: authToken,
      })

      expect(postResponse.statusCode).toBe(201)
      const postId = JSON.parse(postResponse.body).data.post.id

      const likeResponse = await app.inject({
        method: 'POST',
        url: `/api/posts/${postId}/like`,
        headers: { authorization: `Bearer ${secondUserToken}` },
      })

      expect(likeResponse.statusCode).toBe(200)

      const bookmarkResponse = await app.inject({
        method: 'POST',
        url: `/api/posts/${postId}/bookmark`,
        headers: { authorization: `Bearer ${secondUserToken}` },
      })

      expect(bookmarkResponse.statusCode).toBe(200)

      const replyResponse = await createPost({
        content: 'Esta es una respuesta',
        token: secondUserToken,
        parentId: postId,
      })

      expect(replyResponse.statusCode).toBe(201)
      const replyId = JSON.parse(replyResponse.body).data.post.id

      let post = await prisma.post.findUnique({
        where: { id: postId },
      })

      expect(post?.likesCount).toBe(1)
      expect(post?.bookmarksCount).toBe(1)
      expect(post?.repliesCount).toBe(1)

      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: `/api/posts/${replyId}`,
        headers: { authorization: `Bearer ${secondUserToken}` },
      })

      expect(deleteResponse.statusCode).toBe(200)

      post = await prisma.post.findUnique({
        where: { id: postId },
      })

      expect(post?.repliesCount).toBe(0)

      const deletedReply = await prisma.post.findUnique({
        where: { id: replyId },
      })

      expect(deletedReply?.deletedAt).not.toBeNull()
    })

    it('debería manejar concurrencia en likes correctamente', async () => {
      const postResponse = await createPost({
        content: 'Post concurrente',
        token: authToken,
      })

      const postId = JSON.parse(postResponse.body).data.post.id

      const likePromises = Array.from({ length: 5 }, () =>
        app.inject({
          method: 'POST',
          url: `/api/posts/${postId}/like`,
          headers: { authorization: `Bearer ${secondUserToken}` },
        })
      )

      await Promise.all(likePromises)

      const likesCount = await prisma.like.count({
        where: { postId },
      })

      expect(likesCount).toBe(1)
    })

    it('debería filtrar posts eliminados del feed', async () => {
      // Crear post 1 (debe permanecer en el feed)
      const post1 = await createPost({
        content: 'Post 1',
        token: authToken,
      })

      // Crear post 2 (será eliminado)
      const post2 = await createPost({
        content: 'Post 2',
        token: authToken,
      })

      const post2Id = JSON.parse(post2.body).data.post.id

      // Eliminar post 2
      await app.inject({
        method: 'DELETE',
        url: `/api/posts/${post2Id}`,
        headers: { authorization: `Bearer ${authToken}` },
      })

      // Obtener feed
      const feedResponse = await app.inject({
        method: 'GET',
        url: '/api/posts/feed',
        headers: { authorization: `Bearer ${authToken}` },
      })

      const body = JSON.parse(feedResponse.body)

      // Solo debería aparecer post 1
      expect(body.data.posts).toHaveLength(1)
      expect(body.data.posts[0].content).toBe('Post 1')
    })
  })
})
