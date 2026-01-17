import fp from 'fastify-plugin'
import rateLimit from '@fastify/rate-limit'
import { FastifyInstance } from 'fastify'
import { PrismaAuthRepository } from './repositories'
import {
  RegisterUseCase,
  LoginUseCase,
  GoogleLoginUseCase,
  RefreshTokenUseCase,
  LogoutUseCase,
} from '../application'
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
import { prisma } from '@/lib/prisma'
import { authenticateToken } from '@/middleware/auth.middleware'
import { TokenService } from './services/token.service'

export default fp(async function authPlugin(fastify: FastifyInstance) {
  const authRepository = new PrismaAuthRepository(prisma)
  const tokenService = new TokenService(fastify.jwt)
  const registerUseCase = new RegisterUseCase(authRepository, tokenService)
  const loginUseCase = new LoginUseCase(authRepository, tokenService)
  const googleLoginUseCase = new GoogleLoginUseCase(
    authRepository,
    tokenService
  )
  const refreshTokenUseCase = new RefreshTokenUseCase(
    authRepository,
    tokenService
  )
  const logoutUseCase = new LogoutUseCase(authRepository)

  const authController = new AuthController(
    registerUseCase,
    loginUseCase,
    googleLoginUseCase,
    refreshTokenUseCase,
    logoutUseCase
  )

  fastify.register(async function (authRoutes) {
    authRoutes.register(
      async function (loginRoutes) {
        await loginRoutes.register(rateLimit, {
          max: 10,
          timeWindow: '15 minutes',
          keyGenerator: (req: any) => {
            const body = req.body || {}
            const identifier = body.email || 'anonymous'
            return `login-${req.ip}-${identifier}`
          },
          errorResponseBuilder: (_req: any, context: any) => ({
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
      }
    )

    authRoutes.register(
      async function (registerRoutes) {
        await registerRoutes.register(rateLimit, {
          max: 3,
          timeWindow: '1 hour',
          keyGenerator: (req: any) => `register-${req.ip}`,
          errorResponseBuilder: (_req: any, context: any) => ({
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
      }
    )

    authRoutes.register(
      async function (refreshRoutes) {
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
      }
    )

    authRoutes.register(
      async function (logoutRoutes) {
        logoutRoutes.addHook('preHandler', authenticateToken)

        logoutRoutes.post(
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
      }
    )
  })
})
