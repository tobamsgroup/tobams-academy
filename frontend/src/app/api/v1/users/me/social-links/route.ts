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

const SOCIAL_FIELDS = ['linkedinUrl', 'facebookUrl', 'instagramUrl', 'xUrl'] as const
type SocialField = (typeof SOCIAL_FIELDS)[number]

type SocialLinksUpdateData = Partial<Record<SocialField, string | null>>

function readUrl(body: Record<string, unknown>, key: SocialField) {
  if (!(key in body)) return { present: false as const }
  const value = body[key]
  if (value === null) return { present: true as const, value: null }
  if (typeof value !== 'string') return { invalid: true as const }
  const trimmed = value.trim()
  if (!trimmed) return { present: true as const, value: null }
  try {
    const u = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)
    return { present: true as const, value: u.toString() }
  } catch {
    return { invalid: true as const }
  }
}

export const PATCH = withRoute('/api/v1/users/me/social-links', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const body = (await req.json()) as Record<string, unknown>
  const data: SocialLinksUpdateData = {}

  for (const field of SOCIAL_FIELDS) {
    const result = readUrl(body, field)
    if ('invalid' in result) return err(`Invalid ${field}`)
    if (result.present) data[field] = result.value
  }

  if (Object.keys(data).length === 0)
    return err('No social links provided')

  const user = await prisma.user.update({
    where: { id: authUser.id },
    data: data as Prisma.UserUpdateInput,
  })

  return ok(safeUser(user as Record<string, unknown>), 'Social links updated')
})
