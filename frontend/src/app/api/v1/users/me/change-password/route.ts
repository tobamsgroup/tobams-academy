import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, hashPassword } from '@/lib/auth-helpers'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

export const PATCH = withRoute('/api/v1/users/me/change-password', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const body = await req.json()
  const { currentPassword, newPassword } = body ?? {}

  if (!currentPassword || typeof currentPassword !== 'string')
    return err('Current password is required')
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8)
    return err('New password must be at least 8 characters')
  if (currentPassword === newPassword)
    return err('New password must differ from current password')

  const user = await prisma.user.findUnique({ where: { id: authUser.id } })
  if (!user) return err('User not found', 404)

  const match = await comparePassword(currentPassword, user.passwordHash)
  if (!match) return err('Current password is incorrect', 401)

  const passwordHash = await hashPassword(newPassword)
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } })

  return ok(undefined, 'Password updated successfully')
})
