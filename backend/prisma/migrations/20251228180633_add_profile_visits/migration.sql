-- CreateTable
CREATE TABLE "public"."ProfileVisit" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "visitedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProfileVisit_visitedId_idx" ON "public"."ProfileVisit"("visitedId");

-- AddForeignKey
ALTER TABLE "public"."ProfileVisit" ADD CONSTRAINT "ProfileVisit_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfileVisit" ADD CONSTRAINT "ProfileVisit_visitedId_fkey" FOREIGN KEY ("visitedId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
