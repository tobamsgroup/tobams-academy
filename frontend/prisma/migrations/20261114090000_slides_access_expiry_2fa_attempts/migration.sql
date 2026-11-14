-- AlterEnum
ALTER TYPE "LessonKind" ADD VALUE 'SLIDES';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "twoFactorOtpAttempts" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN     "expiresAt" TIMESTAMP(3);


-- Existing enrollments get the standard 180 days of access from when they enrolled.
UPDATE "enrollments" SET "expiresAt" = "enrolledAt" + INTERVAL '180 days' WHERE "expiresAt" IS NULL;
