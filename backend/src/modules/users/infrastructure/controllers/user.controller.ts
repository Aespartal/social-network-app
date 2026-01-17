import { FastifyRequest, FastifyReply } from 'fastify'
import {
  CreateUserUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '../../application'
import { isUserError, USER_ERROR_HTTP_MAPPING } from '../../domain/errors'
import { GetUserByUsernameUseCase } from '../../application/use-cases/get-user-by-username.use-case'

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getUserByUsernameUseCase: GetUserByUsernameUseCase
  ) {}

  async createUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const user = await this.createUserUseCase.execute(body)

      const { password: _, ...userWithoutPassword } = user as any

      return reply.status(201).send({
        success: true,
        data: userWithoutPassword,
        message: 'Usuario creado exitosamente',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const currentUserId = request.user?.id

      const user = await this.getUserUseCase.execute(id, {
        counts: true,
        isFollowing: !!currentUserId,
        followerId: currentUserId,
      })

      const { password: _, ...userWithoutPassword } = user as any

      return reply.send({
        success: true,
        data: userWithoutPassword,
        message: 'Usuario obtenido exitosamente',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async updateUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const userId = request.user?.id
      const userRole = request.user?.role
      const body = request.body as any

      if (!userId || !userRole) {
        return reply.status(401).send({
          success: false,
          error: 'No autenticado',
        })
      }

      const user = await this.updateUserUseCase.execute(
        id,
        body,
        userId,
        userRole
      )

      const { password: _, ...userWithoutPassword } = user as any

      return reply.send({
        success: true,
        data: userWithoutPassword,
        message: 'Usuario actualizado exitosamente',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async deleteUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const userId = request.user?.id
      const userRole = request.user?.role

      if (!userId || !userRole) {
        return reply.status(401).send({
          success: false,
          error: 'No autenticado',
        })
      }

      await this.deleteUserUseCase.execute(id, userId, userRole)

      return reply.send({
        success: true,
        message: 'Usuario eliminado exitosamente',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id
      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'No autenticado',
        })
      }

      const user = await this.getUserUseCase.execute(userId, {
        counts: true,
        isFollowing: false,
        followerId: undefined,
      })

      return reply.send({
        success: true,
        data: user,
        message: 'Usuario autenticado obtenido exitosamente',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getUserByUsername(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { username } = request.params as { username: string }
      const currentUserId = request.user?.id

      const user = await this.getUserByUsernameUseCase.execute(
        username,
        currentUserId,
        {
          counts: true,
          isFollowing: !!currentUserId,
          followerId: currentUserId,
        }
      )

      return reply.send({
        success: true,
        data: user,
        message: 'Usuario obtenido exitosamente',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  private handleError(error: unknown, reply: FastifyReply) {
    if (isUserError(error)) {
      const statusCode = USER_ERROR_HTTP_MAPPING[error.code] || 500
      return reply.status(statusCode).send({
        success: false,
        error: error.message,
        code: error.code,
        statusCode,
      })
    }

    console.error('UserController error:', error)
    return reply.status(500).send({
      success: false,
      error: 'Error interno del servidor',
    })
  }
}
