import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

type FilterKey = 'all' | 'read' | 'unread'

export const GET = withRoute('/api/v1/notifications', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const filter = (req.nextUrl.searchParams.get('filter') ?? 'all') as FilterKey
  if (!['all', 'read', 'unread'].includes(filter)) return err('filter must be all, read, or unread')

  const where: Record<string, unknown> = { userId: authUser.id }
  if (filter === 'read') where.isRead = true
  if (filter === 'unread') where.isRead = false

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      message: true,
      type: true,
      isRead: true,
      createdAt: true,
    },
  })

  return ok(notifications)
})

export const DELETE = withRoute('/api/v1/notifications', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const body = await req.json()
  const { ids } = body ?? {}

  if (!Array.isArray(ids) || ids.length === 0) return err('ids must be a non-empty array')
  if (ids.some((id) => typeof id !== 'string')) return err('All ids must be strings')

  const { count } = await prisma.notification.deleteMany({
    where: { id: { in: ids }, userId: authUser.id },
  })

  return ok({ deleted: count }, `${count} notification${count === 1 ? '' : 's'} deleted`)
})
