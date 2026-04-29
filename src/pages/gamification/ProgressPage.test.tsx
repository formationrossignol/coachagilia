import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProgressPage } from './ProgressPage'

vi.mock('../../features/gamification', () => ({
  useGamificationStore: (sel: any) => sel({
    getTotalXp: () => 500,
    getAllSkillXp: () => ({ conflict: 200 }),
    events: [],
    artifacts: [],
    getUnlockedBadgeIds: () => [],
    getCompletedContentSlugs: () => [],
    deleteArtifact: vi.fn(),
    markArtifactExported: vi.fn(),
  }),
  LEARNING_PATHS: [],
  BADGES: [],
  computePathProgress: () => ({ slug: '', completedSteps: [], requiredTotal: 0, requiredCompleted: 0, isComplete: false }),
  MASTERY_THRESHOLDS: { discovery: 0, practice: 300, proficiency: 900, field_application: 1800, transmission: 3000 },
  MASTERY_LABELS: { discovery: 'Découverte', practice: 'Pratique', proficiency: 'Maîtrise', field_application: 'Application terrain', transmission: 'Transmission' },
}))

describe('ProgressPage', () => {
  it('renders the page title', () => {
    render(<MemoryRouter><ProgressPage /></MemoryRouter>)
    expect(screen.getByText(/progression/i)).toBeInTheDocument()
  })

  it('renders XP summary', () => {
    render(<MemoryRouter><ProgressPage /></MemoryRouter>)
    expect(screen.getByText('XP total')).toBeInTheDocument()
  })
})
