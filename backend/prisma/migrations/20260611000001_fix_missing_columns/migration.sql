-- AlterTable: rename notification_preferences columns + fix defaults
ALTER TABLE "notification_preferences"
  DROP COLUMN IF EXISTS "enrollmentConfirmationEmail",
  DROP COLUMN IF EXISTS "enrollmentConfirmationInApp",
  ADD COLUMN IF NOT EXISTS "enrollmentConfirmEmail" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "enrollmentConfirmInApp" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "registrationSetupInApp" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "notification_preferences"
  ALTER COLUMN "assessmentRemindersEmail" SET DEFAULT false,
  ALTER COLUMN "progressTrackingEmail" SET DEFAULT false;

-- AlterTable: add missing columns to users
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "twoFactorOtpExpiry" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "twoFactorOtpHash" TEXT;
