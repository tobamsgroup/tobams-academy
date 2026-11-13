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
  questionType: string
  totalQuestions: number
  questions: QuizQuestion[]
}

export interface QuizAttemptResult {
  score: number
  isPassed: boolean
  correctAnswers: Record<string, string>
}
