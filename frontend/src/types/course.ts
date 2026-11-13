export interface Category {
  id: string
  name: string
  slug: string
  createdAt: string
}

export type LessonKind = 'VIDEO' | 'DOC' | 'PDF' | 'SCREEN' | 'QUIZ' | 'ASSESSMENT'

export interface Lesson {
  id: string
  title: string
  position: number
  duration: number | null
  kind?: LessonKind
  contentKey?: string | null
  contentUrl?: string | null
  /** PDF lessons: the page range of the document this lesson covers. */
  pageStart?: number | null
  pageEnd?: number | null
}

export interface CourseModule {
  id: string
  title: string
  position: number
  lessons: Lesson[]
}

export interface CourseInstructor {
  id: string
  name: string
  email?: string
}

export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
export type CourseStatus = 'DRAFT' | 'PUBLISHED'

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  thumbnail: string | null
  level: CourseLevel
  price: string | null
  earlyBirdPrice: string | null
  isFeatured: boolean
  createdAt: string
  category: Pick<Category, 'id' | 'name' | 'slug'>
  instructor: Pick<CourseInstructor, 'id' | 'name'>
  _count?: { modules: number }
}

export interface CourseDetail extends Course {
  modules: CourseModule[]
  instructor: CourseInstructor
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type LocalCourseLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface CurriculumWeek {
  week: number
  title: string
  topics: string[]
}

export interface LocalCourse {
  id: string
  slug: string
  title: string
  category: string
  description: string
  objective: string
  targetAudience: string[]
  keyLearningOutcomes: string[]
  duration: string          // e.g. "12 Weeks"
  curriculum: CurriculumWeek[]
  // optional details for paid / live programmes
  format?: string           // e.g. "Live Online Masterclass"
  delivery?: string
  organiser?: string
  tagline?: string
  overview?: string[]       // long-form description paragraphs
  // enriched fields
  price: string             // display price: "Free", or the current price e.g. "£299"
  originalPrice?: string    // standard price shown struck through during early bird, e.g. "£699"
  isEarlyBird: boolean
  level: LocalCourseLevel
  rating: number            // 4.5
  ratingCount: number       // 5
  studentsEnrolled: number  // 286
}
