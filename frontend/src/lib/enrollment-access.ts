import type { Prisma, PrismaClient } from '@prisma/client'

/** How long a purchase or enrollment gives access to a course. */
export const ACCESS_PERIOD_DAYS = 180

const DAY_MS = 24 * 60 * 60 * 1000

export function accessExpiresAt(from: Date = new Date()): Date {
  return new Date(from.getTime() + ACCESS_PERIOD_DAYS * DAY_MS)
}

/** Whether an enrollment still grants access. Null expiry means no limit. */
export function isAccessActive(
  enrollment: { expiresAt?: Date | string | null } | null | undefined,
  now = new Date(),
) {
  if (!enrollment) return false
  if (enrollment.expiresAt == null) return true
  return new Date(enrollment.expiresAt).getTime() > now.getTime()
}

/** Prisma filter for enrollments that still grant access. */
export function activeEnrollmentWhere(now = new Date()): Prisma.EnrollmentWhereInput {
  return { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }
}

type Db = Pick<PrismaClient, 'enrollment'> | Prisma.TransactionClient

/**
 * Enroll a user in courses, or renew expired/expiring access: access runs for
 * ACCESS_PERIOD_DAYS from now. Existing progress is kept when renewing.
 */
export async function grantAccess(db: Db, userId: string, courseIds: string[], now = new Date()) {
  const expiresAt = accessExpiresAt(now)
  for (const courseId of [...new Set(courseIds)]) {
    await db.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId, lastAccessedAt: now, expiresAt },
      update: { expiresAt },
    })
  }
  return expiresAt
}

export const EXPIRED_MESSAGE = 'Your access to this course has expired. Renew to continue learning.'
