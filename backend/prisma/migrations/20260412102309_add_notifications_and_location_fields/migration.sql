/*
  Warnings:

  - You are about to drop the column `search_vector` on the `posts` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('LIKE', 'REPLY', 'FOLLOW', 'MENTION');

-- DropIndex
DROP INDEX "public"."posts_content_trgm_idx";

-- DropIndex
DROP INDEX "public"."posts_search_vector_idx";

-- AlterTable
ALTER TABLE "public"."posts" DROP COLUMN "search_vector",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT;

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "recipientId" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "postId" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_recipientId_idx" ON "public"."notifications"("recipientId");

-- CreateIndex
CREATE INDEX "notifications_recipientId_read_idx" ON "public"."notifications"("recipientId", "read");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "public"."notifications"("createdAt");

-- CreateIndex
CREATE INDEX "posts_country_deletedAt_createdAt_idx" ON "public"."posts"("country", "deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "posts_city_deletedAt_createdAt_idx" ON "public"."posts"("city", "deletedAt", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
