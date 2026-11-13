import type { NotificationType } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * Preference categories from the NotificationPreference model. Each has an
 * `<category>InApp` flag the user can switch off in Settings → Notifications.
 */
export type NotificationCategory =
  | 'registrationSetup'
  | 'enrollmentConfirm'
  | 'courseUpdates'
  | 'assessmentReminders'
  | 'progressTracking'
  | 'certificationAlerts'
  | 'engagementPrompts'

interface NotifyInput {
  title: string
  message: string
  type?: NotificationType
  /**
   * Preference the user can opt out of. Omit for notifications that must always be
   * delivered, such as security alerts and payment receipts.
   */
  category?: NotificationCategory
}

async function isInAppEnabled(userId: string, category: NotificationCategory): Promise<boolean> {
  const prefs = await prisma.notificationPreference.findUnique({ where: { userId } })
  // No preferences saved yet: every in-app category defaults to on.
  if (!prefs) return true
  return prefs[`${category}InApp`] !== false
}

/**
 * Create an in-app notification for a user. Never throws: a failed notification must
 * not fail the action that triggered it, so errors are logged instead.
 */
export async function notify(userId: string, input: NotifyInput): Promise<void> {
  try {
    if (input.category && !(await isInAppEnabled(userId, input.category))) return

    await prisma.notification.create({
      data: {
        userId,
        title: input.title,
        message: input.message,
        type: input.type ?? 'SYSTEM',
      },
    })
  } catch (error) {
    logger.error('Failed to create notification', {
      userId,
      title: input.title,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
