import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { createAuthedClient, createFetcher } from '@/lib/fetcher'
import type { QuizAttemptResult, QuizDetail } from '@/types/quiz'

export function useQuiz(lessonId: string | undefined) {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken

  const swrKey =
    status === 'authenticated' && accessToken && lessonId
      ? `/quizzes/lesson/${lessonId}`
      : null

  const { data, error, isLoading, mutate } = useSWR<QuizDetail>(
    swrKey,
    createFetcher(accessToken),
  )

  const submitAttempt = useCallback(
    async (answers: Record<string, string>): Promise<QuizAttemptResult> => {
      if (!accessToken || !data?.id) throw new Error('Quiz not loaded')
      const client = createAuthedClient(accessToken)
      const res = await client.post<{ data: QuizAttemptResult }>(
        `/quizzes/${data.id}/attempts`,
        { answers },
      )
      return res.data.data
    },
    [accessToken, data?.id],
  )

  return {
    quiz: data,
    error,
    isLoading: isLoading || status === 'loading',
    submitAttempt,
    mutate,
  }
}
