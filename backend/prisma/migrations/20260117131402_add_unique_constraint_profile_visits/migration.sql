/*
  Warnings:

  - A unique constraint covering the columns `[visitorId,visitedId]` on the table `profile_visits` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "profile_visits_visitorId_visitedId_key" ON "public"."profile_visits"("visitorId", "visitedId");
