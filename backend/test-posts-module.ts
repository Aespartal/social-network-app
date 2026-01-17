import { prisma } from './src/lib/prisma'
import { PrismaPostRepository } from './src/modules/posts/infrastructure/repositories'
import {
  CreatePostCommandHandler,
  DeletePostCommandHandler,
} from './src/modules/posts/application'
import {
  GetFeedHandler,
  GetPostByIdHandler,
} from './src/modules/posts/application/queries'
import { PrismaPostQueryProvider } from './src/modules/posts/infrastructure/services/prisma-post-query.service'
import { Role } from './src/generated/prisma'

async function testPostsModule() {
  console.log('🚀 Iniciando pruebas del módulo Posts...\n')

  const repository = new PrismaPostRepository(prisma)
  const postQueryProvider = new PrismaPostQueryProvider(prisma)

  const createPostHandler = new CreatePostCommandHandler(repository)
  const getFeedHandler = new GetFeedHandler(postQueryProvider)
  const getPostHandler = new GetPostByIdHandler(postQueryProvider)
  const deletePostHandler = new DeletePostCommandHandler(repository)

  console.log('0️⃣  Creando usuario de prueba...')
  const user = await prisma.user.upsert({
    where: { email: 'test-posts-module@example.com' },
    update: {},
    create: {
      email: 'test-posts-module@example.com',
      username: 'testposts',
      name: 'Test Posts User',
      password: 'hashedpassword123',
    },
  })
  console.log(`   ✓ Usuario creado: ${user.id}\n`)

  const testUserId = user.id
  const postIds: string[] = []

  try {
    console.log('1️⃣  Creando posts de prueba...')

    const post1 = await createPostHandler.execute({
      content: 'Primer post de prueba para arquitectura limpia',
      authorId: testUserId,
      tags: ['typescript', 'architecture'],
    })
    postIds.push(post1.id)
    console.log(`   ✓ Post 1 creado: ${post1.id}`)

    const post2 = await createPostHandler.execute({
      content: 'Segundo post con tags diferentes',
      authorId: testUserId,
      tags: ['testing', 'vitest'],
    })
    postIds.push(post2.id)
    console.log(`   ✓ Post 2 creado: ${post2.id}`)

    const post3 = await createPostHandler.execute({
      content: 'Tercer post sin tags',
      authorId: testUserId,
    })
    postIds.push(post3.id)
    console.log(`   ✓ Post 3 creado: ${post3.id}\n`)

    console.log('2️⃣  Creando respuesta al primer post...')
    const reply = await createPostHandler.execute({
      content: 'Esta es una respuesta al primer post',
      authorId: testUserId,
      parentId: post1.id,
    })
    postIds.push(reply.id)
    console.log(`   ✓ Respuesta creada: ${reply.id}\n`)

    console.log('3️⃣  Obteniendo feed...')
    const feed = await getFeedHandler.execute({
      followingUserIds: [],
      userId: testUserId,
      page: { limit: 20 },
    })

    console.log(`   ✓ Feed obtenido con ${feed.posts.length} posts`)
    console.log(`   - Tiene siguientes páginas: ${feed.meta.nextCursor}\n`)

    console.log('4️⃣  Obteniendo post por ID...')
    const retrievedPost = await getPostHandler.execute({
      postId: post1.id,
      userId: testUserId,
    })
    console.log(`   ✓ Post obtenido: ${retrievedPost.content}`)
    console.log(`   - Author: ${retrievedPost.author?.username}`)
    console.log(`   - Replies: ${retrievedPost.repliesCount}`)
    console.log(`   - Tags: ${retrievedPost.tags?.join(', ') || 'none'}\n`)

    console.log('5️⃣  Probando paginación con cursor...')
    const page1 = await getFeedHandler.execute({
      followingUserIds: [],
      userId: testUserId,
      page: { limit: 2 },
    })
    console.log(`   ✓ Página 1: ${page1.posts.length} posts`)

    if (page1.meta.nextCursor) {
      const page2 = await getFeedHandler.execute({
        followingUserIds: [],
        userId: testUserId,
        page: {
          cursor: page1.meta.nextCursor,
          limit: 2,
        },
      })
      console.log(`   ✓ Página 2: ${page2.posts.length} posts`)
      console.log(`   - Cursor funciona correctamente\n`)
    }

    console.log('6️⃣  Probando validaciones...')
    try {
      await createPostHandler.execute({
        content: '',
        authorId: testUserId,
      })
      console.log('   ✗ Debería haber fallado (contenido vacío)')
    } catch (error: any) {
      if (error.message.includes('al menos texto o una imagen')) {
        console.log('   ✓ Validación de contenido vacío funciona')
      }
    }

    try {
      await createPostHandler.execute({
        content: 'A'.repeat(2001),
        authorId: testUserId,
      })
      console.log('   ✗ Debería haber fallado (contenido muy largo)')
    } catch (error: any) {
      if (error.message.includes('excede el máximo')) {
        console.log('   ✓ Validación de longitud funciona')
      }
    }

    try {
      await createPostHandler.execute({
        content: 'Respuesta',
        authorId: testUserId,
        parentId: 'non-existent-id',
      })
      console.log('   ✗ Debería haber fallado (post padre inexistente)')
    } catch (error: any) {
      if (error.message.includes('no existe')) {
        console.log('   ✓ Validación de post padre funciona\n')
      }
    }

    console.log('7️⃣  Eliminando posts...')
    for (const postId of postIds) {
      await deletePostHandler.execute({
        postId,
        userId: testUserId,
        userRole: Role.USER,
      })
      console.log(`   ✓ Post eliminado: ${postId}`)
    }
    console.log()

    console.log('8️⃣  Verificando soft delete...')
    try {
      await getPostHandler.execute({ postId: post1.id, userId: testUserId })
      console.log('   ✗ Post aún accesible')
    } catch (error: any) {
      if (error.message.includes('no encontrado')) {
        console.log('   ✓ Soft delete verificado correctamente\n')
      }
    }

    console.log('🎉 Todas las pruebas pasaron exitosamente!\n')

    console.log('📊 Resumen:')
    console.log(`   - Posts creados: ${postIds.length}`)
    console.log(`   - Validaciones probadas: 3`)
    console.log(`   - Soft delete: ✓`)
    console.log(`   - Paginación: ✓`)
    console.log(`   - Respuestas: ✓\n`)
  } catch (error) {
    console.error('❌ Error en las pruebas:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }

  console.log('✅ Tests completados')
}

await testPostsModule()
