import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LearningPathCard } from './LearningPathCard'
import { LEARNING_PATHS } from '../../features/gamification'

const path = LEARNING_PATHS[0]  // gestion-de-conflit
const progress = { slug: path.slug, completedSteps: [], requiredTotal: 4, requiredCompleted: 0, isComplete: false }

describe('LearningPathCard', () => {
  it('renders path title', () => {
    render(<MemoryRouter><LearningPathCard path={path} progress={progress} /></MemoryRouter>)
    expect(screen.getByText(path.title)).toBeInTheDocument()
  })

  it('shows progress fraction', () => {
    render(<MemoryRouter><LearningPathCard path={path} progress={progress} /></MemoryRouter>)
    expect(screen.getByText(/0 \/ 4/)).toBeInTheDocument()
  })

  it('renders Continuer link to /paths/:slug', () => {
    render(<MemoryRouter><LearningPathCard path={path} progress={progress} /></MemoryRouter>)
    const link = screen.getByRole('link', { name: /continuer/i })
    expect(link).toHaveAttribute('href', `/paths/${path.slug}`)
  })

  it('shows completed state when isComplete', () => {
    const done = { ...progress, isComplete: true, requiredCompleted: 4 }
    const { container } = render(<MemoryRouter><LearningPathCard path={path} progress={done} /></MemoryRouter>)
    expect(container.querySelector('.learning-path-card--complete')).toBeInTheDocument()
  })
})
