import useSWR from 'swr'
import { publicFetcher } from '@/lib/fetcher'
import type { CourseDetail } from '@/types/course'

export function useCourse(slug: string | null) {
  const { data, error, isLoading } = useSWR<CourseDetail>(
    slug ? `/courses/${slug}` : null,
    publicFetcher,
  )
  return { course: data, error, isLoading }
}
