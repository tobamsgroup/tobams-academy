import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

function safeUser(user: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, verifyTokenHash, resetTokenHash, resetTokenExpiry, ...safe } = user
  return safe
}

export const GET = withRoute('/api/v1/users/me', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const user = await prisma.user.findUnique({ where: { id: authUser.id } })
  if (!user) return err('User not found', 404)

  return ok(safeUser(user as Record<string, unknown>))
})

export const PATCH = withRoute('/api/v1/users/me', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const body = await req.json()
  const { name } = body ?? {}

  if (!name || typeof name !== 'string' || name.trim().length === 0)
    return err('Name is required')

  const user = await prisma.user.update({
    where: { id: authUser.id },
    data: { name: name.trim() },
  })

  return ok(safeUser(user as Record<string, unknown>), 'Profile updated')
})
