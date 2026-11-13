/**
 * Seeds Time Intelligence Masterclass content for the weeks that have material.
 *
 *   npx tsx scripts/seed-time-intelligence.ts
 *
 * - Turns the 7 topic lessons of each available week into PDF lessons that open the
 *   week's reading (content/courses/time-intelligence/week-N.pdf) at their own section.
 * - Adds a "Week N Assessment" quiz lesson at the end of the module, with questions from
 *   content/courses/time-intelligence/quizzes.json. Quizzes are skipped while that file's
 *   answer key is still a DRAFT.
 *
 * Safe to run repeatedly: lessons and quizzes are updated in place, never duplicated, and
 * existing quiz attempts are preserved.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { prisma } from './prisma'

const COURSE_SLUG = 'time-intelligence-masterclass'
const CONTENT_DIR = resolve(__dirname, '../content/courses/time-intelligence')

/** Section page ranges per week, from each PDF's table of contents (lesson position → pages). */
const READINGS: Record<number, { file: string; sections: Array<[number, number]> }> = {
  1: {
    file: 'time-intelligence/week-1.pdf',
    // Lesson 1 includes the cover and contents; lesson 7 includes the closing reflection.
    sections: [[1, 8], [9, 15], [16, 22], [23, 29], [30, 37], [38, 45], [46, 54]],
  },
  2: {
    file: 'time-intelligence/week-2.pdf',
    // Lesson 1 includes cover, contents and introduction; lesson 7 includes the integrated
    // practical application and closing reflection.
    sections: [[1, 10], [11, 15], [16, 20], [21, 26], [27, 31], [32, 36], [37, 46]],
  },
}

interface QuizFile {
  answerKeyStatus: string
  weeks: Array<{
    week: number
    title: string
    timeLimitMinutes: number
    passingScore: number
    questions: Array<{ text: string; options: string[]; answer: 'A' | 'B' | 'C' | 'D' }>
  }>
}

async function seedReadings(courseId: string) {
  for (const [weekStr, reading] of Object.entries(READINGS)) {
    const week = Number(weekStr)
    const module = await prisma.courseModule.findFirst({
      where: { courseId, position: week },
      include: { lessons: { orderBy: { position: 'asc' } } },
    })
    if (!module) throw new Error(`Module for week ${week} not found`)

    const topicLessons = module.lessons.filter((l) => l.kind !== 'QUIZ')
    if (topicLessons.length !== reading.sections.length) {
      throw new Error(
        `Week ${week}: expected ${reading.sections.length} topic lessons, found ${topicLessons.length}`,
      )
    }

    for (const [i, lesson] of topicLessons.entries()) {
      const [pageStart, pageEnd] = reading.sections[i]
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { kind: 'PDF', contentKey: reading.file, contentUrl: null, pageStart, pageEnd },
      })
    }
    console.log(`Week ${week}: ${topicLessons.length} lessons now open ${reading.file}`)
  }
}

async function seedQuizzes(courseId: string) {
  const data = JSON.parse(readFileSync(resolve(CONTENT_DIR, 'quizzes.json'), 'utf8')) as QuizFile
  if (data.answerKeyStatus.startsWith('DRAFT')) {
    console.warn(`Skipping quizzes: answer key is "${data.answerKeyStatus}". Approve it first.`)
    return
  }

  for (const week of data.weeks) {
    if (!READINGS[week.week]) {
      console.warn(`Skipping Week ${week.week} quiz: no reading for that week yet`)
      continue
    }
    const module = await prisma.courseModule.findFirstOrThrow({
      where: { courseId, position: week.week },
      include: { lessons: { orderBy: { position: 'asc' } } },
    })

    let lesson = module.lessons.find((l) => l.kind === 'QUIZ')
    if (!lesson) {
      const position = Math.max(0, ...module.lessons.map((l) => l.position)) + 1
      lesson = await prisma.lesson.create({
        data: { moduleId: module.id, title: week.title, position, kind: 'QUIZ', duration: week.timeLimitMinutes },
      })
    } else {
      await prisma.lesson.update({ where: { id: lesson.id }, data: { title: week.title } })
    }

    const quiz = await prisma.quiz.upsert({
      where: { lessonId: lesson.id },
      update: { timeLimit: week.timeLimitMinutes, passingScore: week.passingScore },
      create: {
        lessonId: lesson.id,
        timeLimit: week.timeLimitMinutes,
        passingScore: week.passingScore,
        attemptsAllowed: 2,
      },
    })

    // Sync questions and options in place (by position) so existing attempts stay valid.
    for (const [qi, q] of week.questions.entries()) {
      const question =
        (await prisma.quizQuestion.findFirst({ where: { quizId: quiz.id, position: qi + 1 } })) ??
        (await prisma.quizQuestion.create({ data: { quizId: quiz.id, position: qi + 1, text: q.text } }))
      await prisma.quizQuestion.update({ where: { id: question.id }, data: { text: q.text } })

      for (const [oi, text] of q.options.entries()) {
        const isCorrect = 'ABCD'[oi] === q.answer
        const option = await prisma.quizOption.findFirst({ where: { questionId: question.id, position: oi + 1 } })
        if (option) {
          await prisma.quizOption.update({ where: { id: option.id }, data: { text, isCorrect } })
        } else {
          await prisma.quizOption.create({ data: { questionId: question.id, position: oi + 1, text, isCorrect } })
        }
      }
    }
    console.log(`Week ${week.week}: "${week.title}" quiz synced (${week.questions.length} questions)`)
  }
}

async function main() {
  const course = await prisma.course.findUniqueOrThrow({ where: { slug: COURSE_SLUG } })
  await seedReadings(course.id)
  await seedQuizzes(course.id)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
