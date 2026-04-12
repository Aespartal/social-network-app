import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Applying Notification Schema Changes Manually ---')

  try {
    // 1. Create NotificationType enum if it doesn't exist
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NotificationType') THEN
          CREATE TYPE "NotificationType" AS ENUM ('LIKE', 'REPLY', 'FOLLOW', 'MENTION');
        END IF;
      END
      $$;
    `)
    console.log('✅ NotificationType enum checked/created')

    // 2. Create Notifications table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" TEXT NOT NULL,
        "type" "NotificationType" NOT NULL,
        "recipientId" TEXT NOT NULL,
        "issuerId" TEXT NOT NULL,
        "postId" TEXT,
        "read" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
      );
    `)
    console.log('✅ notifications table checked/created')

    // 3. Add Foreign Keys
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "notifications" 
      DROP CONSTRAINT IF EXISTS "notifications_recipientId_fkey"
    `)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "notifications" 
      ADD CONSTRAINT "notifications_recipientId_fkey" 
      FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `)

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "notifications" 
      DROP CONSTRAINT IF EXISTS "notifications_issuerId_fkey"
    `)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "notifications" 
      ADD CONSTRAINT "notifications_issuerId_fkey" 
      FOREIGN KEY ("issuerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `)

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "notifications" 
      DROP CONSTRAINT IF EXISTS "notifications_postId_fkey"
    `)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "notifications" 
      ADD CONSTRAINT "notifications_postId_fkey" 
      FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE
    `)
    console.log('✅ Foreign keys applied')

    // 4. Create Indexes
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "notifications_recipientId_idx" ON "notifications"("recipientId")`)
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "notifications_recipientId_read_idx" ON "notifications"("recipientId", "read")`)
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "notifications_createdAt_idx" ON "notifications"("createdAt")`)
    console.log('✅ Indexes created')

    console.log('--- All changes applied successfully ---')
  } catch (error) {
    console.error('❌ Error applying manual schema changes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
