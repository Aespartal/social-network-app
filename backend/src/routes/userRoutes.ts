import { FastifyInstance } from 'fastify'
import rateLimit from '@fastify/rate-limit'
import {
  register,
  login,
  getProfile,
  getUserByUsername,
} from '../controllers/userController'
import { authenticateToken } from '../middleware/auth'

export async function userRoutes(fastify: FastifyInstance) {
  await fastify.register(async function (fastify) {
    await fastify.register(rateLimit, {
      max: 5,
      timeWindow: '15 minutes',
      keyGenerator: request => {
        const email = (request.body as any)?.email || 'unknown'
        return `login-${request.ip}-${email}`
      },
      errorResponseBuilder: (request, context) => ({
        success: false,
        error: 'Demasiados intentos de login. Intenta más tarde',
        retryAfter: Math.round(context.ttl / 1000),
      }),
      onExceeding: (request, key) => {
        console.warn(`Rate limit exceeded for login: ${key}`)
      },
    })

    fastify.post('/login', login as any)
  })

  await fastify.register(async function (fastify) {
    await fastify.register(rateLimit, {
      max: 3,
      timeWindow: '1 hour',
      keyGenerator: request => `register-${request.ip}`,
      errorResponseBuilder: (request, context) => ({
        success: false,
        error: 'Demasiados intentos de registro. Intenta más tarde',
        retryAfter: Math.round(context.ttl / 1000),
      }),
      onExceeding: (request, key) => {
        console.warn(`Rate limit exceeded for register: ${key}`)
      },
    })

    fastify.post('/register', register as any)
  })

  fastify.get('/users/:username', getUserByUsername as any)

  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticateToken)

    fastify.get('/profile', getProfile as any)
  })
}
