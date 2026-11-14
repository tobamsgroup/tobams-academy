import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashToken } from '@/lib/auth-helpers'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { notify } from '@/lib/notifications'

/**
 * POST /api/v1/auth/verify-email?token=...
 *
 * Idempotent: the token is kept after use, so opening the link again (a second click, the
 * page loading twice, or an email security scanner opening it before the user does) still
 * reports success instead of "invalid". Re-verifying an already verified account is harmless.
 */
export const POST = withRoute('/api/v1/auth/verify-email', async (req: NextRequest) => {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return err('Token is required')

  // Registration stores sha256(rawToken); the email link carries the raw token.
  const user = await prisma.user.findFirst({ where: { verifyTokenHash: hashToken(token) } })
  if (!user) return err('This verification link is invalid.', 401)

  if (user.emailVerified) return ok(undefined, 'Email already verified')

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  })

  await notify(user.id, {
    title: 'Email verified',
    message: 'Your email address has been verified. Your account is ready to use.',
    category: 'registrationSetup',
  })

  return ok(undefined, 'Email verified successfully')
})
