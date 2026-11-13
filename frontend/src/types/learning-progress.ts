export type ModuleProgressStatus = 'Completed' | 'In Progress' | 'Not Started'

export interface ModuleProgress {
  id: string
  title: string
  lessonsCompleted: number
  totalLessons: number
  status: ModuleProgressStatus
}

export interface QuizProgress {
  quizId: string
  lessonTitle: string
  moduleTitle: string
  /** Best score across attempts, or null if not attempted yet. */
  bestScore: number | null
  passed: boolean
  attempts: number
  attemptsAllowed: number
  passingScore: number
}

export interface CourseLearningProgress {
  courseId: string
  title: string
  slug: string
  enrolledAt: string
  lastAccessedAt: string | null
  completedAt: string | null
  progress: number
  lessonsCompleted: number
  totalLessons: number
  modulesCompleted: number
  totalModules: number
  quizzesTaken: number
  totalQuizzes: number
  /** Average of best quiz scores, or null when no quiz has been taken. */
  averageScore: number | null
  grade: string | null
  modules: ModuleProgress[]
  quizzes: QuizProgress[]
}
