-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deactivatedAt" TIMESTAMP(3),
ADD COLUMN     "deactivationReason" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorOtpExpiry" TIMESTAMP(3),
ADD COLUMN     "twoFactorOtpHash" TEXT;

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "registrationSetupEmail" BOOLEAN NOT NULL DEFAULT true,
    "registrationSetupInApp" BOOLEAN NOT NULL DEFAULT true,
    "enrollmentConfirmEmail" BOOLEAN NOT NULL DEFAULT true,
    "enrollmentConfirmInApp" BOOLEAN NOT NULL DEFAULT true,
    "courseUpdatesEmail" BOOLEAN NOT NULL DEFAULT true,
    "courseUpdatesInApp" BOOLEAN NOT NULL DEFAULT true,
    "assessmentRemindersEmail" BOOLEAN NOT NULL DEFAULT false,
    "assessmentRemindersInApp" BOOLEAN NOT NULL DEFAULT true,
    "progressTrackingEmail" BOOLEAN NOT NULL DEFAULT false,
    "progressTrackingInApp" BOOLEAN NOT NULL DEFAULT true,
    "certificationAlertsEmail" BOOLEAN NOT NULL DEFAULT true,
    "certificationAlertsInApp" BOOLEAN NOT NULL DEFAULT true,
    "engagementPromptsEmail" BOOLEAN NOT NULL DEFAULT true,
    "engagementPromptsInApp" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_key" ON "notification_preferences"("userId");

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
