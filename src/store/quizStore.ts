import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getExam } from '../data/quizzes'
import type { QuizExam } from '../data/quizzes/types'

type QuizStatus = 'idle' | 'in_progress' | 'submitted'

interface QuizStore {
  status: QuizStatus
  exam: QuizExam | null
  answers: Record<string, string[]>
  flaggedQuestions: string[]
  startedAt: number | null
  submittedAt: number | null

  startQuiz(examId: string): void
  setAnswer(questionId: string, letters: string[]): void
  toggleFlag(questionId: string): void
  submitQuiz(): void
  resetQuiz(): void
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      status: 'idle',
      exam: null,
      answers: {},
      flaggedQuestions: [],
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
          flaggedQuestions: [],
          startedAt: Date.now(),
          submittedAt: null,
        })
      },

      setAnswer(questionId: string, letters: string[]) {
        set(state => ({
          answers: { ...state.answers, [questionId]: letters },
        }))
      },

      toggleFlag(questionId: string) {
        set(state => ({
          flaggedQuestions: state.flaggedQuestions.includes(questionId)
            ? state.flaggedQuestions.filter(id => id !== questionId)
            : [...state.flaggedQuestions, questionId],
        }))
      },

      submitQuiz() {
        set({ status: 'submitted', submittedAt: Date.now() })
      },

      resetQuiz() {
        set({ status: 'idle', exam: null, answers: {}, flaggedQuestions: [], startedAt: null, submittedAt: null })
      },
    }),
    {
      name: 'scrum-quiz-session',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
