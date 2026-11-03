-- AlterTable: optional early-bird price for paid courses
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "earlyBirdPrice" DECIMAL(10,2);
