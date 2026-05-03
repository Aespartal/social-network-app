import { FastifyInstance } from 'fastify'
import { AchievementController } from './controllers/achievement.controller'
import { container } from '@/lib/di-container'
import { TYPES } from '@/lib/di-types'
import { authenticateToken } from '@/middleware/auth.middleware'

export async function achievementRoutes(fastify: FastifyInstance) {
  const controller = container.get<AchievementController>(
    TYPES.AchievementController
  )

  // Rutas públicas
  fastify.get(
    '/achievements/:userId',
    {
      schema: {
        tags: ['achievements'],
        summary: 'Obtener logros de un usuario',
        params: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
          },
          required: ['userId'],
        },
        querystring: {
          type: 'object',
          properties: {
            includeHidden: { type: 'string', enum: ['true', 'false'] },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  achievements: { type: 'array' },
                  totalXP: { type: 'integer' },
                  level: { type: 'integer' },
                  levelTitle: { type: 'string' },
                  nextLevelXP: { type: 'integer' },
                  progressToNextLevel: { type: 'integer' },
                },
              },
            },
          },
        },
      },
    },
    controller.getUserAchievements.bind(controller)
  )

  // Rutas privadas (requieren autenticación)
  fastify.register(async function (privateContext) {
    privateContext.addHook('preHandler', authenticateToken)

    privateContext.get(
      '/me/achievements',
      {
        schema: {
          tags: ['achievements'],
          summary: 'Obtener mis logros',
          response: {
            200: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                data: {
                  type: 'object',
                  properties: {
                    achievements: { type: 'array' },
                    totalXP: { type: 'integer' },
                    level: { type: 'integer' },
                    levelTitle: { type: 'string' },
                    nextLevelXP: { type: 'integer' },
                    progressToNextLevel: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
      controller.getMyAchievements.bind(controller)
    )
  })
}
