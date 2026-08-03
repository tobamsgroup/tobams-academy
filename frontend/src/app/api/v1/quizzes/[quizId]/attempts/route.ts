import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'

export const POST = withRoute(
  '/api/v1/quizzes/[quizId]/attempts',
  async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    const user = getAuthUser(req)
    if (!user) return err('Unauthorized', 401)

    const { quizId } = (await params) ?? {}
    if (!quizId) return err('quizId is required')

    const body = await req.json().catch(() => null)
    const answers = body?.answers as Record<string, string> | undefined
    if (!answers || typeof answers !== 'object') return err('answers is required')

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { options: { select: { id: true, isCorrect: true } } },
        },
      },
    })
    if (!quiz) return err('Quiz not found', 404)

    // Enforce attempt limit
    const attemptCount = await prisma.quizAttempt.count({
      where: { quizId, userId: user.id },
    })
    if (attemptCount >= quiz.attemptsAllowed) {
      return err(`Maximum attempts (${quiz.attemptsAllowed}) reached`, 429)
    }

    // Grade answers
    let correct = 0
    const correctAnswers: Record<string, string> = {}

    for (const question of quiz.questions) {
      const correctOption = question.options.find((o) => o.isCorrect)
      if (correctOption) {
        correctAnswers[question.id] = correctOption.id
        if (answers[question.id] === correctOption.id) correct++
      }
    }

    const total = quiz.questions.length
    const score = total > 0 ? Math.round((correct / total) * 100) : 0
    const isPassed = score >= quiz.passingScore

    await prisma.quizAttempt.create({
      data: {
        quizId,
        userId: user.id,
        score,
        isPassed,
        answers,
      },
    })

    return ok({ score, isPassed, correctAnswers })
  },
)
