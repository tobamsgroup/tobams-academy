import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/with-auth'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { toLessonCompleteResult, syncLessonProgressForEnrollment } from '@/lib/enrollment-utils'

export const POST = withRoute(
  '/api/v1/enrollments/:courseId/lessons/:lessonId/complete',
  async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    const authUser = getAuthUser(req)
    if (!authUser) return err('Unauthorized', 401)

    const { courseId, lessonId } = (await params) ?? {}
    if (!courseId || !lessonId) return err('courseId and lessonId are required', 400)

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: authUser.id, courseId } },
      include: { lessonProgress: true },
    })
    if (!enrollment) return err('Not enrolled in this course', 404)

    await syncLessonProgressForEnrollment(enrollment.id, courseId)

    const refreshedEnrollment = await prisma.enrollment.findUniqueOrThrow({
      where: { id: enrollment.id },
      include: { lessonProgress: true },
    })

    let progressRow = refreshedEnrollment.lessonProgress.find((row) => row.lessonId === lessonId)
    if (!progressRow) return err('Lesson not found in enrollment', 404)

    const now = new Date()

    if (!progressRow.completedAt) {
      await prisma.lessonProgress.update({
        where: { id: progressRow.id },
        data: { completedAt: now },
      })
    }

    const totalLessons = await prisma.lesson.count({
      where: { module: { courseId } },
    })

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        enrollmentId: refreshedEnrollment.id,
        completedAt: { not: null },
      },
    })

    const courseCompleted = totalLessons > 0 && completedLessons >= totalLessons

    await prisma.enrollment.update({
      where: { id: refreshedEnrollment.id },
      data: {
        lastAccessedAt: now,
        ...(courseCompleted && !refreshedEnrollment.completedAt ? { completedAt: now } : {}),
      },
    })

    return ok(
      toLessonCompleteResult(
        lessonId,
        progressRow.completedAt ?? now,
        completedLessons,
        totalLessons,
        courseCompleted,
      ),
      courseCompleted ? 'Course completed' : 'Lesson marked complete',
    )
  },
)
