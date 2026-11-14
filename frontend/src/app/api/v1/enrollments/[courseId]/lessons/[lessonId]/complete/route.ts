import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { notify } from '@/lib/notifications'
import { toLessonCompleteResult } from '@/lib/enrollment-utils'
import { EXPIRED_MESSAGE, isAccessActive } from '@/lib/enrollment-access'

async function computeProgress(enrollmentId: string, courseId: string) {
  const [allLessons, lessonProgress] = await Promise.all([
    prisma.lesson.findMany({
      where: { module: { courseId } },
      select: { id: true },
    }),
    prisma.lessonProgress.findMany({
      where: { enrollmentId },
      select: { lessonId: true },
    }),
  ])

  const total = allLessons.length
  const completed = lessonProgress.length
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0
  const completedLessonIds = lessonProgress.map((lp) => lp.lessonId)

  return { progress, completedLessonIds, total }
}

export const POST = withRoute(
  '/api/v1/enrollments/[courseId]/lessons/[lessonId]/complete',
  async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    const user = getAuthUser(req)
    if (!user) return err('Unauthorized', 401)

    const { courseId, lessonId } = (await params) ?? {}
    if (!courseId || !lessonId) return err('courseId and lessonId are required')

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
      include: { course: { select: { title: true } } },
    })
    if (!enrollment) return err('Not enrolled in this course', 403)
    if (!isAccessActive(enrollment)) return err(EXPIRED_MESSAGE, 403)

    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId, module: { courseId } },
      select: { id: true },
    })
    if (!lesson) return err('Lesson not found in this course', 404)

    const alreadyCompleted = await prisma.lessonProgress.findUnique({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
      select: { id: true },
    })

    const row = await prisma.lessonProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
      update: {},
      create: { enrollmentId: enrollment.id, lessonId },
    })

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { lastAccessedAt: new Date() },
    })

    const result = await computeProgress(enrollment.id, courseId)

    // Mark enrollment as completed when progress reaches 100%
    const courseCompleted = result.progress === 100
    if (courseCompleted && !enrollment.completedAt) {
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { completedAt: new Date() },
      })
      await notify(user.id, {
        type: 'COURSE_UPDATE',
        title: 'Course completed',
        message: `Congratulations! You've completed "${enrollment.course.title}".`,
        category: 'progressTracking',
      })
    } else if (!alreadyCompleted && result.total > 0) {
      // Notify once, on the lesson that takes progress past the halfway mark.
      const before = Math.round(((result.completedLessonIds.length - 1) / result.total) * 100)
      if (before < 50 && result.progress >= 50) {
        await notify(user.id, {
          type: 'COURSE_UPDATE',
          title: 'Halfway there',
          message: `You're ${result.progress}% through "${enrollment.course.title}". Keep going!`,
          category: 'progressTracking',
        })
      }
    }

    // The client uses completedAt to keep the lesson ticked; without it the tick vanished
    // after the server replied (the "flaky" completion).
    return ok({
      ...toLessonCompleteResult(
        lessonId,
        row?.completedAt ?? new Date(),
        result.completedLessonIds.length,
        result.total,
        courseCompleted,
      ),
      completedLessonIds: result.completedLessonIds,
    })
  },
)
