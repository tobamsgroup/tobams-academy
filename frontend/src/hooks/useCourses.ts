import useSWR from 'swr'
import { publicFetcher } from '@/lib/fetcher'
import type { Course, PaginatedResponse } from '@/types/course'

export interface CourseFilters {
  search?: string
  categoryId?: string
  page?: number
  limit?: number
}

export function useCourses(filters: CourseFilters = {}) {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.categoryId) params.set('categoryId', filters.categoryId)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  const query = params.toString()
  const key = `/courses${query ? `?${query}` : ''}`

  const { data, error, isLoading } = useSWR<PaginatedResponse<Course>>(
    key,
    (path: string) => publicFetcher<PaginatedResponse<Course>>(path),
    { keepPreviousData: true },
  )

  return {
    courses: data?.data ?? [],
    meta: data?.meta,
    error,
    isLoading,
  }
}
