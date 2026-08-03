import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/auth-helpers'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

export const PATCH = withRoute('/api/v1/users/me/two-factor', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const body = await req.json()
  const { password, enable } = body ?? {}

  if (!password || typeof password !== 'string')
    return err('Password is required')
  if (typeof enable !== 'boolean')
    return err('enable must be a boolean')

  const user = await prisma.user.findUnique({ where: { id: authUser.id } })
  if (!user) return err('User not found', 404)

  const match = await comparePassword(password, user.passwordHash)
  if (!match) return err('Incorrect password', 401)

  if (user.twoFactorEnabled === enable)
    return ok(
      { twoFactorEnabled: user.twoFactorEnabled },
      `Two-factor authentication is already ${enable ? 'enabled' : 'disabled'}`,
    )

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: enable },
  })

  const action = enable ? 'enabled' : 'disabled'
  return ok({ twoFactorEnabled: updated.twoFactorEnabled }, `Two-factor authentication ${action}`)
})
