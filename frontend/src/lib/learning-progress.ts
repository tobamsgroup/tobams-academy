import { prisma } from '@/lib/prisma'
import type {
  CourseLearningProgress,
  ModuleProgressStatus,
} from '@/types/learning-progress'

/** Letter grade for an average quiz score (0–100). */
export function gradeLabel(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

/**
 * Real learning progress for a user's enrollments, built from LessonProgress
 * (a row means the lesson is completed) and QuizAttempt (best score per quiz).
 * Pass courseId to get a single course.
 */
export async function getLearningProgress(
  userId: string,
  courseId?: string,
): Promise<CourseLearningProgress[]> {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId, ...(courseId ? { courseId } : {}) },
    orderBy: [{ lastAccessedAt: { sort: 'desc', nulls: 'last' } }, { enrolledAt: 'desc' }],
    include: {
      lessonProgress: { select: { lessonId: true } },
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          modules: {
            orderBy: { position: 'asc' },
            select: {
              id: true,
              title: true,
              lessons: {
                orderBy: { position: 'asc' },
                select: {
                  id: true,
                  title: true,
                  quiz: { select: { id: true, passingScore: true, attemptsAllowed: true } },
                },
              },
            },
          },
        },
      },
    },
  })

  const quizIds = enrollments.flatMap((e) =>
    e.course.modules.flatMap((m) => m.lessons.flatMap((l) => (l.quiz ? [l.quiz.id] : []))),
  )
  const attempts = quizIds.length
    ? await prisma.quizAttempt.findMany({
        where: { userId, quizId: { in: quizIds } },
        select: { quizId: true, score: true, isPassed: true },
      })
    : []

  const attemptsByQuiz = new Map<string, { best: number; passed: boolean; count: number }>()
  for (const a of attempts) {
    const cur = attemptsByQuiz.get(a.quizId) ?? { best: 0, passed: false, count: 0 }
    attemptsByQuiz.set(a.quizId, {
      best: Math.max(cur.best, a.score),
      passed: cur.passed || a.isPassed,
      count: cur.count + 1,
    })
  }

  return enrollments.map((enrollment) => {
    const done = new Set(enrollment.lessonProgress.map((lp) => lp.lessonId))
    let totalLessons = 0
    let lessonsCompleted = 0

    const modules = enrollment.course.modules.map((module) => {
      const total = module.lessons.length
      const completed = module.lessons.filter((l) => done.has(l.id)).length
      totalLessons += total
      lessonsCompleted += completed
      const status: ModuleProgressStatus =
        total > 0 && completed === total ? 'Completed' : completed > 0 ? 'In Progress' : 'Not Started'
      return { id: module.id, title: module.title, lessonsCompleted: completed, totalLessons: total, status }
    })

    const quizzes = enrollment.course.modules.flatMap((module) =>
      module.lessons.flatMap((lesson) => {
        if (!lesson.quiz) return []
        const stats = attemptsByQuiz.get(lesson.quiz.id)
        return [
          {
            quizId: lesson.quiz.id,
            lessonTitle: lesson.title,
            moduleTitle: module.title,
            bestScore: stats?.best ?? null,
            passed: stats?.passed ?? false,
            attempts: stats?.count ?? 0,
            attemptsAllowed: lesson.quiz.attemptsAllowed,
            passingScore: lesson.quiz.passingScore,
          },
        ]
      }),
    )

    const taken = quizzes.filter((q) => q.bestScore !== null)
    const averageScore = taken.length
      ? Math.round(taken.reduce((sum, q) => sum + (q.bestScore ?? 0), 0) / taken.length)
      : null

    const progress = enrollment.completedAt
      ? 100
      : totalLessons > 0
        ? Math.round((lessonsCompleted / totalLessons) * 100)
        : 0

    return {
      courseId: enrollment.course.id,
      title: enrollment.course.title,
      slug: enrollment.course.slug,
      enrolledAt: enrollment.enrolledAt.toISOString(),
      lastAccessedAt: enrollment.lastAccessedAt?.toISOString() ?? null,
      completedAt: enrollment.completedAt?.toISOString() ?? null,
      progress,
      lessonsCompleted,
      totalLessons,
      modulesCompleted: modules.filter((m) => m.status === 'Completed').length,
      totalModules: modules.length,
      quizzesTaken: taken.length,
      totalQuizzes: quizzes.length,
      averageScore,
      grade: averageScore === null ? null : gradeLabel(averageScore),
      modules,
      quizzes,
    }
  })
}
