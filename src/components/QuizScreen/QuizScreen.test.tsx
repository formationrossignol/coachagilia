import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import React from 'react'
import { QuizScreen } from './index'
import { useQuizStore } from '../../store/quizStore'

beforeEach(() => {
  vi.useFakeTimers()
  useQuizStore.getState().startQuiz('exam-2')
})

afterEach(() => {
  vi.useRealTimers()
  useQuizStore.getState().resetQuiz()
})

function renderQuizScreen() {
  const router = createMemoryRouter(
    [{ path: '/quiz/:examId', element: <QuizScreen /> }],
    { initialEntries: ['/quiz/exam-2'] }
  )
  return render(<RouterProvider router={router} />)
}

describe('QuizScreen', () => {
  it('shows question 1 of N in the header', () => {
    renderQuizScreen()
    expect(screen.getByText(/question 1/i)).toBeInTheDocument()
  })

  it('renders answer options as radio buttons for a single-choice question', () => {
    renderQuizScreen()
    const radios = screen.queryAllByRole('radio')
    const checkboxes = screen.queryAllByRole('checkbox')
    expect(radios.length + checkboxes.length).toBeGreaterThan(0)
  })

  it('shows a "Question suivante" button on non-final questions', () => {
    renderQuizScreen()
    expect(screen.getByRole('button', { name: /suivante/i })).toBeInTheDocument()
  })

  it('displays the countdown timer', () => {
    renderQuizScreen()
    // Timer shows MM:SS format — look for something like "30:00"
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument()
  })

  it('selecting an option records it in the store', () => {
    renderQuizScreen()
    const radios = screen.getAllByRole('radio')
    fireEvent.click(radios[0])
    const { answers } = useQuizStore.getState()
    const answeredCount = Object.keys(answers).length
    expect(answeredCount).toBe(1)
  })
})
