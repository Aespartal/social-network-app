import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Limpiando todos los logros de los usuarios...')
  
  const deleted = await prisma.userAchievement.deleteMany({})
  
  console.log(`✅ Se han eliminado ${deleted.count} registros de logros.`)
  
  // Opcional: Resetear también la experiencia de los usuarios si lo deseas
  await prisma.user.updateMany({ data: { totalXP: 0, currentLevel: 1 } })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
