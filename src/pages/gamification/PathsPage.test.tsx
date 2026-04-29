import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PathsPage } from './PathsPage'

vi.mock('../../features/gamification', () => ({
  useGamificationStore: (sel: any) => sel({ getCompletedContentSlugs: () => [] }),
  LEARNING_PATHS: [
    { id: 'p1', slug: 'test-path', title: 'Test Path', description: 'Desc', level: 'beginner', skillAreas: [], estimatedMinutes: 30, steps: [] },
  ],
  computePathProgress: () => ({ slug: 'test-path', completedSteps: [], requiredTotal: 0, requiredCompleted: 0, isComplete: false }),
}))

describe('PathsPage', () => {
  it('renders page title', () => {
    render(<MemoryRouter><PathsPage /></MemoryRouter>)
    expect(screen.getByText(/parcours/i)).toBeInTheDocument()
  })

  it('renders a path card for each learning path', () => {
    render(<MemoryRouter><PathsPage /></MemoryRouter>)
    expect(screen.getByText('Test Path')).toBeInTheDocument()
  })
})
