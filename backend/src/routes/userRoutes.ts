import { FastifyInstance } from 'fastify'
import rateLimit from '@fastify/rate-limit'
import {
  register,
  login,
  googleLogin,
  refresh,
  logout,
} from '../controllers/userController'
import { authenticateToken } from '../middleware/auth.middleware'
import {
  RegisterUserSchema,
  LoginUserSchema,
  AuthResponseSchema,
} from '../schemas/user.schemas'
import { ErrorSchema } from '../schemas/index'

export async function userRoutes(fastify: FastifyInstance) {
  // --- BLOQUE DE AUTENTICACIÓN (Con protección anti-bruta) ---

  // Login: 10 intentos por cada 15 min por IP/Email
  await fastify.register(async function (authContext) {
    await authContext.register(rateLimit, {
      max: 10,
      timeWindow: '15 minutes',
      keyGenerator: req => {
        const body = (req.body as any) || {}

        const identifier = body.email || body.token || 'anonymous'

        return `login-${req.ip}-${identifier}`
      },
      errorResponseBuilder: (_, context) => ({
        success: false,
        error: 'Demasiados intentos de login. Intenta en 15 minutos.',
        retryAfter: Math.round(context.ttl / 1000),
      }),
    })

    authContext.post(
      '/login',
      {
        schema: {
          tags: ['auth'],
          summary: 'Iniciar sesión',
          body: LoginUserSchema,
          response: {
            200: AuthResponseSchema,
            401: ErrorSchema,
            429: ErrorSchema,
          },
        },
      },
      login
    )

    authContext.post(
      '/login/google',
      {
        schema: {
          tags: ['auth'],
          summary: 'Login con Google',
          body: {
            type: 'object',
            required: ['token'],
            properties: {
              token: { type: 'string' },
            },
          },
          response: {
            200: AuthResponseSchema,
            400: ErrorSchema,
            500: ErrorSchema,
          },
        },
      },
      googleLogin
    )
  })

  // Registro: Máximo 3 cuentas por hora por IP
  await fastify.register(async function (regContext) {
    await regContext.register(rateLimit, {
      max: 3,
      timeWindow: '1 hour',
      keyGenerator: req => `register-${req.ip}`,
      errorResponseBuilder: (_, context) => ({
        success: false,
        error: 'Límite de registros alcanzado. Intenta más tarde.',
        retryAfter: Math.round(context.ttl / 1000),
      }),
    })

    regContext.post(
      '/register',
      {
        schema: {
          tags: ['auth'],
          summary: 'Registrar nuevo usuario',
          body: RegisterUserSchema,
          response: {
            201: AuthResponseSchema,
            400: ErrorSchema,
            429: ErrorSchema,
          },
        },
      },
      register
    )
  })

  await fastify.register(async function (refreshContext) {
    await refreshContext.register(rateLimit, {
      max: 20,
      timeWindow: '1 minute',
    })

    refreshContext.post(
      '/refresh',
      {
        schema: {
          tags: ['auth'],
          summary: 'Renovar Access Token',
          description:
            'Usa un Refresh Token válido para obtener un nuevo Access Token sin volver a loguearse.',
          body: {
            type: 'object',
            required: ['refreshToken'],
            properties: {
              refreshToken: { type: 'string' },
            },
          },
          response: {
            200: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                data: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                      description: 'Nuevo Access Token',
                    },
                  },
                },
                message: { type: 'string' },
              },
            },
            401: ErrorSchema,
            500: ErrorSchema,
          },
        },
      },
      refresh
    )
  })

  // --- BLOQUE DE USUARIOS ---

  // Perfil Privado (Mi Perfil)
  fastify.register(async function (privateContext) {
    privateContext.addHook('preHandler', authenticateToken)

    privateContext.post(
      '/logout',
      {
        schema: {
          tags: ['auth'],
          summary: 'Cerrar sesión',
          description: 'Invalida la sesión actual del usuario',
          security: [{ bearerAuth: [] }],
          body: {
            type: 'object',
            required: ['refreshToken'],
            properties: {
              refreshToken: { type: 'string' },
            },
          },
          response: {
            200: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
              },
            },
            401: ErrorSchema,
            500: ErrorSchema,
          },
        },
      },
      logout
    )
  })
}
