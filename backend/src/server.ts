import fastify, { FastifyInstance, FastifyError } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { config } from '@/config/env'
import swaggerPlugin from '@/plugins/swagger'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import { healthRoutes } from '@/routes/healthRoutes'
import { profileRoutes } from '@/routes/profileRoutes'
import postsPlugin from '@/modules/posts/infrastructure/posts.plugin'
import authPlugin from '@/modules/auth/infrastructure/auth.plugin'
import usersPlugin from '@/modules/users/infrastructure/users.plugin'
import notificationsPlugin from '@/modules/notifications/infrastructure/notifications.plugin'
import { achievementRoutes } from '@/modules/achievements/infrastructure/achievements.plugin'
import socketPlugin from '@/plugins/socket'
import notificationListenerPlugin from '@/modules/notifications/infrastructure/notification-listener.plugin'
import achievementSubscriberPlugin from '@/modules/achievements/infrastructure/achievement-subscriber.plugin'

export async function buildServer(): Promise<FastifyInstance> {
  const server = fastify({
    logger: { level: config.LOG_LEVEL },
    pluginTimeout: config.PLUGIN_TIMEOUT || 20_000,
  })

  await registerPlugins(server)
  await registerRoutes(server)

  return server
}

interface ValidationError {
  instancePath?: string
  params?: { missingProperty?: string }
  keyword?: string
  message?: string
}

async function registerPlugins(server: FastifyInstance) {
  await server.register(jwt, {
    secret: config.JWT_SECRET,
  })

  server.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      request.log.error(err)
      reply.status(401).send({
        success: false,
        error: 'Token inválido o expirado',
      })
    }
  })

  server.setErrorHandler((error: FastifyError, request, reply) => {
    const isProduction = config.NODE_ENV === 'production'

    if (error.validation) {
      const details = error.validation.map((err: ValidationError) => {
        const field =
          err.instancePath?.replace(/^\//, '') || err.params?.missingProperty

        if (field === 'password' && err.keyword === 'minLength')
          return 'La contraseña debe tener al menos 8 caracteres'
        if (field === 'username' && err.keyword === 'minLength')
          return 'El nombre de usuario debe tener al menos 3 caracteres'
        if (field === 'username' && err.keyword === 'pattern')
          return 'El nombre de usuario solo puede contener letras, números y guiones bajos'
        if (field === 'email' && err.keyword === 'format')
          return 'El email no es válido'
        if (field === 'name' && err.keyword === 'minLength')
          return 'El nombre es requerido'

        return (
          err.message ||
          `Error de validación en el campo ${field || 'desconocido'}`
        )
      })

      return reply.status(400).send({
        success: false,
        error: details[0] || 'Error de validación',
        details: isProduction ? undefined : details,
        code: 'VALIDATION_ERROR',
        statusCode: 400,
      })
    }

    const statusCode = error.statusCode || 500

    const message =
      statusCode >= 500 && isProduction
        ? 'Ocurrió un error interno en el servidor'
        : error.message || 'Error inesperado'

    if (statusCode >= 500) {
      request.log.error(error)
    }

    return reply.status(statusCode).send({
      success: false,
      error: message,
      code: error.code || 'INTERNAL_SERVER_ERROR',
      statusCode,
    })
  })

  await server.register(multipart, {
    limits: { fileSize: config.MAX_FILE_SIZE },
  })
  await server.register(swaggerPlugin)
  await server.register(cors, {
    origin: config.ALLOWED_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
  })
  await server.register(helmet, {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  })

  // Socket.io for Real-Time
  await server.register(socketPlugin)
  await server.register(notificationListenerPlugin)
  await server.register(achievementSubscriberPlugin)

  // Disable rate limiting in test environment
  if (process.env.NODE_ENV !== 'test') {
    await server.register(rateLimit, {
      max: config.RATE_LIMIT_MAX || 100,
      timeWindow: '1 minute',
      errorResponseBuilder: (_req, context) => ({
        success: false,
        error: `Demasiadas peticiones. Límite: ${context.max} por minuto`,
        retryAfter: Math.round(context.ttl / 1000),
      }),
      onExceeding: (_req, key) => {
        server.log.warn({ rateLimitKey: key }, 'General rate limit exceeded')
      },
    })
  }
}

async function registerRoutes(server: FastifyInstance) {
  server.register(healthRoutes)
  server.register(profileRoutes, { prefix: '/api' })

  await server.register(
    async api => {
      api.register(usersPlugin)
      api.register(authPlugin)
      api.register(postsPlugin)
      api.register(notificationsPlugin)
      api.register(achievementRoutes)

      const { default: adminPlugin } =
        await import('@/modules/admin/infrastructure/admin.plugin')
      api.register(adminPlugin)

      api.get('/test', async () => ({
        message: 'API OK',
        timestamp: new Date().toISOString(),
      }))
    },
    { prefix: '/api' }
  )
}
