import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { createAuthedClient, createFetcher } from '@/lib/fetcher'
import type { EnrollPayload, EnrollmentStats, EnrollmentSummary } from '@/types/enrollment'

function extractApiError(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    return response?.data?.message
  }
  return undefined
}

export function useEnrollments() {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken

  const swrKey = status === 'authenticated' && accessToken ? '/enrollments/me' : null
  const statsKey = status === 'authenticated' && accessToken ? '/enrollments/me/stats' : null

  const { data, error, isLoading, mutate } = useSWR<EnrollmentSummary[]>(
    swrKey,
    createFetcher(accessToken),
  )

  const {
    data: stats,
    error: statsError,
    isLoading: statsLoading,
    mutate: mutateStats,
  } = useSWR<EnrollmentStats>(statsKey, createFetcher(accessToken))

  const enroll = useCallback(
    async (payload: EnrollPayload): Promise<EnrollmentSummary> => {
      if (!accessToken) throw new Error('Not authenticated')
      const client = createAuthedClient(accessToken)
      const res = await client.post<{ data: EnrollmentSummary }>('/enrollments', payload)
      const next = res.data.data
      await Promise.all([
        mutate(
          (current) =>
            current
              ? [next, ...current.filter((item) => item.courseId !== next.courseId)]
              : [next],
          { revalidate: false },
        ),
        mutateStats(),
      ])
      return next
    },
    [accessToken, mutate, mutateStats],
  )

  const isEnrolledIn = useCallback(
    (courseId: string) => (data ?? []).some((item) => item.courseId === courseId),
    [data],
  )

  return {
    enrollments: data ?? [],
    stats,
    error: error ?? statsError,
    isLoading: isLoading || statsLoading || status === 'loading',
    enroll,
    isEnrolledIn,
    mutate,
    mutateStats,
    getErrorMessage: extractApiError,
  }
}
