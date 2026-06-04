import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashToken } from '@/lib/auth-helpers'
import { signTokens } from '@/lib/jwt'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

export const POST = withRoute('/api/v1/auth/verify-2fa', async (req: NextRequest) => {
  const body = await req.json()
  const { userId, otp } = body ?? {}

  if (!userId || typeof userId !== 'string') return err('userId is required')
  if (!otp || typeof otp !== 'string') return err('otp is required')

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return err('Invalid request', 401)

  if (!user.twoFactorOtpHash || !user.twoFactorOtpExpiry)
    return err('No pending 2FA verification. Please log in again.', 401)

  if (user.twoFactorOtpExpiry < new Date())
    return err('Verification code has expired. Please log in again.', 401)

  const otpHash = hashToken(otp)
  if (otpHash !== user.twoFactorOtpHash)
    return err('Invalid verification code', 401)

  // OTP consumed — clear it and issue tokens
  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorOtpHash: null, twoFactorOtpExpiry: null },
  })

  const tokens = signTokens(user.id, user.email, user.role)

  return ok(
    {
      ...tokens,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
    'Login successful',
  )
})
