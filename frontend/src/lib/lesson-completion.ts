import { prisma } from '@/lib/prisma'
import { notify } from '@/lib/notifications'
import { toLessonCompleteResult } from '@/lib/enrollment-utils'
import { issueCertificate } from '@/lib/certificates'

/** Assignments complete only through an upload, never through "Mark as complete" or Next. */
export const ASSIGNMENT_COMPLETION_MESSAGE = 'Upload your assignment to complete this lesson'

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

type CompletionInput = {
  userId: string
  courseId: string
  lessonId: string
  enrollment: { id: string; completedAt: Date | null; course: { title: string } }
}

/**
 * Records a lesson as completed (idempotent), updates course completion and sends the
 * progress notifications. Returns the payload the player expects.
 */
export async function recordLessonCompletion({ userId, courseId, lessonId, enrollment }: CompletionInput) {
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
    await notify(userId, {
      type: 'COURSE_UPDATE',
      title: 'Course completed',
      message: `Congratulations! You've completed "${enrollment.course.title}".`,
      category: 'progressTracking',
    })
  }
  if (courseCompleted) {
    // Idempotent: issues and emails the certificate the first time the course is completed.
    await issueCertificate(enrollment.id)
  } else if (!alreadyCompleted && result.total > 0) {
    // Notify once, on the lesson that takes progress past the halfway mark.
    const before = Math.round(((result.completedLessonIds.length - 1) / result.total) * 100)
    if (before < 50 && result.progress >= 50) {
      await notify(userId, {
        type: 'COURSE_UPDATE',
        title: 'Halfway there',
        message: `You're ${result.progress}% through "${enrollment.course.title}". Keep going!`,
        category: 'progressTracking',
      })
    }
  }

  // The client uses completedAt to keep the lesson ticked; without it the tick vanished
  // after the server replied (the "flaky" completion).
  return {
    ...toLessonCompleteResult(
      lessonId,
      row?.completedAt ?? new Date(),
      result.completedLessonIds.length,
      result.total,
      courseCompleted,
    ),
    completedLessonIds: result.completedLessonIds,
  }
}
