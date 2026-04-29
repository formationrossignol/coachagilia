import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { PathDetailPage } from './PathDetailPage'

vi.mock('../../features/gamification', () => ({
  useGamificationStore: (sel: any) => sel({ getCompletedContentSlugs: () => [], events: [], getUnlockedBadgeIds: () => [] }),
  LEARNING_PATHS: [
    {
      id: 'p1', slug: 'test-path', title: 'Parcours Test', description: 'Desc',
      level: 'beginner', skillAreas: [], estimatedMinutes: 30,
      steps: [{ order: 1, contentType: 'workshop', contentSlug: 'thomas-kilmann', required: true }],
    },
  ],
  BADGES: [],
  computePathProgress: () => ({ slug: 'test-path', completedSteps: [], requiredTotal: 1, requiredCompleted: 0, isComplete: false }),
}))

describe('PathDetailPage', () => {
  it('renders the path title', () => {
    render(
      <MemoryRouter initialEntries={['/paths/test-path']}>
        <Routes>
          <Route path="/paths/:slug" element={<PathDetailPage />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Parcours Test')).toBeInTheDocument()
  })

  it('renders 404 message for unknown slug', () => {
    render(
      <MemoryRouter initialEntries={['/paths/nonexistent']}>
        <Routes>
          <Route path="/paths/:slug" element={<PathDetailPage />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText(/introuvable/i)).toBeInTheDocument()
  })
})
