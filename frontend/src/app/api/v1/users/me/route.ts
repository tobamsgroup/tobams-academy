import { NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'
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

const PROFILE_TEXT_FIELDS = ['phone', 'bio', 'avatarUrl'] as const
type ProfileTextField = (typeof PROFILE_TEXT_FIELDS)[number]
type ProfileUpdateData = Partial<Record<ProfileTextField, string | null>> & { name?: string }

function readNullableString(body: Record<string, unknown>, key: ProfileTextField) {
  if (!(key in body)) return { present: false as const }
  const value = body[key]
  if (value === null) return { present: true as const, value: null }
  if (typeof value !== 'string') return { invalid: true as const }
  return { present: true as const, value: value.trim() || null }
}

export const PATCH = withRoute('/api/v1/users/me', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const body = (await req.json()) as Record<string, unknown>
  const data: ProfileUpdateData = {}

  if ('name' in body) {
    const { name } = body
    if (typeof name !== 'string' || name.trim().length === 0)
      return err('Name cannot be empty')
    data.name = name.trim()
  }

  for (const field of PROFILE_TEXT_FIELDS) {
    const result = readNullableString(body, field)
    if ('invalid' in result) return err(`Invalid ${field}`)
    if (result.present) data[field] = result.value
  }

  if (Object.keys(data).length === 0)
    return err('No supported fields to update')

  const user = await prisma.user.update({
    where: { id: authUser.id },
    data: data as Prisma.UserUpdateInput,
  })

  return ok(safeUser(user as Record<string, unknown>), 'Profile updated')
})
