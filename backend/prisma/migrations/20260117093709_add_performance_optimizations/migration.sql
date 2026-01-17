-- AlterTable
ALTER TABLE "public"."posts" ADD COLUMN     "bookmarksCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "repliesCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "bookmarks_postId_userId_idx" ON "public"."bookmarks"("postId", "userId");

-- CreateIndex
CREATE INDEX "bookmarks_userId_createdAt_idx" ON "public"."bookmarks"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "likes_postId_userId_idx" ON "public"."likes"("postId", "userId");

-- CreateIndex
CREATE INDEX "likes_userId_createdAt_idx" ON "public"."likes"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "posts_authorId_createdAt_deletedAt_idx" ON "public"."posts"("authorId", "createdAt", "deletedAt");

-- CreateIndex
CREATE INDEX "posts_deletedAt_createdAt_idx" ON "public"."posts"("deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "posts_deletedAt_parentId_createdAt_idx" ON "public"."posts"("deletedAt", "parentId", "createdAt");

-- CreateIndex
CREATE INDEX "posts_deletedAt_createdAt_likesCount_idx" ON "public"."posts"("deletedAt", "createdAt", "likesCount");
