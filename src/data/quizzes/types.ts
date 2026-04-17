export interface QuizOption {
  letter: string  // 'A', 'B', 'C', 'D', 'E', 'F'
  text: string
}

export interface QuizQuestion {
  id: string                // 'e1-q1', 'e2-q1', 'e3-q1'
  text: string
  options: QuizOption[]
  correctAnswer: string[]   // always array: ['A'] for single, ['A', 'D'] for multiple
  isMultiple: boolean
}

export interface QuizExam {
  id: string
  title: string
  questionCount: number
  durationMinutes: number
  questions: QuizQuestion[]
}
