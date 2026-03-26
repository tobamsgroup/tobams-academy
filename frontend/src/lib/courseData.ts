import rawCourses from '../../courseContent.json'
import type { LocalCourse, CurriculumWeek, LocalCourseLevel } from '@/types/course'

type RawCourse = (typeof rawCourses)[number]

function deriveLevel(duration: string): LocalCourseLevel {
  const weeks = parseInt(duration, 10)
  if (Number.isNaN(weeks)) return 'Beginner'
  if (weeks <= 4) return 'Beginner'
  if (weeks <= 8) return 'Intermediate'
  return 'Advanced'
}

function enrich(raw: RawCourse): LocalCourse {
  return {
    id: raw.id,
    slug: raw.id,
    title: raw.title,
    category: raw.category,
    description: raw.description,
    objective: raw.objective,
    targetAudience: raw.targetAudience,
    keyLearningOutcomes: raw.keyLearningOutcomes,
    duration: raw.duration,
    curriculum: raw.curriculum as CurriculumWeek[],
    price: 'Free',
    level: deriveLevel(raw.duration),
    rating: 4.5,
    ratingCount: 5,
    studentsEnrolled: 286,
  }
}

const ALL_COURSES: LocalCourse[] = (rawCourses as RawCourse[]).map(enrich)

export function getAllCourses(): LocalCourse[] {
  return ALL_COURSES
}

export function getCourseBySlug(slug: string): LocalCourse | undefined {
  return ALL_COURSES.find((c) => c.slug === slug)
}

export function getCategories(): string[] {
  return [...new Set(ALL_COURSES.map((c) => c.category))].sort()
}
