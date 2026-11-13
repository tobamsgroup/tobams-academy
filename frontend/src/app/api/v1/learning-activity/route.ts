import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'

/** Heartbeats arrive about every 30s; anything larger is clamped so time can't be inflated. */
const MAX_SECONDS_PER_HEARTBEAT = 90

function utcDay(date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

/**
 * POST /api/v1/learning-activity  { lessonId, seconds }
 * Records time a learner actively spent with a lesson open (tab visible).
 */
export const POST = withRoute('/api/v1/learning-activity', async (req: NextRequest) => {
  const user = getAuthUser(req)
  if (!user) return err('Unauthorized', 401)

  const body = await req.json().catch(() => null)
  const lessonId = body?.lessonId
  const rawSeconds = Number(body?.seconds)
  if (typeof lessonId !== 'string' || !lessonId) return err('lessonId is required')
  if (!Number.isFinite(rawSeconds) || rawSeconds <= 0) return err('seconds must be a positive number')
  const seconds = Math.min(Math.round(rawSeconds), MAX_SECONDS_PER_HEARTBEAT)

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { module: { select: { courseId: true } } },
  })
  if (!lesson) return err('Lesson not found', 404)
  const courseId = lesson.module.courseId

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } },
    select: { id: true },
  })
  if (!enrollment) return err('Not enrolled in this course', 403)

  const day = utcDay()
  await prisma.$transaction([
    prisma.learningActivity.upsert({
      where: { userId_lessonId_day: { userId: user.id, lessonId, day } },
      update: { seconds: { increment: seconds } },
      create: { userId: user.id, courseId, lessonId, day, seconds },
    }),
    prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { lastAccessedAt: new Date() },
    }),
  ])

  return ok({ recorded: seconds })
})
