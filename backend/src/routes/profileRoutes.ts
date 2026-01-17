import { FastifyInstance } from 'fastify'
import {
  recordVisit,
  getProfileVisits,
  getProfile,
  getUserByUsername,
  getSuggestedUsers,
  updateProfile,
} from '../controllers/profileController'
import { authenticateToken } from '@/middleware/auth.middleware'
import { UserParamsSchema, UserSchema } from '@/schemas/user.schemas'
import { ErrorSchema } from '@/schemas'

export async function profileRoutes(fastify: FastifyInstance) {
  fastify.register(async function (privateContext) {
    privateContext.addHook('preHandler', authenticateToken)
    privateContext.get(
      '/profile',
      {
        schema: {
          tags: ['users'],
          summary: 'Obtener perfil propio',
          security: [{ bearerAuth: [] }],
          response: {
            200: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                data: UserSchema,
                message: { type: 'string' },
              },
            },
            401: ErrorSchema,
          },
        },
      },
      getProfile
    )
    privateContext.post('/profile/visit/:visitedId', recordVisit)
    privateContext.get('/profile/my-visits', getProfileVisits)
    privateContext.get(
      '/profile/suggestions',
      {
        schema: {
          tags: ['social'],
          summary: 'Obtener usuarios sugeridos',
          description:
            'Devuelve una lista de usuarios que el usuario actual no sigue aún.',
          security: [{ bearerAuth: [] }],
          querystring: {
            type: 'object',
            properties: {
              limit: { type: 'number', default: 5, minimum: 1, maximum: 20 },
            },
          },
          response: {
            200: {
              type: 'object',
              required: ['success', 'data'],
              properties: {
                success: { type: 'boolean' },
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      username: { type: 'string' },
                      name: { type: 'string' },
                      avatar: { type: 'string', nullable: true },
                      verified: { type: 'boolean' },
                      _count: {
                        type: 'object',
                        properties: {
                          followers: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
            500: ErrorSchema,
          },
        },
      },
      getSuggestedUsers
    )

    // Actualizar perfil
    privateContext.patch(
      '/profile/:id',
      {
        schema: {
          tags: ['users'],
          summary: 'Actualizar perfil propio',
          description:
            'Actualiza username, name, bio y/o avatar del usuario autenticado',
          security: [{ bearerAuth: [] }],
          params: {
            type: 'object',
            required: ['id'],
            properties: {
              id: { type: 'string' },
            },
          },
          consumes: ['multipart/form-data'],
          response: {
            200: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                data: UserSchema,
                message: { type: 'string' },
              },
            },
            400: ErrorSchema,
            403: ErrorSchema,
            409: ErrorSchema,
            500: ErrorSchema,
          },
        },
      },
      updateProfile
    )
  })

  // Perfil Público
  fastify.get(
    '/profile/:username',
    {
      schema: {
        tags: ['users'],
        summary: 'Obtener perfil público',
        params: UserParamsSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: UserSchema,
            },
          },
          404: ErrorSchema,
        },
      },
    },
    getUserByUsername
  )
}
