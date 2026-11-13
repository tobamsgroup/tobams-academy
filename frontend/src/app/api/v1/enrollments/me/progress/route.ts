import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getLearningProgress } from '@/lib/learning-progress'

/**
 * GET /api/v1/enrollments/me/progress            → progress for every enrolled course
 * GET /api/v1/enrollments/me/progress?courseId=… → progress for one course (404 if not enrolled)
 */
export const GET = withRoute('/api/v1/enrollments/me/progress', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const courseId = req.nextUrl.searchParams.get('courseId') ?? undefined
  const progress = await getLearningProgress(authUser.id, courseId)

  if (courseId) {
    if (progress.length === 0) return err('Not enrolled in this course', 404)
    return ok(progress[0])
  }
  return ok(progress)
})
