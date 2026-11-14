import { randomInt } from 'node:crypto'
import { prisma } from '@/lib/prisma'
import { hashToken } from '@/lib/auth-helpers'
import { sendTwoFactorOtpEmail } from '@/lib/mail'

export const OTP_TTL_MS = 10 * 60 * 1000
/** Don't email a new code if one was sent this recently (stops inbox flooding). */
export const OTP_RESEND_COOLDOWN_MS = 30 * 1000
/** Wrong guesses allowed per code before it is cancelled. */
export const OTP_MAX_ATTEMPTS = 5

type TwoFactorUser = {
  id: string
  email: string
  name: string
  twoFactorOtpHash: string | null
  twoFactorOtpExpiry: Date | null
  twoFactorOtpAttempts: number
}

/** Email a fresh 6-digit sign-in code, unless one was just sent. Returns whether it emailed. */
export async function issueSignInCode(user: TwoFactorUser, now = new Date()): Promise<boolean> {
  const issuedAt = user.twoFactorOtpExpiry ? user.twoFactorOtpExpiry.getTime() - OTP_TTL_MS : 0
  if (user.twoFactorOtpHash && now.getTime() - issuedAt < OTP_RESEND_COOLDOWN_MS) return false

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
  await prisma.user.update({
    where: { id: user.id },
    data: {
      twoFactorOtpHash: hashToken(code),
      twoFactorOtpExpiry: new Date(now.getTime() + OTP_TTL_MS),
      twoFactorOtpAttempts: 0,
    },
  })
  await sendTwoFactorOtpEmail(user.email, user.name, code)
  return true
}

export type CodeCheck = 'ok' | 'invalid' | 'expired'

/**
 * Check a submitted sign-in code. A correct code is consumed; wrong codes count towards
 * OTP_MAX_ATTEMPTS, after which the code is cancelled ('expired') and a new one is needed.
 */
export async function verifySignInCode(user: TwoFactorUser, code: string, now = new Date()): Promise<CodeCheck> {
  if (!user.twoFactorOtpHash || !user.twoFactorOtpExpiry || user.twoFactorOtpExpiry <= now) return 'expired'
  if (user.twoFactorOtpAttempts >= OTP_MAX_ATTEMPTS) return 'expired'

  if (hashToken(code.trim()) !== user.twoFactorOtpHash) {
    const attempts = user.twoFactorOtpAttempts + 1
    await prisma.user.update({
      where: { id: user.id },
      data:
        attempts >= OTP_MAX_ATTEMPTS
          ? { twoFactorOtpHash: null, twoFactorOtpExpiry: null, twoFactorOtpAttempts: 0 }
          : { twoFactorOtpAttempts: attempts },
    })
    return attempts >= OTP_MAX_ATTEMPTS ? 'expired' : 'invalid'
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorOtpHash: null, twoFactorOtpExpiry: null, twoFactorOtpAttempts: 0 },
  })
  return 'ok'
}
