import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import {
  getCourseProgressForEnrollment,
  syncLessonProgressForEnrollment,
} from '@/lib/enrollment-utils'

export const GET = withRoute(
  '/api/v1/enrollments/[courseId]/progress',
  async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    const user = getAuthUser(req)
    if (!user) return err('Unauthorized', 401)

    const { courseId } = (await params) ?? {}
    if (!courseId) return err('courseId is required')

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
      select: { id: true, completedAt: true },
    })
    if (!enrollment) return err('Not enrolled in this course', 403)

    await syncLessonProgressForEnrollment(enrollment.id, courseId)

    const { progress, completedLessonIds, totalLessons } = await getCourseProgressForEnrollment(
      enrollment.id,
      courseId,
      enrollment.completedAt,
    )

    return ok({ progress, completedLessonIds, totalLessons })
  },
)
