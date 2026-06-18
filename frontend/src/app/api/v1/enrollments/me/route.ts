import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import {
  enrollmentInclude,
  getCourseLessonCount,
  syncLessonProgressForEnrollment,
  toEnrollmentSummary,
} from '@/lib/enrollment-utils'

export const GET = withRoute('/api/v1/enrollments/me', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: authUser.id },
    include: enrollmentInclude,
    orderBy: { enrolledAt: 'desc' },
  })

  const summaries = await Promise.all(
    enrollments.map(async (enrollment) => {
      await syncLessonProgressForEnrollment(enrollment.id, enrollment.courseId)

      const [totalLessons, refreshed] = await Promise.all([
        getCourseLessonCount(enrollment.courseId),
        prisma.enrollment.findUniqueOrThrow({
          where: { id: enrollment.id },
          include: enrollmentInclude,
        }),
      ])

      return toEnrollmentSummary(refreshed, totalLessons)
    }),
  )

  return ok(summaries)
})
