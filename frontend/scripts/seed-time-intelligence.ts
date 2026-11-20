/**
 * Seeds Time Intelligence Masterclass content for the weeks that have material.
 *
 *   npx tsx scripts/seed-time-intelligence.ts                 # weeks, readings, quizzes
 *   npx tsx scripts/seed-time-intelligence.ts --with-slides   # also the weekly slide decks
 *   npx tsx scripts/seed-time-intelligence.ts --with-assignments   # also the weekly assignments
 *
 * Each week runs: Slides → readings (one lesson per section) → Week N Assessment → Week N Assignment.
 * Only use --with-slides / --with-assignments once the deployed app knows the SLIDES and
 * ASSIGNMENT lesson kinds (older builds fail to read lessons of an unknown kind).
 *
 * - Turns the 7 topic lessons of each available week into PDF lessons that open the
 *   week's reading (content/courses/time-intelligence/week-N.pdf) at their own section.
 * - Adds a "Week N Assessment" quiz lesson at the end of the week, with questions from
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

/** Weeks with an assignment brief (content/courses/time-intelligence/assignments/week-N.pdf). */
const ASSIGNMENT_WEEKS = [1, 2, 3, 4, 5, 6]

/** Slide decks per week (content/courses/time-intelligence/slides/week-N.pdf) and their slide counts. */
const SLIDE_DECKS: Record<number, number> = { 1: 24, 2: 24, 3: 23, 4: 23, 5: 23, 6: 23 }

/** Section page ranges per week, from each PDF's table of contents (lesson position → pages). */
const READINGS: Record<
  number,
  {
    file: string
    sections: Array<[number, number]>
    /** Lesson titles from the reading's sections, where the original outline differs. */
    titles?: string[]
  }
> = {
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
  // Weeks 3–6: lesson 1 includes the cover, contents and introduction; lesson 7 runs to the
  // end (integrated practical application and closing reflection). Page numbers are PDF pages.
  3: {
    file: 'time-intelligence/week-3.pdf',
    sections: [[1, 11], [12, 16], [17, 21], [22, 27], [28, 33], [34, 39], [40, 49]],
  },
  4: {
    file: 'time-intelligence/week-4.pdf',
    sections: [[1, 11], [12, 17], [18, 24], [25, 31], [32, 37], [38, 43], [44, 55]],
    titles: [
      'Understanding the relationship between attention, concentration and effective time utilisation',
      'Identifying internal and external distractions that affect personal focus',
      'Understanding the impact of multitasking, task-switching and fragmented attention',
      'Managing digital distractions, notifications and constant connectivity',
      'Developing sustained concentration and effective focus habits',
      'Establishing focus boundaries and designing environments that support attention',
      'Developing a personal Focus Intelligence system for meaningful progress',
    ],
  },
  5: {
    file: 'time-intelligence/week-5.pdf',
    sections: [[1, 11], [12, 16], [17, 22], [23, 28], [29, 34], [35, 39], [40, 49]],
    titles: [
      'Understanding the difference between intentions, planning, action and execution',
      'Identifying the causes and consequences of procrastination',
      'Applying practical strategies for overcoming delays and initiating important activities',
      'Breaking complex goals and responsibilities into manageable actions',
      'Developing consistency, momentum and effective follow-through',
      'Strengthening personal accountability and measuring meaningful progress',
      'Designing a personal Execution Intelligence system for sustainable results',
    ],
  },
  6: {
    file: 'time-intelligence/week-6.pdf',
    sections: [[1, 13], [14, 20], [21, 26], [27, 33], [34, 39], [40, 46], [47, 62]],
    titles: [
      'Understanding Time Architecture and integrating the six dimensions of Time Intelligence',
      'Designing a personal time management framework around priorities and responsibilities',
      'Establishing daily, weekly and monthly planning routines',
      'Building sustainable habits, boundaries and contingency arrangements',
      'Establishing review, reflection and continuous improvement practices',
      'Evaluating your progress through the final Time Intelligence diagnostic',
      'Developing your personal 30-, 60- and 90-day Time Intelligence implementation plan',
    ],
  },
}

interface QuizFile {
  answerKeyStatus: string
  weeks: Array<{
    week: number
    title: string
    /** Overrides the file-level status for this week (e.g. a newly drafted key). */
    answerKeyStatus?: string
    timeLimitMinutes: number
    passingScore: number
    questions: Array<{ text: string; options: string[]; answer: 'A' | 'B' | 'C' | 'D' }>
  }>
}

async function seedReadings(courseId: string) {
  for (const [weekStr, reading] of Object.entries(READINGS)) {
    const week = Number(weekStr)
    const weekModule = await prisma.courseModule.findFirst({
      where: { courseId, position: week },
      include: { lessons: { orderBy: { position: 'asc' } } },
    })
    if (!weekModule) throw new Error(`Module for week ${week} not found`)

    const topicLessons = weekModule.lessons.filter((l) => !['QUIZ', 'SLIDES', 'ASSIGNMENT'].includes(l.kind))
    if (topicLessons.length !== reading.sections.length) {
      throw new Error(
        `Week ${week}: expected ${reading.sections.length} topic lessons, found ${topicLessons.length}`,
      )
    }

    for (const [i, lesson] of topicLessons.entries()) {
      const [pageStart, pageEnd] = reading.sections[i]
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          kind: 'PDF',
          contentKey: reading.file,
          contentUrl: null,
          pageStart,
          pageEnd,
          ...(reading.titles ? { title: reading.titles[i] } : {}),
        },
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
    const status = week.answerKeyStatus ?? data.answerKeyStatus
    if (status.startsWith('DRAFT')) {
      console.warn(`Skipping Week ${week.week} quiz: answer key is "${status}". Approve it first.`)
      continue
    }
    if (!READINGS[week.week]) {
      console.warn(`Skipping Week ${week.week} quiz: no reading for that week yet`)
      continue
    }
    const weekModule = await prisma.courseModule.findFirstOrThrow({
      where: { courseId, position: week.week },
      include: { lessons: { orderBy: { position: 'asc' } } },
    })

    let lesson = weekModule.lessons.find((l) => l.kind === 'QUIZ')
    if (!lesson) {
      // After the readings, before the week's assignment (which always comes last).
      const others = weekModule.lessons.filter((l) => l.kind !== 'ASSIGNMENT')
      const position = Math.max(0, ...others.map((l) => l.position)) + 1
      lesson = await prisma.lesson.create({
        data: { moduleId: weekModule.id, title: week.title, position, kind: 'QUIZ', duration: week.timeLimitMinutes },
      })
      const assignment = weekModule.lessons.find((l) => l.kind === 'ASSIGNMENT')
      if (assignment && assignment.position <= position) {
        await prisma.lesson.update({ where: { id: assignment.id }, data: { position: position + 1 } })
      }
    } else {
      await prisma.lesson.update({ where: { id: lesson.id }, data: { title: week.title } })
    }

    const quiz = await prisma.quiz.upsert({
      where: { lessonId: lesson.id },
      update: { timeLimit: week.timeLimitMinutes, passingScore: week.passingScore, attemptsAllowed: 3 },
      create: {
        lessonId: lesson.id,
        timeLimit: week.timeLimitMinutes,
        passingScore: week.passingScore,
        attemptsAllowed: 3,
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

/** "Module 3: Capacity Intelligence" → "Week 3: Capacity Intelligence" (the course runs weekly). */
async function renameModulesToWeeks(courseId: string) {
  const modules = await prisma.courseModule.findMany({ where: { courseId }, orderBy: { position: 'asc' } })
  for (const weekModule of modules) {
    const title = weekModule.title.replace(/^Module\s+(\d+)/i, 'Week $1')
    if (title !== weekModule.title) await prisma.courseModule.update({ where: { id: weekModule.id }, data: { title } })
  }
  console.log(`Weeks: ${modules.map((m) => m.title.replace(/^Module\s+(\d+)/i, 'Week $1')).join(' | ')}`)
}

/** A "Week N Slides" lesson first in each week (position 0, before the readings). */
async function seedSlides(courseId: string) {
  for (const [weekStr, slideCount] of Object.entries(SLIDE_DECKS)) {
    const week = Number(weekStr)
    const weekModule = await prisma.courseModule.findFirst({ where: { courseId, position: week } })
    if (!weekModule) throw new Error(`Module for week ${week} not found`)
    const data = {
      title: `Week ${week} Slides`,
      kind: 'SLIDES' as const,
      contentKey: `time-intelligence/slides/week-${week}.pdf`,
      contentUrl: null,
      pageStart: 1,
      pageEnd: slideCount,
      position: 0,
    }
    const existing = await prisma.lesson.findFirst({ where: { moduleId: weekModule.id, kind: 'SLIDES' } })
    if (existing) await prisma.lesson.update({ where: { id: existing.id }, data })
    else await prisma.lesson.create({ data: { ...data, moduleId: weekModule.id } })
  }
  console.log(`Slides: added to weeks ${Object.keys(SLIDE_DECKS).join(', ')}`)
}

/**
 * A "Week N Assignment" lesson last in each week. Learners download the brief and complete
 * the lesson by uploading their work. Runs after the quizzes so it stays at the end.
 */
async function seedAssignments(courseId: string) {
  for (const week of ASSIGNMENT_WEEKS) {
    const weekModule = await prisma.courseModule.findFirst({
      where: { courseId, position: week },
      include: { lessons: { orderBy: { position: 'asc' } } },
    })
    if (!weekModule) throw new Error(`Module for week ${week} not found`)
    const existing = weekModule.lessons.find((l) => l.kind === 'ASSIGNMENT')
    const others = weekModule.lessons.filter((l) => l.id !== existing?.id)
    const data = {
      title: `Week ${week} Assignment`,
      kind: 'ASSIGNMENT' as const,
      contentKey: `time-intelligence/assignments/week-${week}.pdf`,
      contentUrl: null,
      pageStart: null,
      pageEnd: null,
      position: Math.max(0, ...others.map((l) => l.position)) + 1,
    }
    if (existing) await prisma.lesson.update({ where: { id: existing.id }, data })
    else await prisma.lesson.create({ data: { ...data, moduleId: weekModule.id } })
  }
  console.log(`Assignments: added to the end of weeks ${ASSIGNMENT_WEEKS.join(', ')}`)
}

async function main() {
  const course = await prisma.course.findUniqueOrThrow({ where: { slug: COURSE_SLUG } })
  await renameModulesToWeeks(course.id)
  if (process.argv.includes('--with-slides')) await seedSlides(course.id)
  else console.log('Slides: skipped (run with --with-slides once the new build is deployed)')
  await seedReadings(course.id)
  await seedQuizzes(course.id)
  if (process.argv.includes('--with-assignments')) await seedAssignments(course.id)
  else console.log('Assignments: skipped (run with --with-assignments once the new build is deployed)')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
