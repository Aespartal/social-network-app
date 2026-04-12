-- CreateTable
CREATE TABLE "public"."recent_searches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recent_searches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recent_searches_userId_idx" ON "public"."recent_searches"("userId");

-- CreateIndex
CREATE INDEX "recent_searches_userId_createdAt_idx" ON "public"."recent_searches"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."recent_searches" ADD CONSTRAINT "recent_searches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
