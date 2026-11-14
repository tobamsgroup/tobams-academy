import { randomInt, randomUUID } from 'node:crypto'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth-helpers'
import { normalizeEmail } from '@/lib/email'
import { grantAccess } from '@/lib/enrollment-access'
import { sendCourseEnrollmentEmail } from '@/lib/mail'
import { notify } from '@/lib/notifications'
import { isStrongPassword } from '@/lib/password-rules'

export const MAX_ADMIN_ENROLLMENTS = 200
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type EnrollTarget = { email: string; name?: string }

export type EnrollOutcome =
  | { email: string; status: 'created' | 'enrolled' | 'renewed'; expiresAt: string }
  | { email: string; status: 'failed'; reason: string }

/** A temporary password that satisfies the app's password rules (letters, digit, symbol). */
export function generateTemporaryPassword(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz' // no look-alikes (I, l, O, 0)
  const digits = '23456789'
  const symbols = '!@#$%&*?'
  const pick = (set: string) => set[randomInt(0, set.length)]
  for (;;) {
    const chars = [
      ...Array.from({ length: 8 }, () => pick(letters)),
      pick(digits),
      pick(digits),
      pick(symbols),
      pick(symbols),
    ]
    for (let i = chars.length - 1; i > 0; i--) {
      const j = randomInt(0, i + 1)
      ;[chars[i], chars[j]] = [chars[j], chars[i]]
    }
    const password = chars.join('')
    if (isStrongPassword(password)) return password
  }
}

/** "jane.doe@x.com" → "Jane Doe" (used when no name is supplied). */
export function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'Learner'
  const words = local.split(/[._\-+]+/).filter(Boolean)
  return words.length ? words.map((w) => w[0].toUpperCase() + w.slice(1)).join(' ') : 'Learner'
}

/** Validate and de-duplicate input; returns targets plus per-email validation failures. */
export function parseTargets(input: unknown): { targets: EnrollTarget[]; invalid: EnrollOutcome[] } {
  const targets: EnrollTarget[] = []
  const invalid: EnrollOutcome[] = []
  const seen = new Set<string>()
  for (const item of Array.isArray(input) ? input : []) {
    const rawEmail = typeof item === 'string' ? item : (item as EnrollTarget | null)?.email
    const rawName = typeof item === 'object' && item ? (item as EnrollTarget).name : undefined
    if (typeof rawEmail !== 'string' || !EMAIL_PATTERN.test(rawEmail.trim())) {
      invalid.push({ email: String(rawEmail ?? ''), status: 'failed', reason: 'Not a valid email address' })
      continue
    }
    const email = normalizeEmail(rawEmail)
    if (seen.has(email)) continue
    seen.add(email)
    const name = typeof rawName === 'string' && rawName.trim() ? rawName.trim().slice(0, 100) : undefined
    targets.push({ email, name })
  }
  return { targets, invalid }
}

/**
 * Enroll people in a course without payment. New emails get an account (verified, with a
 * temporary password in the email); existing accounts keep their password. Access runs for
 * the standard period from now (renewing it if they were already enrolled).
 */
export async function adminEnroll(
  course: { id: string; slug: string; title: string },
  target: EnrollTarget,
): Promise<EnrollOutcome> {
  try {
    const existing = await prisma.user.findUnique({ where: { email: target.email } })
    let temporaryPassword: string | undefined
    let user = existing

    if (!user) {
      temporaryPassword = generateTemporaryPassword()
      user = await prisma.user.create({
        data: {
          email: target.email,
          name: target.name ?? nameFromEmail(target.email),
          passwordHash: await hashPassword(temporaryPassword),
          // The address is the one the organiser enrolled, and the temporary password is
          // sent to it, so receiving it is proof of ownership.
          emailVerified: true,
        },
      })
    }

    const previous = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
      select: { id: true },
    })

    const expiresAt = await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          userId: user.id,
          courseId: course.id,
          amount: 0,
          status: 'COMPLETED',
          reference: `ADMIN-${randomUUID()}`,
          paymentMethod: 'Complimentary enrollment',
        },
      })
      return grantAccess(tx, user.id, [course.id])
    })

    await sendCourseEnrollmentEmail({
      to: user.email,
      name: user.name,
      courseTitle: course.title,
      courseSlug: course.slug,
      expiresAt,
      temporaryPassword,
    })
    await notify(user.id, {
      type: 'ENROLLMENT',
      title: 'Enrollment confirmed',
      message: `You've been enrolled in "${course.title}". Access runs until ${expiresAt.toLocaleDateString('en-GB')}.`,
      category: 'enrollmentConfirm',
    })

    return {
      email: target.email,
      status: !existing ? 'created' : previous ? 'renewed' : 'enrolled',
      expiresAt: expiresAt.toISOString(),
    }
  } catch (error) {
    return {
      email: target.email,
      status: 'failed',
      reason: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
