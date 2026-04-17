import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getExam } from '../data/quizzes'
import type { QuizExam } from '../data/quizzes/types'

type QuizStatus = 'idle' | 'in_progress' | 'submitted'

interface QuizStore {
  status: QuizStatus
  exam: QuizExam | null
  answers: Record<string, string[]>
  startedAt: number | null
  submittedAt: number | null

  startQuiz(examId: string): void
  setAnswer(questionId: string, letters: string[]): void
  submitQuiz(): void
  resetQuiz(): void
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      status: 'idle',
      exam: null,
      answers: {},
      startedAt: null,
      submittedAt: null,

      startQuiz(examId: string) {
        let exam
        try {
          exam = getExam(examId)
        } catch {
          return
        }
        set({
          status: 'in_progress',
          exam,
          answers: {},
          startedAt: Date.now(),
          submittedAt: null,
        })
      },

      setAnswer(questionId: string, letters: string[]) {
        set(state => ({
          answers: { ...state.answers, [questionId]: letters },
        }))
      },

      submitQuiz() {
        set({ status: 'submitted', submittedAt: Date.now() })
      },

      resetQuiz() {
        set({ status: 'idle', exam: null, answers: {}, startedAt: null, submittedAt: null })
      },
    }),
    {
      name: 'scrum-quiz-session',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
