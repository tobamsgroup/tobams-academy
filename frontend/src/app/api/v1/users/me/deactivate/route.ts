import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/auth-helpers'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

export const POST = withRoute('/api/v1/users/me/deactivate', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const body = (await req.json()) as Record<string, unknown>
  const { password, reason } = body ?? {}

  if (!password || typeof password !== 'string')
    return err('Password is required')
  if (!reason || typeof reason !== 'string' || reason.trim().length === 0)
    return err('Reason is required')

  const user = await prisma.user.findUnique({ where: { id: authUser.id } })
  if (!user) return err('User not found', 404)

  if (user.deactivatedAt)
    return err('Account is already deactivated')

  const match = await comparePassword(password, user.passwordHash)
  if (!match) return err('Incorrect password', 401)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      deactivatedAt: new Date(),
      deactivationReason: reason.trim(),
    },
  })

  return ok(undefined, 'Account deactivated successfully')
})
