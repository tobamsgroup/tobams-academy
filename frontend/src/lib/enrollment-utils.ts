import type { Course } from '@/types/course'
import { prisma } from '@/lib/prisma'
import {
  computeEnrollmentProgress,
  isEnrollmentCompleted,
  type EnrollmentDetail,
  type EnrollmentStats,
  type EnrollmentSummary,
  type LessonCompleteResult,
} from '@/types/enrollment'

const COURSE_SUMMARY_SELECT = {
  id: true,
  title: true,
  slug: true,
  description: true,
  thumbnail: true,
  level: true,
  price: true,
  isFeatured: true,
  createdAt: true,
  category: { select: { id: true, name: true, slug: true } },
  instructor: { select: { id: true, name: true } },
  _count: { select: { modules: true } },
}

export const enrollmentInclude = {
  course: { select: COURSE_SUMMARY_SELECT },
  lessonProgress: { select: { lessonId: true, completedAt: true } },
} as const

export const enrollmentStatsInclude = {
  lessonProgress: {
    select: {
      completedAt: true,
      lesson: { select: { duration: true } },
    },
  },
} as const

export function computeEnrollmentStats(
  enrollments: ReadonlyArray<{
    completedAt: Date | null
    lessonProgress: ReadonlyArray<{
      completedAt: Date | null
      lesson: { duration: number | null }
    }>
  }>,
): EnrollmentStats {
  let coursesInProgress = 0
  let totalMinutes = 0

  for (const enrollment of enrollments) {
    if (!isEnrollmentCompleted(enrollment.completedAt)) {
      coursesInProgress++
    }

    for (const row of enrollment.lessonProgress) {
      if (row.completedAt != null) {
        totalMinutes += row.lesson.duration ?? 0
      }
    }
  }

  return {
    coursesInProgress,
    totalLearningHours: Math.round((totalMinutes / 60) * 10) / 10,
  }
}

export function toEnrollmentSummary(
  enrollment: {
    id: string
    userId: string
    courseId: string
    enrolledAt: Date
    completedAt: Date | null
    lastAccessedAt: Date | null
    course: unknown
    lessonProgress: ReadonlyArray<{ lessonId?: string; completedAt: Date | null }>
  },
  totalLessons?: number,
): EnrollmentSummary {
  return {
    id: enrollment.id,
    userId: enrollment.userId,
    courseId: enrollment.courseId,
    enrolledAt: enrollment.enrolledAt.toISOString(),
    completedAt: enrollment.completedAt?.toISOString() ?? null,
    lastAccessedAt: enrollment.lastAccessedAt?.toISOString() ?? null,
    progress: computeEnrollmentProgress(
      enrollment.lessonProgress,
      enrollment.completedAt,
      totalLessons,
    ),
    course: enrollment.course as Course,
  }
}

export function toEnrollmentDetail(
  enrollment: {
    id: string
    userId: string
    courseId: string
    enrolledAt: Date
    completedAt: Date | null
    lastAccessedAt: Date | null
    course: unknown
    lessonProgress: ReadonlyArray<{ lessonId: string; completedAt: Date | null }>
  },
  totalLessons?: number,
): EnrollmentDetail {
  return {
    ...toEnrollmentSummary(enrollment, totalLessons),
    lessonProgress: enrollment.lessonProgress.map((row) => ({
      lessonId: row.lessonId,
      completedAt: row.completedAt?.toISOString() ?? null,
    })),
  }
}

export function toLessonCompleteResult(
  lessonId: string,
  completedAt: Date,
  completedLessons: number,
  totalLessons: number,
  courseCompleted: boolean,
): LessonCompleteResult {
  const progress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return {
    lessonId,
    completedAt: completedAt.toISOString(),
    progress: courseCompleted ? 100 : progress,
    completedLessons,
    totalLessons,
    courseCompleted,
  }
}

export async function syncLessonProgressForEnrollment(
  enrollmentId: string,
  courseId: string,
): Promise<void> {
  const lessons = await prisma.lesson.findMany({
    where: { module: { courseId } },
    select: { id: true },
  })

  if (lessons.length === 0) return

  const existing = await prisma.lessonProgress.findMany({
    where: { enrollmentId },
    select: { lessonId: true },
  })
  const existingIds = new Set(existing.map((row) => row.lessonId))

  const missing = lessons
    .filter((lesson) => !existingIds.has(lesson.id))
    .map((lesson) => ({ enrollmentId, lessonId: lesson.id }))

  if (missing.length > 0) {
    await prisma.lessonProgress.createMany({
      data: missing,
      skipDuplicates: true,
    })
  }
}

export async function getCourseLessonCount(courseId: string): Promise<number> {
  return prisma.lesson.count({
    where: { module: { courseId } },
  })
}

export type CourseProgressResult = {
  progress: number
  completedLessonIds: string[]
  totalLessons: number
}

export async function getCourseProgressForEnrollment(
  enrollmentId: string,
  courseId: string,
  enrollmentCompletedAt?: Date | null,
): Promise<CourseProgressResult> {
  if (enrollmentCompletedAt) {
    const allLessons = await prisma.lesson.findMany({
      where: { module: { courseId } },
      select: { id: true },
    })
    return {
      progress: 100,
      completedLessonIds: allLessons.map((lesson) => lesson.id),
      totalLessons: allLessons.length,
    }
  }

  const [totalLessons, completedRows] = await Promise.all([
    getCourseLessonCount(courseId),
    prisma.lessonProgress.findMany({
      where: { enrollmentId, completedAt: { not: null } },
      select: { lessonId: true },
    }),
  ])

  const completedLessonIds = completedRows.map((row) => row.lessonId)
  const progress =
    totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0

  return { progress, completedLessonIds, totalLessons }
}
