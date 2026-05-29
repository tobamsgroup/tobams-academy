import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

const SOCIAL_KEYS = ['linkedinUrl', 'facebookUrl', 'instagramUrl', 'xUrl'] as const
type SocialKey = (typeof SOCIAL_KEYS)[number]

export const PATCH = withRoute('/api/v1/users/me/social-links', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const body = await req.json()
  if (!body || typeof body !== 'object') return err('Request body is required')

  const data: Partial<Record<SocialKey, string | null>> = {}

  for (const key of SOCIAL_KEYS) {
    if (key in body) {
      const val = body[key]
      if (val !== null && typeof val !== 'string') return err(`${key} must be a string or null`)
      data[key] = typeof val === 'string' ? val.trim() || null : null
    }
  }

  if (Object.keys(data).length === 0) return err('No social link fields provided')

  const user = await prisma.user.update({
    where: { id: authUser.id },
    data,
    select: {
      linkedinUrl: true,
      facebookUrl: true,
      instagramUrl: true,
      xUrl: true,
    },
  })

  return ok(user, 'Social links updated')
})
