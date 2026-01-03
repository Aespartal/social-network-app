/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "googleId" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "bookmarks_userId_idx" ON "public"."bookmarks"("userId");

-- CreateIndex
CREATE INDEX "bookmarks_postId_idx" ON "public"."bookmarks"("postId");

-- CreateIndex
CREATE INDEX "likes_userId_idx" ON "public"."likes"("userId");

-- CreateIndex
CREATE INDEX "likes_postId_idx" ON "public"."likes"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "public"."users"("googleId");
