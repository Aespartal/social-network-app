import { FastifyInstance } from 'fastify'
import rateLimit from '@fastify/rate-limit'
import {
  register,
  login,
  getProfile,
  getUserByUsername,
} from '../controllers/userController'
import { authenticateToken } from '../middleware/auth'
import {
  RegisterUserSchema,
  LoginUserSchema,
  AuthResponseSchema,
  UserSchema,
  UserParamsSchema,
} from '../schemas/user.schemas'
import { ErrorSchema } from '../schemas/index'

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

    fastify.post(
      '/login',
      {
        schema: {
          tags: ['auth'],
          summary: 'Iniciar sesión',
          description: 'Autentica un usuario con email y contraseña',
          body: LoginUserSchema,
          response: {
            200: AuthResponseSchema,
            401: ErrorSchema,
            429: ErrorSchema,
            500: ErrorSchema,
          },
        },
      },
      login as any
    )
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

    fastify.post(
      '/register',
      {
        schema: {
          tags: ['auth'],
          summary: 'Registrar nuevo usuario',
          description: 'Crea una nueva cuenta de usuario',
          body: RegisterUserSchema,
          response: {
            201: AuthResponseSchema,
            400: ErrorSchema,
            409: ErrorSchema,
            429: ErrorSchema,
            500: ErrorSchema,
          },
        },
      },
      register as any
    )
  })

  fastify.get(
    '/users/:username',
    {
      schema: {
        tags: ['users'],
        summary: 'Obtener perfil público de usuario',
        description:
          'Retorna la información pública de un usuario por su nombre de usuario',
        params: UserParamsSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean', enum: [true] },
              data: {
                type: 'object',
                properties: {
                  user: UserSchema,
                },
              },
            },
          },
          404: ErrorSchema,
          500: ErrorSchema,
        },
      },
    },
    getUserByUsername as any
  )

  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticateToken)

    fastify.get(
      '/profile',
      {
        schema: {
          tags: ['users'],
          summary: 'Obtener perfil del usuario autenticado',
          description:
            'Retorna la información completa del usuario autenticado',
          security: [{ bearerAuth: [] }],
          response: {
            200: {
              type: 'object',
              properties: {
                success: { type: 'boolean', enum: [true] },
                data: {
                  type: 'object',
                  properties: {
                    user: UserSchema,
                  },
                },
              },
            },
            401: ErrorSchema,
            500: ErrorSchema,
          },
        },
      },
      getProfile as any
    )
  })
}
