import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QuizSelector } from './index'

describe('QuizSelector', () => {
  it('renders 4 exam cards', () => {
    render(<MemoryRouter><QuizSelector /></MemoryRouter>)
    expect(screen.getAllByRole('article')).toHaveLength(4)
  })

  it('shows all four exam titles', () => {
    render(<MemoryRouter><QuizSelector /></MemoryRouter>)
    expect(screen.getByText(/examen 1/i)).toBeInTheDocument()
    expect(screen.getByText(/examen 2/i)).toBeInTheDocument()
    expect(screen.getByText(/examen 3/i)).toBeInTheDocument()
    expect(screen.getByText(/aléatoire/i)).toBeInTheDocument()
  })

  it('renders a Commencer button for each exam', () => {
    render(<MemoryRouter><QuizSelector /></MemoryRouter>)
    expect(screen.getAllByRole('button', { name: /commencer/i })).toHaveLength(4)
  })
})
