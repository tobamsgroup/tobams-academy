import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashToken } from '@/lib/auth-helpers'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

export const POST = withRoute('/api/v1/auth/verify-email', async (req: NextRequest) => {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return err('Token is required')

  const user = await prisma.user.findFirst({ where: { verifyTokenHash: token } })
  if (!user) return err('Invalid or expired token', 401)

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, verifyTokenHash: null },
  })

  return ok(undefined, 'Email verified successfully')
})
