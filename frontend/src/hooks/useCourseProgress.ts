import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { createFetcher } from '@/lib/fetcher'
import type { CourseProgress } from '@/types/enrollment'

export function useCourseProgress(courseId: string | undefined) {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken

  const swrKey =
    status === 'authenticated' && accessToken && courseId
      ? `/enrollments/${courseId}/progress`
      : null

  const { data, error, isLoading, mutate } = useSWR<CourseProgress>(
    swrKey,
    createFetcher(accessToken),
    { revalidateOnFocus: true },
  )

  return {
    progress: data?.progress ?? 0,
    completedLessonIds: data?.completedLessonIds ?? [],
    totalLessons: data?.totalLessons ?? 0,
    error,
    isLoading: isLoading || status === 'loading',
    mutate,
  }
}
