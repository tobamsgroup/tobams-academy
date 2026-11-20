import { prisma } from '@/lib/prisma'

/**
 * Weeks (course modules) unlock in order: a week opens once the learner has passed every quiz
 * in the weeks before it. Weeks without a quiz don't hold anything back.
 */

export const LOCKED_LESSON_MESSAGE = "Pass the previous week's quiz to unlock this week."

export type ModuleGate = { id: string; quizIds: string[] }

/** Ids of the modules still locked, given modules in course order and the quizzes passed. */
export function lockedModuleIds(modules: ModuleGate[], passedQuizIds: ReadonlySet<string>): string[] {
  const locked: string[] = []
  let blocked = false
  for (const m of modules) {
    if (blocked) locked.push(m.id)
    else if (m.quizIds.some((id) => !passedQuizIds.has(id))) blocked = true
  }
  return locked
}

/** Modules of a course this learner hasn't unlocked yet. */
export async function getLockedModuleIds(userId: string, courseId: string): Promise<string[]> {
  const modules = await prisma.courseModule.findMany({
    where: { courseId },
    orderBy: { position: 'asc' },
    select: { id: true, lessons: { select: { quiz: { select: { id: true } } } } },
  })
  const gates = modules.map((m) => ({
    id: m.id,
    quizIds: m.lessons.flatMap((l) => (l.quiz ? [l.quiz.id] : [])),
  }))
  const quizIds = gates.flatMap((g) => g.quizIds)
  if (quizIds.length === 0) return []

  const passed = await prisma.quizAttempt.findMany({
    where: { userId, isPassed: true, quizId: { in: quizIds } },
    select: { quizId: true },
    distinct: ['quizId'],
  })
  return lockedModuleIds(gates, new Set(passed.map((p) => p.quizId)))
}

/** Whether a lesson sits in a week this learner hasn't unlocked yet. */
export async function isLessonLocked(userId: string, lessonId: string): Promise<boolean> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { moduleId: true, module: { select: { courseId: true } } },
  })
  if (!lesson) return false
  const locked = await getLockedModuleIds(userId, lesson.module.courseId)
  return locked.includes(lesson.moduleId)
}
