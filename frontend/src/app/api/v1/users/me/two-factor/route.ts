import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/auth-helpers'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

function safeUser(user: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, verifyTokenHash, resetTokenHash, resetTokenExpiry, ...safe } = user
  return safe
}

export const PATCH = withRoute('/api/v1/users/me/two-factor', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const body = (await req.json()) as Record<string, unknown>
  const { password, enable } = body ?? {}

  if (!password || typeof password !== 'string')
    return err('Password is required')
  if (typeof enable !== 'boolean')
    return err('enable must be a boolean')

  const user = await prisma.user.findUnique({ where: { id: authUser.id } })
  if (!user) return err('User not found', 404)

  const match = await comparePassword(password, user.passwordHash)
  if (!match) return err('Incorrect password', 401)

  if (enable === user.twoFactorEnabled)
    return err(enable ? 'Two-factor authentication is already enabled' : 'Two-factor authentication is already disabled')

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: enable },
  })

  const message = enable
    ? 'Two-factor authentication activated'
    : 'Two-factor authentication deactivated'

  return ok(safeUser(updated as Record<string, unknown>), message)
})
