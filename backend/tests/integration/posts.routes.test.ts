import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildServer } from '../../src/server'
import type { FastifyInstance } from 'fastify'
import FormData from 'form-data'

describe('Posts API Integration Tests', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildServer()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /api/posts/feed', () => {
    it('debería obtener el feed de posts', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/posts/feed',
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(true)
      expect(body.data).toHaveProperty('posts')
      expect(body.data).toHaveProperty('meta')
      expect(Array.isArray(body.data.posts)).toBe(true)
    })

    it('debería respetar el parámetro limit', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/posts/feed?limit=5',
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.data.posts.length).toBeLessThanOrEqual(5)
    })
  })

  describe('GET /api/posts/:id', () => {
    it('debería retornar 404 para un post inexistente', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/posts/non-existent-id',
      })

      expect(response.statusCode).toBe(404)
    })
  })

  describe('GET /api/posts/trending', () => {
    it('debería obtener posts trending', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/posts/trending',
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(true)
      expect(Array.isArray(body.data.posts)).toBe(true)
    })
  })

  describe('GET /api/posts/tag/:tagName', () => {
    it('debería filtrar posts por etiqueta', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/posts/tag/typescript',
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(true)
      expect(Array.isArray(body.data.posts)).toBe(true)
    })

    it('debería retornar posts vacíos si la etiqueta no existe', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/posts/tag/xyz-nonexistent',
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(true)
      expect(body.data.posts).toEqual([])
    })
  })

  describe('GET /api/posts/media', () => {
    it('debería obtener posts con imagen', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/posts/media',
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(true)
      expect(Array.isArray(body.data.posts)).toBe(true)
    })
  })

  describe('POST /api/posts (autenticado)', () => {
    it('debería requerir autenticación', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/posts',
        payload: {
          content: 'Test post',
        },
      })

      expect(response.statusCode).toBe(401)
    })

    it('debería crear un post con token válido', async () => {
      const timestamp = Date.now()
      const testEmail = `test-posts-${timestamp}@example.com`
      const testUsername = `testposts_${timestamp}`
      
      // First, ensure the user exists (Register him)
      await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: testEmail,
          username: testUsername,
          name: 'Test Posts',
          password: 'password123',
        },
      })

      const loginResponse = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: testEmail,
          password: 'password123',
        },
      })

      if (loginResponse.statusCode !== 200) {
          console.error('Login failed:', loginResponse.body)
      }
      expect(loginResponse.statusCode).toBe(200)

      const body = JSON.parse(loginResponse.body)
      const token = body.data.tokens.accessToken

      const form = new FormData()
      form.append('content', 'Test post from integration test')
      
      const response = await app.inject({
        method: 'POST',
        url: '/api/posts',
        headers: {
          authorization: `Bearer ${token}`,
          ...form.getHeaders(),
        },
        payload: form.getBuffer(),
      })

      expect(response.statusCode).toBe(201)
      const postBody = JSON.parse(response.body)
      expect(postBody.success).toBe(true)
      expect(postBody.data).toHaveProperty('post')
    })
  })

  describe('POST /api/posts/:id/like', () => {
    it('debería requerir autenticación', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/posts/some-id/like',
      })

      expect(response.statusCode).toBe(401)
    })
  })

  describe('POST /api/posts/:id/bookmark', () => {
    it('debería requerir autenticación', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/posts/some-id/bookmark',
      })

      expect(response.statusCode).toBe(401)
    })
  })
})
