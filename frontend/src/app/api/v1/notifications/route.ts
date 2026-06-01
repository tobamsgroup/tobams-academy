import { NextRequest } from 'next/server'
import { notificationDb } from '@/lib/prisma'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

export const GET = withRoute('/api/v1/notifications', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const items = await notificationDb.findMany({
    where: { userId: authUser.id },
    orderBy: { createdAt: 'desc' },
  })

  return ok(items)
})

export const DELETE = withRoute('/api/v1/notifications', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err('Request body must be valid JSON')
  }

  const ids = (body as { ids?: unknown })?.ids
  if (!Array.isArray(ids) || ids.length === 0)
    return err('ids must be a non-empty array')

  if (!ids.every((id) => typeof id === 'string'))
    return err('ids must be strings')

  const result = await notificationDb.deleteMany({
    where: { id: { in: ids as string[] }, userId: authUser.id },
  })

  return ok({ deleted: result.count }, `${result.count} notification(s) deleted`)
})
