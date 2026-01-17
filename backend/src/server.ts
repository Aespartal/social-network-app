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

export async function buildServer(): Promise<FastifyInstance> {
  const server = fastify({
    logger: { level: config.LOG_LEVEL },
    pluginTimeout: config.PLUGIN_TIMEOUT || 20_000,
  })

  await registerPlugins(server)
  await registerRoutes(server)

  return server
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

  // Custom error handler for validation errors
  server.setErrorHandler((error: FastifyError, request, reply) => {
    if (error.validation) {
      const validationErrors = error.validation.map((err: any) => {
        const field =
          err.instancePath?.replace(/^\//, '') || err.params?.missingProperty

        // Handle password length validation
        if (field === 'password' && err.keyword === 'minLength') {
          return 'La contraseña debe tener al menos 8 caracteres'
        }

        // Handle username validation
        if (field === 'username') {
          if (err.keyword === 'minLength') {
            return 'El nombre de usuario debe tener al menos 3 caracteres'
          }
          if (err.keyword === 'pattern') {
            return 'El nombre de usuario solo puede contener letras, números y guiones bajos'
          }
        }

        // Handle email validation
        if (field === 'email' && err.keyword === 'format') {
          return 'El email no es válido'
        }

        // Handle name validation
        if (field === 'name' && err.keyword === 'minLength') {
          return 'El nombre es requerido'
        }

        // Generic error message
        return (
          err.message ||
          `Error de validación en el campo ${field || 'desconocido'}`
        )
      })

      return reply.status(400).send({
        success: false,
        error: validationErrors[0] || 'Error de validación',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
      })
    }

    // Handle other errors
    const statusCode = error.statusCode || 500
    return reply.status(statusCode).send({
      success: false,
      error: error.message || 'Error interno del servidor',
      code: error.code,
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
        console.warn(`General rate limit exceeded: ${key}`)
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

      api.get('/test', async () => ({
        message: 'API OK',
        timestamp: new Date().toISOString(),
      }))
    },
    { prefix: '/api' }
  )
}
