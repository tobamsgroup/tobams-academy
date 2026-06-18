import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { computeEnrollmentStats, enrollmentStatsInclude } from '@/lib/enrollment-utils'

export const GET = withRoute('/api/v1/enrollments/me/stats', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: authUser.id },
    select: {
      completedAt: true,
      ...enrollmentStatsInclude,
    },
  })

  return ok(computeEnrollmentStats(enrollments))
})
