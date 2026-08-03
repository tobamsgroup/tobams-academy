import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import {
  enrollmentInclude,
  getCourseLessonCount,
  syncLessonProgressForEnrollment,
  toEnrollmentDetail,
} from '@/lib/enrollment-utils'

export const GET = withRoute(
  '/api/v1/enrollments/me/:courseId',
  async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    const authUser = getAuthUser(req)
    if (!authUser) return err('Unauthorized', 401)

    const { courseId } = (await params) ?? {}
    if (!courseId) return err('courseId is required', 400)

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: authUser.id, courseId } },
      include: enrollmentInclude,
    })

    if (!enrollment) return err('Not enrolled in this course', 404)

    await syncLessonProgressForEnrollment(enrollment.id, courseId)

    const [totalLessons, refreshed] = await Promise.all([
      getCourseLessonCount(courseId),
      prisma.enrollment.findUniqueOrThrow({
        where: { id: enrollment.id },
        include: enrollmentInclude,
      }),
    ])

    return ok(toEnrollmentDetail(refreshed, totalLessons))
  },
)
