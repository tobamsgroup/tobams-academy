import { NextRequest } from 'next/server'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { getDashboardOverview } from '@/lib/dashboard'

/** GET /api/v1/dashboard/overview — data for the learner dashboard home. */
export const GET = withRoute('/api/v1/dashboard/overview', async (req: NextRequest) => {
  const user = getAuthUser(req)
  if (!user) return err('Unauthorized', 401)

  return ok(await getDashboardOverview(user.id))
})
