import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { PrismaUserRepository } from './repositories'
import {
  CreateUserUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '../application'
import { UserController } from './controllers'
import {
  UserParamsSchema,
  CreateUserBodySchema,
  UpdateUserBodySchema,
  SuccessResponseSchema,
  ErrorResponseSchema,
} from './schemas'
import { prisma } from '@/lib/prisma'
import { authenticateToken } from '@/middleware/auth.middleware'
import { GetUserByUsernameUseCase } from '../application/use-cases/get-user-by-username.use-case'

export default fp(async function usersPlugin(fastify: FastifyInstance) {
  const userRepository = new PrismaUserRepository(prisma)

  const createUserUseCase = new CreateUserUseCase(userRepository)
  const getUserUseCase = new GetUserUseCase(userRepository)
  const updateUserUseCase = new UpdateUserUseCase(userRepository)
  const deleteUserUseCase = new DeleteUserUseCase(userRepository)
  const getUserByUsernameUseCase = new GetUserByUsernameUseCase(userRepository)

  const userController = new UserController(
    createUserUseCase,
    getUserUseCase,
    updateUserUseCase,
    deleteUserUseCase,
    getUserByUsernameUseCase
  )

  fastify.register(async function (publicRoutes) {
    publicRoutes.get(
      '/users/:username',
      {
        schema: {
          tags: ['users'],
          summary: 'Obtener usuario por nombre de usuario',
          params: {
            type: 'object',
            properties: {
              username: { type: 'string' },
            },
            required: ['username'],
          },
          response: {
            200: SuccessResponseSchema,
            404: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      userController.getUserByUsername.bind(userController)
    )
  })

  fastify.register(async function (privateRoutes) {
    privateRoutes.addHook('preHandler', authenticateToken)

    privateRoutes.post(
      '/users',
      {
        schema: {
          tags: ['users'],
          summary: 'Crear nuevo usuario',
          security: [{ bearerAuth: [] }],
          body: CreateUserBodySchema,
          response: {
            201: SuccessResponseSchema,
            400: ErrorResponseSchema,
            401: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      userController.createUser.bind(userController)
    )

    privateRoutes.patch(
      '/users/:id',
      {
        schema: {
          tags: ['users'],
          summary: 'Actualizar usuario',
          security: [{ bearerAuth: [] }],
          params: UserParamsSchema,
          body: UpdateUserBodySchema,
          response: {
            200: SuccessResponseSchema,
            400: ErrorResponseSchema,
            401: ErrorResponseSchema,
            403: ErrorResponseSchema,
            404: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      userController.updateUser.bind(userController)
    )

    privateRoutes.delete(
      '/users/:id',
      {
        schema: {
          tags: ['users'],
          summary: 'Eliminar usuario',
          security: [{ bearerAuth: [] }],
          params: UserParamsSchema,
          response: {
            200: SuccessResponseSchema,
            401: ErrorResponseSchema,
            403: ErrorResponseSchema,
            404: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      userController.deleteUser.bind(userController)
    )

    privateRoutes.get(
      '/users/me',
      {
        schema: {
          tags: ['users'],
          summary: 'Obtener el usuario autenticado',
          security: [{ bearerAuth: [] }],
          response: {
            200: SuccessResponseSchema,
            401: ErrorResponseSchema,
            500: ErrorResponseSchema,
          },
        },
      },
      userController.getMe.bind(userController)
    )
  })
})
