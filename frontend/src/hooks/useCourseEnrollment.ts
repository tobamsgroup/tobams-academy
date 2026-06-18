import { useCallback, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { createAuthedClient, createFetcher } from '@/lib/fetcher'
import type { EnrollmentDetail, LessonCompleteResult } from '@/types/enrollment'

function extractApiError(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    return response?.data?.message
  }
  return undefined
}

export function useCourseEnrollment(courseId: string | undefined) {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken

  const swrKey =
    status === 'authenticated' && accessToken && courseId
      ? `/enrollments/me/${courseId}`
      : null

  const { data, error, isLoading, mutate } = useSWR<EnrollmentDetail>(
    swrKey,
    createFetcher(accessToken),
  )

  const [isMarkingComplete, setIsMarkingComplete] = useState(false)
  const [markCompleteError, setMarkCompleteError] = useState<string | null>(null)

  const completedLessonIds = useMemo(
    () =>
      new Set(
        (data?.lessonProgress ?? [])
          .filter((row) => row.completedAt != null)
          .map((row) => row.lessonId),
      ),
    [data?.lessonProgress],
  )

  const completeLesson = useCallback(
    async (lessonId: string): Promise<LessonCompleteResult | null> => {
      if (!accessToken || !courseId) return null
      if (completedLessonIds.has(lessonId)) return null

      setIsMarkingComplete(true)
      setMarkCompleteError(null)

      try {
        await mutate(
          (current) => {
            if (!current) return current
            const completedAt = new Date().toISOString()
            return {
              ...current,
              lessonProgress: current.lessonProgress.map((row) =>
                row.lessonId === lessonId ? { ...row, completedAt } : row,
              ),
            }
          },
          { revalidate: false },
        )

        const client = createAuthedClient(accessToken)
        const res = await client.post<{ data: LessonCompleteResult }>(
          `/enrollments/${courseId}/lessons/${lessonId}/complete`,
        )
        const result = res.data.data

        await mutate(
          (current) =>
            current
              ? {
                  ...current,
                  progress: result.progress,
                  completedAt: result.courseCompleted
                    ? result.completedAt
                    : current.completedAt,
                  lastAccessedAt: result.completedAt,
                  lessonProgress: current.lessonProgress.map((row) =>
                    row.lessonId === lessonId
                      ? { ...row, completedAt: result.completedAt }
                      : row,
                  ),
                }
              : current,
          { revalidate: false },
        )

        return result
      } catch (completeError) {
        setMarkCompleteError(extractApiError(completeError) ?? 'Failed to mark lesson complete')
        await mutate()
        return null
      } finally {
        setIsMarkingComplete(false)
      }
    },
    [accessToken, completedLessonIds, courseId, mutate],
  )

  return {
    enrollment: data,
    completedLessonIds,
    completeLesson,
    isMarkingComplete,
    markCompleteError,
    error,
    isLoading: isLoading || status === 'loading',
    mutate,
  }
}
