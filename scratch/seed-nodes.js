const { PrismaClient } = require('../backend/src/generated/prisma')
const prisma = new PrismaClient()

async function main() {
  const nodes = [
    { slug: 'aura', name: 'Aura', description: 'El centro de la conciencia colectiva.', icon: '✨', color: '#8884d8' },
    { slug: 'reflexion', name: 'Reflexión', description: 'Pensamientos profundos y mindful.', icon: '🧘', color: '#82ca9d' },
    { slug: 'tecnologia', name: 'Tecnología', description: 'El pulso de la innovación.', icon: '💻', color: '#ffc658' },
    { slug: 'naturaleza', name: 'Naturaleza', description: 'Conexión con el mundo orgánico.', icon: '🌿', color: '#41d3bd' },
    { slug: 'musica', name: 'Música', description: 'Frecuencias armónicas.', icon: '🎵', color: '#ff7300' }
  ]

  for (const node of nodes) {
    await prisma.auraNode.upsert({
      where: { slug: node.slug },
      update: {},
      create: {
        ...node,
        vibration: Math.random() * 100,
        pulse: Math.random() * 10,
      }
    })
  }

  console.log('Nodos Aura inicializados ✅')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
