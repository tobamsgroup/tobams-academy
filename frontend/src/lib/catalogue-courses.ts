import type { Course, CourseLevel } from '@/types/course'

export const CATALOGUE_PAGE_SIZE = 12

export const LEVEL_LABELS: Record<CourseLevel, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
}

export const LEVEL_OPTIONS = Object.values(LEVEL_LABELS)

export function formatCoursePrice(price: string | null): string {
  if (price === null || price === undefined || price === '') return 'Free'
  const value = Number(price)
  if (!Number.isFinite(value) || value <= 0) return 'Free'
  return `£${value.toFixed(0)}`
}

export function parseCoursePrice(price: string | null): number {
  if (!price) return 0
  const value = Number(price)
  return Number.isFinite(value) ? value : 0
}

export function mapCatalogueSortToApi(
  sortBy: string,
): 'recent' | 'az' | undefined {
  if (sortBy === 'latest' || sortBy === 'trending') return 'recent'
  return undefined
}

export function sortCatalogueCourses(courses: Course[], sortBy: string): Course[] {
  const list = [...courses]
  if (sortBy === 'oldest') {
    return list.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
  }
  if (sortBy === 'highest_price') {
    return list.sort((a, b) => parseCoursePrice(b.price) - parseCoursePrice(a.price))
  }
  if (sortBy === 'lowest_price') {
    return list.sort((a, b) => parseCoursePrice(a.price) - parseCoursePrice(b.price))
  }
  if (sortBy === 'trending') {
    return list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
  }
  return list
}
