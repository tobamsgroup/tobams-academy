import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { createFetcher } from '@/lib/fetcher'
import type { CourseLearningProgress } from '@/types/learning-progress'

/** Progress for all of the user's enrolled courses. */
export function useLearningProgress() {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken
  const key = status === 'authenticated' && accessToken ? '/enrollments/me/progress' : null

  const { data, error, isLoading } = useSWR<CourseLearningProgress[]>(key, createFetcher(accessToken), {
    revalidateOnFocus: true,
  })

  return { courses: data ?? [], error, isLoading: isLoading || status === 'loading' }
}

/** Progress for a single enrolled course. */
export function useCourseLearningProgress(courseId: string) {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken
  const key =
    status === 'authenticated' && accessToken
      ? `/enrollments/me/progress?courseId=${encodeURIComponent(courseId)}`
      : null

  const { data, error, isLoading } = useSWR<CourseLearningProgress>(key, createFetcher(accessToken), {
    revalidateOnFocus: true,
  })

  return { course: data, error, isLoading: isLoading || status === 'loading' }
}
