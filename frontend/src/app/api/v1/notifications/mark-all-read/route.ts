import { NextRequest } from 'next/server'
import { notificationDb } from '@/lib/prisma'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

export const PATCH = withRoute(
  '/api/v1/notifications/mark-all-read',
  async (req: NextRequest) => {
    const authUser = getAuthUser(req)
    if (!authUser) return err('Unauthorized', 401)

    const result = await notificationDb.updateMany({
      where: { userId: authUser.id, isRead: false },
      data: { isRead: true },
    })

    return ok({ updated: result.count }, `${result.count} notification(s) marked as read`)
  },
)
