import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'

export const GET = withRoute(
  '/api/v1/enrollments/[courseId]/progress',
  async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    const user = getAuthUser(req)
    if (!user) return err('Unauthorized', 401)

    const { courseId } = (await params) ?? {}
    if (!courseId) return err('courseId is required')

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
      include: { lessonProgress: { select: { lessonId: true } } },
    })
    if (!enrollment) return err('Not enrolled in this course', 403)

    const allLessons = await prisma.lesson.findMany({
      where: { module: { courseId } },
      select: { id: true },
    })

    const total = allLessons.length
    const completedLessonIds = enrollment.lessonProgress.map((lp) => lp.lessonId)
    const progress = total > 0 ? Math.round((completedLessonIds.length / total) * 100) : 0

    return ok({ progress, completedLessonIds })
  },
)
