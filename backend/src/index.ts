import fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { config } from '@/config/env'
import { userRoutes } from '@/routes/userRoutes'
import { postRoutes } from '@/routes/postRoutes'
import { healthRoutes } from '@/routes/healthRoutes'
import swaggerPlugin from '@/plugins/swagger'

const server = fastify({
  logger: {
    level: config.LOG_LEVEL,
  },
})

async function registerPlugins() {
  // Swagger debe registrarse antes que otras rutas
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
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: (request, context) => ({
      success: false,
      error: `Demasiadas peticiones. Límite: ${context.max} por minuto`,
      retryAfter: Math.round(context.ttl / 1000),
    }),
    onExceeding: (request, key) => {
      console.warn(`General rate limit exceeded: ${key}`)
    },
  })
}

async function registerRoutes() {
  // Health check routes
  server.register(healthRoutes)

  // API routes
  server.register(async function (fastify) {
    fastify.get(
      '/api/test',
      {
        schema: {
          tags: ['health'],
          summary: 'Test de API',
          description: 'Endpoint de prueba para verificar que la API funciona',
          response: {
            200: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                timestamp: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
      async (_request, _reply) => {
        return {
          message: 'API funcionando correctamente',
          timestamp: new Date().toISOString(),
        }
      }
    )
  })

  server.register(userRoutes, { prefix: '/api' })
  server.register(postRoutes, { prefix: '/api' })
}

async function start() {
  try {
    await registerPlugins()
    await registerRoutes()

    await server.listen({
      port: config.PORT,
      host: config.HOST,
    })

    console.log(
      `🚀 Servidor ejecutándose en http://${config.HOST}:${config.PORT}`
    )
    console.log(
      `📚 Documentación Swagger disponible en http://${config.HOST}:${config.PORT}/docs`
    )
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  try {
    await server.close()
    console.log('👋 Servidor cerrado correctamente')
    process.exit(0)
  } catch (err) {
    console.error('Error al cerrar el servidor:', err)
    process.exit(1)
  }
})

start()
