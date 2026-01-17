import { beforeAll, afterAll, afterEach } from 'vitest'
import { PrismaClient } from '../src/generated/prisma'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-key-for-testing-min-32-chars-long'
process.env.PORT = '3001'
process.env.HOST = '0.0.0.0'
process.env.ALLOWED_ORIGINS = 'http://localhost:3000'
process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud-name'
process.env.CLOUDINARY_API_KEY = 'test-api-key'
process.env.CLOUDINARY_API_SECRET = 'test-api-secret'
process.env.LOG_LEVEL = 'error'

// Usar una base de datos separada para tests
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL no está configurada. Crea un archivo .env.test con DATABASE_URL apuntando a una base de datos de pruebas.'
  )
}

const prisma = new PrismaClient()

// Limpiar la base de datos antes de todos los tests
beforeAll(async () => {
  console.log('🧹 Limpiando base de datos de tests...')
  await cleanDatabase()
})

// Limpiar posts después de cada test pero dejar usuarios
afterEach(async () => {
  await prisma.post.deleteMany({})
  await prisma.like.deleteMany({})
  await prisma.bookmark.deleteMany({})
  await prisma.profileVisit.deleteMany({})
})

// Cerrar conexión después de todos los tests
afterAll(async () => {
  await prisma.$disconnect()
})

async function cleanDatabase() {
  const tables = [
    'sessions',
    'profile_visits',
    'bookmarks',
    'likes',
    'post_tags',
    'posts',
    'tags',
    'follows',
    'users',
  ]

  try {
    // Desactivar restricciones de foreign key temporalmente
    await prisma.$executeRawUnsafe('SET CONSTRAINTS ALL DEFERRED;')

    for (const table of tables) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`)
    }

    // Reactivar restricciones
    await prisma.$executeRawUnsafe('SET CONSTRAINTS ALL IMMEDIATE;')
  } catch (error) {
    console.error('Error limpiando base de datos:', error)
    throw error
  }
}
