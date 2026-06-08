import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import {
  NOTIFICATION_PREFERENCE_FIELDS,
  defaultNotificationPreferences,
  toPreferencePayload,
  type NotificationPreferenceField,
} from '@/lib/notification-preferences'

function omitMeta(record: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, userId, createdAt, updatedAt, ...prefs } = record
  return toPreferencePayload(prefs)
}

async function getOrCreatePreferences(userId: string) {
  const existing = await prisma.notificationPreference.findUnique({ where: { userId } })
  if (existing) return existing

  return prisma.notificationPreference.create({
    data: { userId, ...defaultNotificationPreferences() },
  })
}

export const GET = withRoute('/api/v1/users/me/notification-preferences', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const prefs = await getOrCreatePreferences(authUser.id)
  return ok(omitMeta(prefs as Record<string, unknown>))
})

export const PATCH = withRoute('/api/v1/users/me/notification-preferences', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const body = (await req.json()) as Record<string, unknown>
  const data: Partial<Record<NotificationPreferenceField, boolean>> = {}

  for (const field of NOTIFICATION_PREFERENCE_FIELDS) {
    if (!(field in body)) continue
    const value = body[field]
    if (typeof value !== 'boolean') return err(`${field} must be a boolean`)
    data[field] = value
  }

  if (Object.keys(data).length === 0)
    return err('No notification preferences provided')

  await getOrCreatePreferences(authUser.id)

  const updated = await prisma.notificationPreference.update({
    where: { userId: authUser.id },
    data,
  })

  return ok(omitMeta(updated as Record<string, unknown>), 'Notification preferences updated')
})
