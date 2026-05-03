import { FastifyInstance, FastifyRequest } from 'fastify'
import { UserController } from '@/modules/users/infrastructure/controllers/user.controller'
import { VisitController } from '@/modules/visits/infrastructure/controllers/visit.controller'
import { container } from '@/lib/di-container'
import { TYPES } from '@/lib/di-types'
const userController = container.get<UserController>(TYPES.UserController)
const visitController = container.get<VisitController>(TYPES.VisitController)
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
      (req, rep) => userController.getMe(req, rep)
    )
    privateContext.post('/profile/visit/:visitedId', (req, rep) =>
      visitController.recordVisit(
        req as FastifyRequest<{ Params: { visitedId: string } }>,
        rep
      )
    )
    privateContext.get('/profile/my-visits', (req, rep) =>
      visitController.getProfileVisits(req, rep)
    )
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
      (req, rep) => userController.getSuggestedUsers(req, rep)
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
      (req, rep) =>
        userController.updateProfile(
          req as FastifyRequest<{ Params: { id: string } }>,
          rep
        )
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
    (req, rep) =>
      userController.getUserByUsername(
        req as FastifyRequest<{ Params: { username: string } }>,
        rep
      )
  )
}
