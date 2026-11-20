export interface QuizOption {
  id: string
  text: string
  position: number
}

export interface QuizQuestion {
  id: string
  text: string
  position: number
  options: QuizOption[]
}

export interface QuizDetail {
  id: string
  timeLimit: number
  passingScore: number
  attemptsAllowed: number
  /** The learner's previous attempts, oldest first. */
  attempts: QuizAttemptSummary[]
  attemptsRemaining: number
  /** Highest score so far; null before the first attempt. */
  bestScore: number | null
  hasPassed: boolean
  questionType: string
  totalQuestions: number
  questions: QuizQuestion[]
}

export interface QuizAttemptResult {
  score: number
  isPassed: boolean
  correctAnswers: Record<string, string>
}

export interface QuizAttemptSummary {
  score: number
  isPassed: boolean
  completedAt: string
}
