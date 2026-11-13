export interface ContinueLearningCourse {
  courseId: string
  title: string
  slug: string
  progress: number
  isCompleted: boolean
  /** When the learner last opened the course (falls back to the enrollment date). */
  lastAccessedAt: string
  timeSpentSeconds: number
  /** Lesson "Resume" opens: where the learner left off (see resumeLessonId). */
  nextLesson: { id: string; title: string; moduleNumber: number; moduleTitle: string } | null
}

export interface DashboardInsights {
  thisWeekSeconds: number
  lastWeekSeconds: number
  totalSeconds: number
  coursesInProgress: number
  coursesEnrolled: number
  coursesCompleted: number
}

export interface DashboardOverview {
  continueLearning: ContinueLearningCourse[]
  insights: DashboardInsights
  /** Tracked learning time per calendar month (UTC) of `year`, January first. */
  engagement: { year: number; monthlySeconds: number[] }
}
