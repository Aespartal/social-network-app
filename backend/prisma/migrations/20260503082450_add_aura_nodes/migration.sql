-- CreateEnum
CREATE TYPE "public"."AchievementCategory" AS ENUM ('onboarding', 'engagement', 'content', 'exploration');

-- CreateEnum
CREATE TYPE "public"."AchievementTierType" AS ENUM ('binary', 'milestone', 'progressive', 'streak');

-- CreateEnum
CREATE TYPE "public"."StreakType" AS ENUM ('login', 'post', 'engagement');

-- CreateEnum
CREATE TYPE "public"."BadgeRarity" AS ENUM ('common', 'rare', 'epic', 'legendary');

-- AlterEnum
ALTER TYPE "public"."NotificationType" ADD VALUE 'ACHIEVEMENT';

-- DropIndex
DROP INDEX "public"."posts_search_vector_idx";

-- AlterTable
ALTER TABLE "public"."notifications" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "public"."posts" ADD COLUMN     "readingTime" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "currentLevel" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "totalXP" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."aura_nodes" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "vibration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pulse" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastPulseAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tagId" TEXT,

    CONSTRAINT "aura_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_nodes" (
    "userId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_nodes_pkey" PRIMARY KEY ("userId","nodeId")
);

-- CreateTable
CREATE TABLE "public"."achievements" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "category" "public"."AchievementCategory" NOT NULL,
    "triggerEvent" TEXT NOT NULL,
    "tierType" "public"."AchievementTierType" NOT NULL,
    "iconEmoji" TEXT,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "announced" BOOLEAN NOT NULL DEFAULT true,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "badgeSlug" TEXT,
    "profileFrameSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."achievement_tiers" (
    "id" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "threshold" INTEGER NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "badgeSlug" TEXT,
    "profileFrameSlug" TEXT,
    "requiresTier" TEXT,

    CONSTRAINT "achievement_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_achievements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "tierAchieved" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_streaks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "streakType" "public"."StreakType" NOT NULL,
    "currentCount" INTEGER NOT NULL DEFAULT 0,
    "longestCount" INTEGER NOT NULL DEFAULT 0,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "freezeTokens" INTEGER NOT NULL DEFAULT 1,
    "streakShieldUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_streaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."badges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "iconUrl" TEXT,
    "rarity" "public"."BadgeRarity" NOT NULL DEFAULT 'common',

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."profile_frames" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "rarity" "public"."BadgeRarity" NOT NULL DEFAULT 'common',
    "requiresAchievementId" TEXT,

    CONSTRAINT "profile_frames_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "aura_nodes_slug_key" ON "public"."aura_nodes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "aura_nodes_tagId_key" ON "public"."aura_nodes"("tagId");

-- CreateIndex
CREATE INDEX "aura_nodes_vibration_idx" ON "public"."aura_nodes"("vibration");

-- CreateIndex
CREATE INDEX "aura_nodes_pulse_idx" ON "public"."aura_nodes"("pulse");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_slug_key" ON "public"."achievements"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "achievement_tiers_achievementId_tier_key" ON "public"."achievement_tiers"("achievementId", "tier");

-- CreateIndex
CREATE INDEX "user_achievements_userId_idx" ON "public"."user_achievements"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_achievements_userId_achievementId_tierAchieved_key" ON "public"."user_achievements"("userId", "achievementId", "tierAchieved");

-- CreateIndex
CREATE INDEX "user_streaks_userId_idx" ON "public"."user_streaks"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_streaks_userId_streakType_key" ON "public"."user_streaks"("userId", "streakType");

-- CreateIndex
CREATE UNIQUE INDEX "badges_slug_key" ON "public"."badges"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "profile_frames_slug_key" ON "public"."profile_frames"("slug");

-- AddForeignKey
ALTER TABLE "public"."aura_nodes" ADD CONSTRAINT "aura_nodes_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."tags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_nodes" ADD CONSTRAINT "user_nodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_nodes" ADD CONSTRAINT "user_nodes_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "public"."aura_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."achievement_tiers" ADD CONSTRAINT "achievement_tiers_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "public"."achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_achievements" ADD CONSTRAINT "user_achievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "public"."achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_achievements" ADD CONSTRAINT "user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_streaks" ADD CONSTRAINT "user_streaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
