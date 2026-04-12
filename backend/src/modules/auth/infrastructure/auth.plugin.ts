import fp from 'fastify-plugin'
import rateLimit from '@fastify/rate-limit'
import { FastifyInstance, FastifyRequest } from 'fastify'
import { container } from '@/lib/di-container'
import { TYPES } from '@/lib/di-types'
import { AuthController } from './controllers'
import {
  RegisterBodySchema,
  LoginBodySchema,
  GoogleLoginBodySchema,
  RefreshTokenBodySchema,
  LogoutBodySchema,
  SuccessResponseSchema,
  ErrorResponseSchema,
} from './schemas'
import { authenticateToken } from '@/middleware/auth.middleware'

export default fp(async function authPlugin(fastify: FastifyInstance) {
  // Bind fastify.jwt to the container so TokenService can use it
  if (!container.isBound(TYPES.JWT)) {
    container.bind(TYPES.JWT).toConstantValue(fastify.jwt)
  }

  const authController = container.get<AuthController>(TYPES.AuthController)

  fastify.register(async function (authRoutes) {
    authRoutes.register(async function (loginRoutes) {
      await loginRoutes.register(rateLimit, {
        max: 10,
        timeWindow: '15 minutes',
        keyGenerator: (req: FastifyRequest) => {
          const body = (req.body as Record<string, unknown>) || {}
          const identifier = (body.email as string) || 'anonymous'
          return `login-${req.ip}-${identifier}`
        },
        errorResponseBuilder: (_req, context) => ({
          success: false,
          error: 'Demasiados intentos de login. Intenta en 15 minutos.',
          retryAfter: Math.round(context.ttl / 1000),
        }),
      })

      loginRoutes.post(
        '/auth/login',
        {
          schema: {
            tags: ['auth'],
            summary: 'Iniciar sesión',
            body: LoginBodySchema,
            response: {
              200: SuccessResponseSchema,
              401: ErrorResponseSchema,
              429: ErrorResponseSchema,
            },
          },
        },
        authController.login.bind(authController)
      )

      loginRoutes.post(
        '/auth/login/google',
        {
          schema: {
            tags: ['auth'],
            summary: 'Login con Google',
            body: GoogleLoginBodySchema,
            response: {
              200: SuccessResponseSchema,
              400: ErrorResponseSchema,
              500: ErrorResponseSchema,
            },
          },
        },
        authController.googleLogin.bind(authController)
      )
    })

    authRoutes.register(async function (registerRoutes) {
      await registerRoutes.register(rateLimit, {
        max: 3,
        timeWindow: '1 hour',
        keyGenerator: (req: FastifyRequest) => `register-${req.ip}`,
        errorResponseBuilder: (_req, context) => ({
          success: false,
          error: 'Límite de registros alcanzado. Intenta más tarde.',
          retryAfter: Math.round(context.ttl / 1000),
        }),
      })

      registerRoutes.post(
        '/auth/register',
        {
          schema: {
            tags: ['auth'],
            summary: 'Registrar nuevo usuario',
            body: RegisterBodySchema,
            response: {
              201: SuccessResponseSchema,
              400: ErrorResponseSchema,
              429: ErrorResponseSchema,
            },
          },
        },
        authController.register.bind(authController)
      )
    })

    authRoutes.register(async function (refreshRoutes) {
      await refreshRoutes.register(rateLimit, {
        max: 20,
        timeWindow: '1 minute',
      })

      refreshRoutes.post(
        '/auth/refresh',
        {
          schema: {
            tags: ['auth'],
            summary: 'Renovar Access Token',
            body: RefreshTokenBodySchema,
            response: {
              200: SuccessResponseSchema,
              401: ErrorResponseSchema,
              404: ErrorResponseSchema,
            },
          },
        },
        authController.refreshToken.bind(authController)
      )
    })

    authRoutes.register(async function (privateRoutes) {
      privateRoutes.addHook('preHandler', authenticateToken)

      privateRoutes.post(
        '/auth/logout',
        {
          schema: {
            tags: ['auth'],
            summary: 'Cerrar sesión',
            security: [{ bearerAuth: [] }],
            body: LogoutBodySchema,
            response: {
              200: SuccessResponseSchema,
              401: ErrorResponseSchema,
              404: ErrorResponseSchema,
            },
          },
        },
        authController.logout.bind(authController)
      )

      privateRoutes.get(
        '/auth/me',
        {
          schema: {
            tags: ['auth'],
            summary: 'Obtener usuario autenticado',
            security: [{ bearerAuth: [] }],
            response: {
              200: SuccessResponseSchema,
              401: ErrorResponseSchema,
            },
          },
        },
        authController.getMe.bind(authController)
      )
    })
  })
})
