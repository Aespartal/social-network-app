import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import fastifySocketIO from 'fastify-socket.io'
import { Server } from 'socket.io'
import { container } from '@/lib/di-container'
import { TYPES } from '@/lib/di-types'
import { NotificationService } from '@/modules/notifications/application/services/notification.service'

declare module 'fastify' {
  interface FastifyInstance {
    io: Server
  }
}

const socketPlugin: FastifyPluginAsync = async (server: FastifyInstance) => {
  await server.register(fastifySocketIO, {
    cors: {
      origin: '*', // Adjust for production
      methods: ['GET', 'POST'],
    },
  })

  // Use onReady hook instead of server.ready() to avoid early booting
  server.addHook('onReady', async () => {
    // Inyectar Socket.IO en NotificationService
    const notificationService = container.get<NotificationService>(
      TYPES.NotificationService
    )
    if (server.io) {
      notificationService.setSocketServer(server.io)
      server.log.info('✅ Socket.IO server injected into NotificationService')
    }

    server.io.on('connection', socket => {
      const userId = socket.handshake.query.userId as string

      if (userId) {
        socket.join(`user:${userId}`)
        server.log.info(`Socket connected: ${socket.id} for user ${userId}`)
      }

      socket.on('disconnect', () => {
        server.log.info(`Socket disconnected: ${socket.id}`)
      })
    })
  })
}

export default socketPlugin
