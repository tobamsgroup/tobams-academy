import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

const SAFE_FIELDS = [
  'id', 'email', 'name', 'role', 'emailVerified',
  'phone', 'bio', 'avatarUrl',
  'linkedinUrl', 'facebookUrl', 'instagramUrl', 'xUrl',
  'twoFactorEnabled', 'isActive',
  'createdAt', 'updatedAt',
]

function safeUser(user: Record<string, unknown>) {
  return Object.fromEntries(
    SAFE_FIELDS.filter((k) => k in user).map((k) => [k, user[k]])
  )
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
  const { name, phone, bio, avatarUrl } = body ?? {}

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0))
    return err('Name must be a non-empty string')

  const data: Record<string, unknown> = {}
  if (name !== undefined) data.name = name.trim()
  if (phone !== undefined) data.phone = typeof phone === 'string' ? phone.trim() || null : null
  if (bio !== undefined) data.bio = typeof bio === 'string' ? bio.trim() || null : null
  if (avatarUrl !== undefined) data.avatarUrl = typeof avatarUrl === 'string' ? avatarUrl.trim() || null : null

  if (Object.keys(data).length === 0) return err('No fields provided')

  const user = await prisma.user.update({
    where: { id: authUser.id },
    data,
  })

  return ok(safeUser(user as Record<string, unknown>), 'Profile updated')
})
