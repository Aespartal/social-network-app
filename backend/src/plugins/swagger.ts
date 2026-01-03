import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { config } from '@/config/env'

async function swaggerPlugin(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Social Network API',
        description: 'API REST profesional para red social con validación de esquemas',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://${config.HOST}:${config.PORT}`,
          description: 'Servidor de Desarrollo',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Introduce el token obtenido en /login'
          }
        }
      },
      tags: [
        { name: 'auth', description: 'Acceso y tokens' },
        { name: 'users', description: 'Perfiles y búsqueda' },
        { name: 'posts', description: 'Publicaciones y Feed' },
        { name: 'social', description: 'Likes y Bookmarks' },
        { name: 'health', description: 'Estado del sistema' },
      ],
    },
  })

  // 2. Registro de la Interfaz UI
  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    staticCSP: true,
  })

  fastify.log.info(`📚 Swagger UI: http://${config.HOST}:${config.PORT}/docs`)
}

export default fastifyPlugin(swaggerPlugin, {
  name: 'swagger-plugin',
})