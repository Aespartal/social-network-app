import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyInstance {
    swagger(): any
  }
}

async function swaggerPlugin(fastify: FastifyInstance) {
  await fastify.register(require('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'Social Network API',
        description:
          'API REST para aplicación de red social con validación de schemas y documentación automática',
        version: '1.0.0',
        contact: {
          name: 'Social Network Team',
          email: 'dev@socialnetwork.com',
          url: 'https://github.com/Aespartal/social-network-app.git',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      host: `localhost:${process.env.PORT || 3001}`,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        {
          name: 'health',
          description: 'Health checks y estado del sistema',
        },
        {
          name: 'auth',
          description: 'Autenticación y autorización de usuarios',
        },
        {
          name: 'users',
          description: 'Gestión de perfiles de usuarios',
        },
        {
          name: 'posts',
          description: 'Gestión de posts y contenido',
        },
        {
          name: 'social',
          description: 'Interacciones sociales (likes, follows, etc.)',
        },
      ],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description:
            'JWT token obtenido del endpoint de login. Formato: Bearer <token>',
        },
      },
    },
  })

  // Registrar Swagger UI para la interfaz web
  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      showExtensions: true,
      showCommonExtensions: true,
      useUnsafeMarkdown: false,
    },
    uiHooks: {
      onRequest: function (
        request: FastifyRequest,
        reply: FastifyReply,
        next: () => void
      ) {
        // Aquí puedes agregar autenticación para los docs si es necesario
        next()
      },
    },
    staticCSP: true,
    transformStaticCSP: (header: string) => header,
    transformSpecification: (swaggerObject: any) => {
      // Aquí puedes modificar la especificación antes de mostrarla
      return swaggerObject
    },
    transformSpecificationClone: true,
  })

  // Hook para agregar información adicional a la documentación
  fastify.addHook('onReady', async function () {
    await fastify.swagger()
    fastify.log.info(
      '📚 Swagger documentation available at http://localhost:' +
        (process.env.PORT || 3001) +
        '/docs'
    )
  })
}

export default fastifyPlugin(swaggerPlugin, {
  name: 'swagger-plugin',
  dependencies: [],
})
