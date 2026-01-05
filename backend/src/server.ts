import fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { config } from '@/config/env'
import { userRoutes } from '@/routes/userRoutes'
import { postRoutes } from '@/routes/postRoutes'
import { healthRoutes } from '@/routes/healthRoutes'
import swaggerPlugin from '@/plugins/swagger'
import jwt from '@fastify/jwt'
import { profileRoutes } from './routes/profileRoutes'
import multipart from '@fastify/multipart'

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

  await server.register(multipart, {
    limits: { fileSize: config.MAX_FILE_SIZE },
  })
  await server.register(swaggerPlugin)
  await server.register(cors, {
    origin: config.ALLOWED_ORIGINS,
    credentials: true,
  })
  await server.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
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

async function registerRoutes(server: FastifyInstance) {
  server.register(healthRoutes)

  await server.register(
    async api => {
      api.register(userRoutes, { prefix: '/auth' })
      api.register(postRoutes)
      api.register(profileRoutes)

      api.get('/test', async () => ({
        message: 'API OK',
        timestamp: new Date().toISOString(),
      }))
    },
    { prefix: '/api' }
  )
}
