import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'

export const GET = withRoute('/api/v1/enrollments/me/stats', async (req: NextRequest) => {
  const user = getAuthUser(req)
  if (!user) return err('Unauthorized', 401)

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        select: {
          modules: {
            include: { lessons: { select: { id: true, duration: true } } },
          },
        },
      },
      lessonProgress: { select: { lessonId: true } },
    },
  })

  let totalLearningMinutes = 0
  let totalProgress = 0

  for (const enrollment of enrollments) {
    const allLessons = enrollment.course.modules.flatMap((m) => m.lessons)
    const totalLessons = allLessons.length
    const completedCount = enrollment.lessonProgress.length
    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
    totalProgress += progress

    // Sum minutes only for completed lessons
    const completedIds = new Set(enrollment.lessonProgress.map((lp) => lp.lessonId))
    for (const lesson of allLessons) {
      if (completedIds.has(lesson.id) && lesson.duration) {
        totalLearningMinutes += lesson.duration
      }
    }
  }

  const total = enrollments.length
  const coursesInProgress = enrollments.filter((e) => {
    const allLessons = e.course.modules.flatMap((m) => m.lessons)
    const progress = allLessons.length > 0
      ? Math.round((e.lessonProgress.length / allLessons.length) * 100)
      : 0
    return progress < 100
  }).length

  const averageProgress = total > 0 ? Math.round(totalProgress / total) : 0

  return ok({ coursesInProgress, totalLearningMinutes, averageProgress })
})
