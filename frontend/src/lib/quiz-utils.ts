import type { Lesson } from '@/types/course'

const QUIZ_TITLE_PATTERN = /\bquiz\b/i

export function isQuizLessonTitle(title: string): boolean {
  return QUIZ_TITLE_PATTERN.test(title)
}

export function isQuizLesson(lesson: Pick<Lesson, 'title' | 'kind'>): boolean {
  if (lesson.kind === 'QUIZ') return true
  return isQuizLessonTitle(lesson.title)
}

export function formatQuizTimeLimit(minutes: number): string {
  if (minutes <= 0) return 'No limit'
  return minutes === 1 ? '1 minute' : `${minutes} minutes`
}
