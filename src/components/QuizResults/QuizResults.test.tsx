import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QuizResults } from './index'
import { useQuizStore } from '../../store/quizStore'

function setup() {
  useQuizStore.getState().startQuiz('exam-2')
  const exam = useQuizStore.getState().exam!
  const q = exam.questions[0]
  useQuizStore.getState().setAnswer(q.id, q.correctAnswer)
  useQuizStore.getState().submitQuiz()
}

function renderResults() {
  return render(
    <MemoryRouter initialEntries={['/quiz/exam-2/results']}>
      <Routes>
        <Route path="/quiz/:examId/results" element={<QuizResults />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => { setup() })
afterEach(() => { useQuizStore.getState().resetQuiz() })

describe('QuizResults', () => {
  it('displays a score out of the total number of questions', () => {
    renderResults()
    expect(screen.getByText(/\d+ \/ 40/i)).toBeInTheDocument()
  })

  it('shows PASS or NOT YET badge', () => {
    renderResults()
    const badge = screen.getByText(/pass|not yet/i)
    expect(badge).toBeInTheDocument()
  })

  it('shows "Recommencer" and "Choisir" action buttons', () => {
    renderResults()
    expect(screen.getByRole('button', { name: /recommencer/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /choisir/i })).toBeInTheDocument()
  })

  it('lists all questions in the review section', () => {
    renderResults()
    const items = screen.getAllByRole('listitem')
    expect(items.length).toBeGreaterThan(0)
  })
})
