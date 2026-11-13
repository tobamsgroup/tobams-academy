import useSWR from 'swr'
import { publicPaginatedFetcher } from '@/lib/fetcher'
import type { Course } from '@/types/course'

export type CourseSort = 'recent' | 'az' | 'active'

export interface CourseFilters {
  search?: string
  categoryId?: string
  page?: number
  limit?: number
  sort?: CourseSort
}

export function useCourses(filters: CourseFilters = {}) {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.categoryId) params.set('categoryId', filters.categoryId)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.sort && filters.sort !== 'active') params.set('sort', filters.sort)

  const query = params.toString()
  const key = `/courses${query ? `?${query}` : ''}`

  const { data, error, isLoading } = useSWR(
    key,
    (path: string) => publicPaginatedFetcher<Course>(path),
    { keepPreviousData: true },
  )

  return {
    courses: data?.data ?? [],
    meta: data?.meta,
    error,
    isLoading,
  }
}
