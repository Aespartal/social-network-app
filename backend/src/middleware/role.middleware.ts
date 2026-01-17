import { FastifyReply, FastifyRequest } from 'fastify'
import { Role } from '@/enums/role.enum'

export const authorize = (allowedRoles: Role[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: 'No autenticado'
      })
    }

    if (!allowedRoles.includes(user.role)) {
      return reply.status(403).send({
        success: false,
        error: `No tienes permisos suficientes (Se requiere: ${allowedRoles.join(', ')})`
      })
    }
  }
}