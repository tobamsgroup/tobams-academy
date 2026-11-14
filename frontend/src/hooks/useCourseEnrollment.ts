import { useCallback, useMemo, useRef, useState } from 'react'
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

// Progress rows only exist for completed lessons, so add one if it isn't there yet.
function markLessonCompleted<T extends { lessonId: string; completedAt: string | null }>(
  rows: T[],
  lessonId: string,
  completedAt: string,
): T[] {
  if (rows.some((row) => row.lessonId === lessonId)) {
    return rows.map((row) => (row.lessonId === lessonId ? { ...row, completedAt } : row))
  }
  return [...rows, { lessonId, completedAt } as T]
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

  // Lessons whose completion is being saved (several can be in flight: Next completes in the
  // background while the learner moves on).
  const [savingIds, setSavingIds] = useState<ReadonlySet<string>>(() => new Set())
  const inFlight = useRef(new Set<string>())
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
      // One request per lesson, even if auto-complete and Next fire together.
      if (inFlight.current.has(lessonId)) return null
      inFlight.current.add(lessonId)
      setSavingIds(new Set(inFlight.current))
      setMarkCompleteError(null)

      const optimisticAt = new Date().toISOString()
      try {
        await mutate(
          (current) => {
            if (!current) return current
            const completedAt = optimisticAt
            return {
              ...current,
              lessonProgress: markLessonCompleted(current.lessonProgress, lessonId, completedAt),
            }
          },
          { revalidate: false },
        )

        const client = createAuthedClient(accessToken)
        const res = await client.post<{ data: LessonCompleteResult }>(
          `/enrollments/${courseId}/lessons/${lessonId}/complete`,
        )
        const result = res.data.data
        // Never let a missing timestamp un-tick the lesson.
        const completedAt = result.completedAt ?? optimisticAt

        await mutate(
          (current) =>
            current
              ? {
                  ...current,
                  progress: result.progress,
                  completedAt: result.courseCompleted ? completedAt : current.completedAt,
                  lastAccessedAt: completedAt,
                  lessonProgress: markLessonCompleted(current.lessonProgress, lessonId, completedAt),
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
        inFlight.current.delete(lessonId)
        setSavingIds(new Set(inFlight.current))
      }
    },
    [accessToken, completedLessonIds, courseId, mutate],
  )

  const isMarkingComplete = savingIds.size > 0
  const isSavingLesson = useCallback((lessonId: string) => savingIds.has(lessonId), [savingIds])

  return {
    enrollment: data,
    completedLessonIds,
    isSavingLesson,
    completeLesson,
    isMarkingComplete,
    markCompleteError,
    error,
    isLoading: isLoading || status === 'loading',
    mutate,
  }
}
