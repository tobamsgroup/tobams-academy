import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'

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

  return { progress, completedLessonIds }
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
    })
    if (!enrollment) return err('Not enrolled in this course', 403)

    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId, module: { courseId } },
      select: { id: true },
    })
    if (!lesson) return err('Lesson not found in this course', 404)

    await prisma.lessonProgress.upsert({
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
    if (result.progress === 100 && !enrollment.completedAt) {
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { completedAt: new Date() },
      })
    }

    return ok(result)
  },
)
