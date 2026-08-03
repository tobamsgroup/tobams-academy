import { quizSeeds } from '../prisma/quiz-seeds'
import { lessonDb, prisma, quizDb, quizOptionDb, quizQuestionDb } from './prisma'

type QuizLessonRow = {
  id: string
  title: string
  contentKey: string | null
  quiz: { id: string } | null
}

async function createQuizForLesson(lessonId: string, contentKey: string) {
  const seed = quizSeeds[contentKey]
  if (!seed) {
    console.warn(`No quiz seed for contentKey "${contentKey}" (lesson ${lessonId})`)
    return false
  }

  const existing = await quizDb.findUnique({ where: { lessonId } })
  if (existing) {
    console.log(`Quiz already exists for lesson ${lessonId}`)
    return false
  }

  const quiz = await quizDb.create({
    data: {
      lessonId,
      timeLimit: seed.timeLimit,
      passingScore: seed.passingScore,
      attemptsAllowed: seed.attemptsAllowed,
    },
  })

  for (let qi = 0; qi < seed.questions.length; qi++) {
    const qData = seed.questions[qi]!
    const question = await quizQuestionDb.create({
      data: { quizId: quiz.id, text: qData.text, position: qi + 1 },
    })
    await quizOptionDb.createMany({
      data: qData.options.map((opt, oi) => ({
        questionId: question.id,
        text: opt.text,
        isCorrect: opt.isCorrect,
        position: oi + 1,
      })),
    })
  }

  console.log(`Created quiz for lesson ${lessonId} (${contentKey})`)
  return true
}

async function main() {
  const quizLessons = (await lessonDb.findMany({
    where: {
      OR: [{ kind: 'QUIZ' }, { title: { contains: 'quiz', mode: 'insensitive' } }],
    },
    select: { id: true, title: true, contentKey: true, quiz: { select: { id: true } } },
  } as never)) as unknown as QuizLessonRow[]

  let created = 0
  for (const lesson of quizLessons) {
    if (lesson.quiz) continue

    if (!lesson.contentKey || !quizSeeds[lesson.contentKey]) {
      console.warn(`Skipping "${lesson.title}" (${lesson.id}) — missing or unknown contentKey`)
      continue
    }

    if (await createQuizForLesson(lesson.id, lesson.contentKey)) created++
  }

  console.log(`Done. Created ${created} quiz(es).`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
