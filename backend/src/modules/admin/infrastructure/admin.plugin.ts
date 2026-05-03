import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/lib/di-container'
import { TYPES } from '@/lib/di-types'
import { AdminController } from './controllers/admin.controller'
import { Role } from '@/enums/role.enum'

export default async function adminPlugin(server: FastifyInstance) {
  const controller = container.get<AdminController>(TYPES.AdminController)

  // Middleware para verificar que sea ADMIN
  const isAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user || request.user.role !== Role.ADMIN) {
      return reply.status(403).send({
        success: false,
        error: 'Acceso denegado: Se requiere rol de administrador',
      })
    }
  }

  // Rutas protegidas por autenticación y rol de admin
  server.register(
    async adminRoutes => {
      adminRoutes.addHook('preHandler', server.authenticate)
      adminRoutes.addHook('preHandler', isAdmin)

      adminRoutes.get('/stats', controller.getStats.bind(controller))
      adminRoutes.get('/users', controller.getUsers.bind(controller))
      adminRoutes.patch(
        '/users/:id/role',
        controller.updateUserRole.bind(controller)
      )
      adminRoutes.post(
        '/users/:id/toggle-active',
        controller.toggleUserActive.bind(controller)
      )
    },
    { prefix: '/admin' }
  )
}
