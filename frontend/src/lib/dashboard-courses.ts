import type { StaticImageData } from 'next/image'
import { IMAGES } from '@/assets/images'
import type { Course } from '@/types/course'
import type { EnrollmentSummary } from '@/types/enrollment'
import type { CourseSortKey } from '@/components/dashboard/courses/CourseSortDropdown'

export const DASHBOARD_COURSES_PAGE_SIZE = 6

const FALLBACK_THUMBNAILS = [
  IMAGES.course1,
  IMAGES.course2,
  IMAGES.course3,
  IMAGES.course4,
] as const

export type DashboardCourse = Course & {
  progress: number
  lastAccessed: string | null
  completedAt: string | null
}

export function toDashboardCourse(course: Course): DashboardCourse {
  return {
    ...course,
    progress: 0,
    lastAccessed: null,
    completedAt: null,
  }
}

export function toDashboardCourseFromEnrollment(
  enrollment: EnrollmentSummary,
): DashboardCourse {
  return {
    ...enrollment.course,
    progress: enrollment.progress,
    lastAccessed: enrollment.lastAccessedAt ?? enrollment.enrolledAt,
    completedAt: enrollment.completedAt,
  }
}

export function getCourseThumbnail(
  course: Pick<Course, 'thumbnail'>,
  index: number,
): string | StaticImageData {
  if (course.thumbnail) return course.thumbnail
  return FALLBACK_THUMBNAILS[index % FALLBACK_THUMBNAILS.length]!
}

export function formatLearningHours(hours: number): string {
  if (hours <= 0) return '0 hrs'
  return Number.isInteger(hours) ? `${hours} hrs` : `${hours} hrs`
}

export function formatLastAccessed(lastAccessed: string | null): string {
  if (!lastAccessed) return 'Not started yet'

  const date = new Date(lastAccessed)
  if (Number.isNaN(date.getTime())) return 'Not started yet'

  const diffMs = Date.now() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

export function formatCourseLevel(level: Course['level']): string {
  return level.charAt(0) + level.slice(1).toLowerCase()
}

export function matchesCourseTab(
  course: Pick<DashboardCourse, 'progress' | 'completedAt'>,
  tab: 'all' | 'inProgress' | 'completed',
): boolean {
  if (tab === 'all') return true
  if (tab === 'completed') return course.completedAt != null
  return course.completedAt == null
}

export function sortDashboardCourses(
  courses: DashboardCourse[],
  sortBy: CourseSortKey,
): DashboardCourse[] {
  const arr = [...courses]
  switch (sortBy) {
    case 'active':
      arr.sort((a, b) => b.progress - a.progress || a.title.localeCompare(b.title))
      break
    case 'az':
      arr.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'recent':
    default:
      arr.sort(
        (a, b) =>
          new Date(b.lastAccessed ?? b.createdAt).getTime() -
          new Date(a.lastAccessed ?? a.createdAt).getTime(),
      )
      break
  }
  return arr
}

export function countCoursesInTab(
  courses: DashboardCourse[],
  tab: 'all' | 'inProgress' | 'completed',
): number {
  return courses.filter((course) => matchesCourseTab(course, tab)).length
}
