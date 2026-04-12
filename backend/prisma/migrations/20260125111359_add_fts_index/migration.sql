-- Add tsvector column (generated)
ALTER TABLE "posts" ADD COLUMN "search_vector" tsvector 
GENERATED ALWAYS AS (to_tsvector('spanish', coalesce("content", ''))) STORED;

-- Create GIN index for full text search
CREATE INDEX "posts_search_vector_idx" ON "posts" USING GIN ("search_vector");

-- Optional: Trigram index for better partial matching (LIKE %term%)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "posts_content_trgm_idx" ON "posts" USING GIN ("content" gin_trgm_ops);