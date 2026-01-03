/*
  Warnings:

  - You are about to drop the `ProfileVisit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ProfileVisit" DROP CONSTRAINT "ProfileVisit_visitedId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProfileVisit" DROP CONSTRAINT "ProfileVisit_visitorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_userId_fkey";

-- AlterTable
ALTER TABLE "public"."posts" ADD COLUMN     "parentId" TEXT;

-- DropTable
DROP TABLE "public"."ProfileVisit";

-- DropTable
DROP TABLE "public"."Session";

-- DropTable
DROP TABLE "public"."comments";

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."profile_visits" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "visitedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "public"."sessions"("token");

-- CreateIndex
CREATE INDEX "profile_visits_visitedId_idx" ON "public"."profile_visits"("visitedId");

-- CreateIndex
CREATE INDEX "profile_visits_visitorId_idx" ON "public"."profile_visits"("visitorId");

-- CreateIndex
CREATE INDEX "posts_parentId_idx" ON "public"."posts"("parentId");

-- CreateIndex
CREATE INDEX "posts_authorId_idx" ON "public"."posts"("authorId");

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."profile_visits" ADD CONSTRAINT "profile_visits_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."profile_visits" ADD CONSTRAINT "profile_visits_visitedId_fkey" FOREIGN KEY ("visitedId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
