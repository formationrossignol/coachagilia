import { describe, it, expect, beforeEach } from 'vitest'
import { useQuizStore } from './quizStore'

beforeEach(() => {
  useQuizStore.getState().resetQuiz()
})

describe('quizStore', () => {
  it('starts idle with no exam', () => {
    const { status, exam } = useQuizStore.getState()
    expect(status).toBe('idle')
    expect(exam).toBeNull()
  })

  it('startQuiz loads exam and sets status to in_progress', () => {
    useQuizStore.getState().startQuiz('exam-2')
    const { status, exam, startedAt } = useQuizStore.getState()
    expect(status).toBe('in_progress')
    expect(exam?.id).toBe('exam-2')
    expect(startedAt).toBeGreaterThan(0)
  })

  it('setAnswer records the answer for a question', () => {
    useQuizStore.getState().startQuiz('exam-2')
    useQuizStore.getState().setAnswer('e2-q1', ['A'])
    const { answers } = useQuizStore.getState()
    expect(answers['e2-q1']).toEqual(['A'])
  })

  it('setAnswer overwrites a previous answer', () => {
    useQuizStore.getState().startQuiz('exam-2')
    useQuizStore.getState().setAnswer('e2-q1', ['A'])
    useQuizStore.getState().setAnswer('e2-q1', ['B'])
    expect(useQuizStore.getState().answers['e2-q1']).toEqual(['B'])
  })

  it('submitQuiz sets status to submitted', () => {
    useQuizStore.getState().startQuiz('exam-2')
    useQuizStore.getState().submitQuiz()
    const { status, submittedAt } = useQuizStore.getState()
    expect(status).toBe('submitted')
    expect(submittedAt).toBeGreaterThan(0)
  })

  it('resetQuiz returns to idle', () => {
    useQuizStore.getState().startQuiz('exam-2')
    useQuizStore.getState().resetQuiz()
    expect(useQuizStore.getState().status).toBe('idle')
    expect(useQuizStore.getState().exam).toBeNull()
  })
})
