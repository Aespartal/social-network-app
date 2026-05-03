-- Add GIN index for full-text search
CREATE INDEX IF NOT EXISTS "posts_search_vector_idx" ON "public"."posts" USING GIN ("search_vector");

-- Populate search_vector for existing posts
UPDATE "public"."posts"
SET "search_vector" = to_tsvector('spanish', COALESCE("content", ''))
WHERE "search_vector" IS NULL;