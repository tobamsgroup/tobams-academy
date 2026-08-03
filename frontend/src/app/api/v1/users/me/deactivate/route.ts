import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/auth-helpers'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { sendAccountDeactivationEmail } from '@/lib/mail'

export const POST = withRoute('/api/v1/users/me/deactivate', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const body = await req.json()
  const { password, reason } = body ?? {}

  if (!password || typeof password !== 'string')
    return err('Password is required')
  if (!reason || typeof reason !== 'string' || reason.trim().length === 0)
    return err('A reason for deactivation is required')

  const user = await prisma.user.findUnique({ where: { id: authUser.id } })
  if (!user) return err('User not found', 404)

  if (!user.isActive)
    return err('Account is already deactivated', 409)

  const match = await comparePassword(password, user.passwordHash)
  if (!match) return err('Incorrect password', 401)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isActive: false,
      deactivatedAt: new Date(),
      deactivationReason: reason.trim(),
    },
  })

  await sendAccountDeactivationEmail(user.email, user.name)

  return ok(undefined, 'Account deactivated. You can reactivate it by logging in again.')
})
