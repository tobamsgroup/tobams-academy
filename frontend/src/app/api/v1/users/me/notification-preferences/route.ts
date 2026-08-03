import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

const PREF_KEYS = [
  'registrationSetupEmail',
  'registrationSetupInApp',
  'enrollmentConfirmEmail',
  'enrollmentConfirmInApp',
  'courseUpdatesEmail',
  'courseUpdatesInApp',
  'assessmentRemindersEmail',
  'assessmentRemindersInApp',
  'progressTrackingEmail',
  'progressTrackingInApp',
  'certificationAlertsEmail',
  'certificationAlertsInApp',
  'engagementPromptsEmail',
  'engagementPromptsInApp',
] as const

type PrefKey = (typeof PREF_KEYS)[number]

function stripMeta(prefs: Record<string, unknown>) {
  return Object.fromEntries(PREF_KEYS.map((k) => [k, prefs[k]]))
}

export const GET = withRoute('/api/v1/users/me/notification-preferences', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const prefs = await prisma.notificationPreference.upsert({
    where: { userId: authUser.id },
    update: {},
    create: { userId: authUser.id },
  })

  return ok(stripMeta(prefs as unknown as Record<string, unknown>))
})

export const PATCH = withRoute('/api/v1/users/me/notification-preferences', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const body = await req.json()
  if (!body || typeof body !== 'object' || Array.isArray(body))
    return err('Request body must be a JSON object')

  const data: Partial<Record<PrefKey, boolean>> = {}

  for (const [key, value] of Object.entries(body)) {
    if (!PREF_KEYS.includes(key as PrefKey))
      return err(`Unknown preference key: ${key}`)
    if (typeof value !== 'boolean')
      return err(`Value for "${key}" must be a boolean`)
    data[key as PrefKey] = value
  }

  if (Object.keys(data).length === 0)
    return err('No preference fields provided')

  const prefs = await prisma.notificationPreference.upsert({
    where: { userId: authUser.id },
    update: data,
    create: { userId: authUser.id, ...data },
  })

  return ok(stripMeta(prefs as unknown as Record<string, unknown>), 'Preferences updated')
})
