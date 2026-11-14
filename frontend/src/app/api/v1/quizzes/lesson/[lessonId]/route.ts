import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { activeEnrollmentWhere } from '@/lib/enrollment-access'

export const GET = withRoute(
  '/api/v1/quizzes/lesson/[lessonId]',
  async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    const user = getAuthUser(req)
    if (!user) return err('Unauthorized', 401)

    const { lessonId } = (await params) ?? {}
    if (!lessonId) return err('lessonId is required')

    const quiz = await prisma.quiz.findUnique({
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

    const enrolled = await prisma.enrollment.findFirst({
      where: { userId: user.id, ...activeEnrollmentWhere(), course: { modules: { some: { lessons: { some: { id: lessonId } } } } } },
      select: { id: true },
    })
    if (!enrolled) return err('You need active access to this course to take this quiz', 403)

    return ok({
      id: quiz.id,
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore,
      attemptsAllowed: quiz.attemptsAllowed,
      questionType: quiz.questionType,
      totalQuestions: quiz.questions.length,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        text: q.text,
        position: q.position,
        options: q.options,
      })),
    })
  },
)
