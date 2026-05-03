import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildServer } from '../../src/server'
import type { FastifyInstance } from 'fastify'
import { PrismaClient } from '../../src/generated/prisma/index'
import { container } from '../../src/lib/di-container'
import { TYPES } from '../../src/lib/di-types'

describe('Achievements Integration Tests', () => {
  let app: FastifyInstance
  let prisma: PrismaClient
  let userId: string
  let authToken: string

  beforeAll(async () => {
    app = await buildServer()
    await app.ready()
    prisma = new PrismaClient()

    // Seed test achievements
    await prisma.achievementTier.deleteMany({})
    await prisma.achievement.deleteMany({})

    const firstPostAchievement = await prisma.achievement.create({
      data: {
        name: 'Hola Mundo',
        slug: 'first_post',
        category: 'onboarding',
        triggerEvent: 'post.created',
        tierType: 'progressive',
        xpReward: 25,
      }
    })

    await prisma.achievementTier.createMany({
      data: [
        { achievementId: firstPostAchievement.id, tier: 'bronze', threshold: 1, xpReward: 50 },
        { achievementId: firstPostAchievement.id, tier: 'silver', threshold: 3, xpReward: 100 },
      ]
    })

    // Create test user
    const user = await prisma.user.create({
      data: {
        email: `tester-${Date.now()}@example.com`,
        username: `tester_${Date.now()}`,
        name: 'Tester',
        totalXP: 0,
        currentLevel: 1,
      }
    })
    userId = user.id
    
    authToken = app.jwt.sign({ id: userId, email: user.email, username: user.username })
  }, 30000)

  afterAll(async () => {
    await prisma.notification.deleteMany({})
    await prisma.userAchievement.deleteMany({})
    await prisma.post.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.achievementTier.deleteMany({})
    await prisma.achievement.deleteMany({})
    await prisma.$disconnect()
    await app.close()
  })

  it('debería otorgar un logro de bronce al crear el primer post', async () => {
    const handler = container.get<any>(TYPES.CheckAchievementHandler)

    await prisma.post.create({
      data: {
        content: 'Primer post',
        authorId: userId,
      }
    })

    await handler.execute({
      userId,
      triggerEvent: 'post.created',
    })

    await new Promise(resolve => setTimeout(resolve, 1000))
    const userAchievement = await prisma.userAchievement.findFirst({
      where: { userId, tierAchieved: 'bronze' }
    })

    expect(userAchievement).toBeDefined()
    expect(userAchievement?.progress).toBe(1)

    const updatedUser = await prisma.user.findUnique({ where: { id: userId } })
    expect(updatedUser?.totalXP).toBe(50)
  })

  it('debería progresar hacia el siguiente tier sin otorgarlo prematuramente', async () => {
    const handler = container.get<any>(TYPES.CheckAchievementHandler)

    await prisma.post.deleteMany({ where: { authorId: userId } })

    await prisma.post.create({
      data: { content: 'Post 1', authorId: userId }
    })
    await prisma.post.create({
      data: { content: 'Post 2', authorId: userId }
    })

    await handler.execute({
      userId,
      triggerEvent: 'post.created',
    })

    await new Promise(resolve => setTimeout(resolve, 1000))

    const progressRecords = await prisma.userAchievement.findMany({
      where: { userId },
      orderBy: { progress: 'desc' }
    })
    
    expect(progressRecords.some(r => r.progress === 2)).toBe(true)
  })

  it('debería otorgar el tier de plata al alcanzar el threshold', async () => {
    const handler = container.get<any>(TYPES.CheckAchievementHandler)

    await prisma.post.deleteMany({ where: { authorId: userId } })

    await prisma.post.create({ data: { content: 'Post 1', authorId: userId } })
    await prisma.post.create({ data: { content: 'Post 2', authorId: userId } })
    await prisma.post.create({ data: { content: 'Post 3', authorId: userId } })

    await handler.execute({
      userId,
      triggerEvent: 'post.created',
    })

    await new Promise(resolve => setTimeout(resolve, 1000))

    const silverTier = await prisma.userAchievement.findFirst({
      where: { userId, tierAchieved: 'silver' }
    })
    expect(silverTier).toBeDefined()
    expect(silverTier?.progress).toBe(3)

    const updatedUser = await prisma.user.findUnique({ where: { id: userId } })
    expect(updatedUser?.totalXP).toBeGreaterThanOrEqual(150)
  })
})
