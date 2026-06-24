import { NextRequest } from 'next/server'
import { quizDb } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'

export const GET = withRoute(
  '/api/v1/quizzes/lesson/[lessonId]',
  async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    const user = getAuthUser(req)
    if (!user) return err('Unauthorized', 401)

    const { lessonId } = (await params) ?? {}
    if (!lessonId) return err('lessonId is required')

    const quiz = await quizDb.findUnique({
      where: { lessonId },
      include: {
        questions: {
          orderBy: { position: 'asc' },
          include: {
            options: {
              orderBy: { position: 'asc' },
              // Never expose isCorrect to the client
              select: { id: true, text: true, position: true },
            },
          },
        },
      },
    })

    if (!quiz) return err('Quiz not found', 404)

    return ok({
      id: quiz.id,
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore,
      attemptsAllowed: quiz.attemptsAllowed,
      questionType: quiz.questionType,
      totalQuestions: quiz.questions.length,
      questions: quiz.questions.map(
        (q: {
          id: string
          text: string
          position: number
          options: { id: string; text: string; position: number }[]
        }) => ({
          id: q.id,
          text: q.text,
          position: q.position,
          options: q.options,
        }),
      ),
    })
  },
)
