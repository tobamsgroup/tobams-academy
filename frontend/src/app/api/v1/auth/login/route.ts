import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/auth-helpers'
import { hashToken } from '@/lib/auth-helpers'
import { signTokens } from '@/lib/jwt'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { sendTwoFactorOtpEmail } from '@/lib/mail'

export const POST = withRoute('/api/v1/auth/login', async (req: NextRequest) => {
  const body = await req.json()
  const { email, password } = body ?? {}

  if (!email || !password) return err('Email and password are required')

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return err('Invalid credentials', 401)

  const match = await comparePassword(password, user.passwordHash)
  if (!match) return err('Invalid credentials', 401)

  if (!user.emailVerified)
    return err('Please verify your email before logging in', 401)

  // Auto-reactivate on login if account was previously deactivated
  if (!user.isActive) {
    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: true, deactivatedAt: null, deactivationReason: null },
    })
  }

  // If 2FA is enabled, send OTP and halt — tokens issued after verification
  if (user.twoFactorEnabled) {
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    const twoFactorOtpHash = hashToken(otp)
    const twoFactorOtpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorOtpHash, twoFactorOtpExpiry },
    })

    await sendTwoFactorOtpEmail(user.email, user.name, otp)

    return ok({ twoFactorRequired: true, userId: user.id }, 'Verification code sent to your email')
  }

  const tokens = signTokens(user.id, user.email, user.role)

  return ok(
    {
      ...tokens,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
    'Login successful',
  )
})
