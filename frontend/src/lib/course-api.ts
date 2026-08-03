import type { Course, CourseDetail } from '@/types/course'
import { isQuizLesson } from '@/lib/quiz-utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1'

async function parseResponse<T>(res: Response): Promise<T | null> {
  if (!res.ok) return null
  const body = (await res.json()) as { data?: T }
  return body.data ?? null
}

export async function fetchCourseBySlug(slug: string): Promise<CourseDetail | null> {
  try {
    const res = await fetch(`${API_URL}/courses/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    })
    return parseResponse<CourseDetail>(res)
  } catch {
    return null
  }
}

export async function fetchRelatedCourses(
  course: CourseDetail,
  limit = 3,
): Promise<Course[]> {
  try {
    const params = new URLSearchParams({
      categoryId: course.category.id,
      limit: String(limit + 1),
    })
    const res = await fetch(`${API_URL}/courses?${params}`, {
      next: { revalidate: 60 },
    })
    const body = (await res.json()) as { data?: Course[] }
    return (body.data ?? []).filter((item) => item.slug !== course.slug).slice(0, limit)
  } catch {
    return []
  }
}

export function modulesToCurriculumSections(course: CourseDetail) {
  return course.modules.map((module, index) => ({
    week: index + 1,
    title: module.title,
    topics: module.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      isQuiz: isQuizLesson(lesson),
    })),
  }))
}

export function learningOutcomesFromCourse(course: CourseDetail): string[] {
  const fromLessons = course.modules
    .flatMap((module) => module.lessons)
    .map((lesson) => lesson.title)
    .slice(0, 6)

  if (fromLessons.length > 0) return fromLessons

  return course.description
    .split(/[.!?]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 4)
}
