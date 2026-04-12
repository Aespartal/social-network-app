import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
      ? ['query', 'error', 'warn']
      : ['error'],
})

export { prisma }
