import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, hashToken } from '@/lib/auth-helpers'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

export const POST = withRoute('/api/v1/auth/reset-password', async (req: NextRequest) => {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return err('Token is required')

  const body = await req.json()
  const { password } = body ?? {}

  if (!password || typeof password !== 'string' || password.length < 8)
    return err('Password must be at least 8 characters')

  const tokenHash = hashToken(token)
  const user = await prisma.user.findFirst({
    where: { resetTokenHash: tokenHash, resetTokenExpiry: { gt: new Date() } },
  })
  if (!user) return err('Invalid or expired reset token', 401)

  const passwordHash = await hashPassword(password)
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetTokenHash: null, resetTokenExpiry: null },
  })

  return ok(undefined, 'Password reset successfully')
})
