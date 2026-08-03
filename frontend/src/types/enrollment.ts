import type { Course } from '@/types/course'

export interface EnrollmentSummary {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  completedAt: string | null
  lastAccessedAt: string | null
  progress: number
  course: Course
}

export interface EnrollPayload {
  courseId: string
}

export interface EnrollmentStats {
  coursesInProgress: number
  totalLearningHours: number
}

export interface LessonProgressSummary {
  lessonId: string
  completedAt: string | null
}

export interface EnrollmentDetail extends EnrollmentSummary {
  lessonProgress: LessonProgressSummary[]
}

export interface LessonCompleteResult {
  lessonId: string
  completedAt: string
  progress: number
  completedLessons: number
  totalLessons: number
  courseCompleted: boolean
}

export interface CourseProgress {
  progress: number
  completedLessonIds: string[]
  totalLessons: number
}

export function computeEnrollmentProgress(
  lessonProgress: ReadonlyArray<{ completedAt: Date | string | null }>,
  enrollmentCompletedAt?: Date | string | null,
  totalLessons?: number,
): number {
  if (enrollmentCompletedAt) return 100

  const total = totalLessons ?? lessonProgress.length
  if (total === 0) return 0

  const completed = lessonProgress.filter((row) => row.completedAt != null).length
  return Math.round((completed / total) * 100)
}

export function isEnrollmentCompleted(
  enrollmentCompletedAt?: Date | string | null,
): boolean {
  return enrollmentCompletedAt != null
}
