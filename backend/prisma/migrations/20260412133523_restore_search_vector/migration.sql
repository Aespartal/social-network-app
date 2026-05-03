-- Add search_vector column to posts table
ALTER TABLE "public"."posts" ADD COLUMN "search_vector" tsvector;