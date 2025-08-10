import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { HealthCheckSchema } from '../schemas/index'

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/health',
    {
      schema: {
        tags: ['health'],
        summary: 'Health Check',
        description:
          'Verifica el estado de la API y devuelve información del sistema',
        response: {
          200: HealthCheckSchema,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const uptime = process.uptime()
      const timestamp = new Date().toISOString()

      const healthData = {
        status: 'ok',
        timestamp,
        version: process.env.npm_package_version || '1.0.0',
        uptime: Math.floor(uptime),
      }

      return reply.code(200).send(healthData)
    }
  )

  fastify.get(
    '/health/detailed',
    {
      schema: {
        tags: ['health'],
        summary: 'Health Check Detallado',
        description:
          'Información detallada del estado del sistema incluyendo memoria y CPU',
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' },
              version: { type: 'string' },
              uptime: { type: 'number' },
              memory: {
                type: 'object',
                properties: {
                  used: { type: 'number' },
                  total: { type: 'number' },
                  free: { type: 'number' },
                  usage: { type: 'string' },
                },
              },
              environment: { type: 'string' },
              nodeVersion: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const uptime = process.uptime()
      const timestamp = new Date().toISOString()
      const memoryUsage = process.memoryUsage()

      const healthData = {
        status: 'ok',
        timestamp,
        version: process.env.npm_package_version || '1.0.0',
        uptime: Math.floor(uptime),
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
          free: Math.round(
            (memoryUsage.heapTotal - memoryUsage.heapUsed) / 1024 / 1024
          ), // MB
          usage: `${Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)}%`,
        },
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
      }

      return reply.code(200).send(healthData)
    }
  )
}
