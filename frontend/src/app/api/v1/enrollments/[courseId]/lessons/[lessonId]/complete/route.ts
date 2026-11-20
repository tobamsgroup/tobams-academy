import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { EXPIRED_MESSAGE, isAccessActive } from '@/lib/enrollment-access'
import { ASSIGNMENT_COMPLETION_MESSAGE, recordLessonCompletion } from '@/lib/lesson-completion'
import { LOCKED_LESSON_MESSAGE, isLessonLocked } from '@/lib/week-locks'

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
      select: { id: true, kind: true },
    })
    if (!lesson) return err('Lesson not found in this course', 404)
    // Assignments complete when the learner uploads their work (POST /lessons/:id/submission).
    if (lesson.kind === 'ASSIGNMENT') return err(ASSIGNMENT_COMPLETION_MESSAGE, 409)
    if (await isLessonLocked(user.id, lessonId)) return err(LOCKED_LESSON_MESSAGE, 403)

    return ok(await recordLessonCompletion({ userId: user.id, courseId, lessonId, enrollment }))
  },
)
