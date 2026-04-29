import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkillsPage } from './SkillsPage'

vi.mock('../../features/gamification', () => ({
  useGamificationStore: (sel: any) => sel({
    getAllSkillXp: () => ({ conflict: 450 }),
    getMasteryLevelForSkill: () => 'practice',
    getCompletedContentSlugs: () => [],
  }),
  MASTERY_THRESHOLDS: { discovery: 0, practice: 300, proficiency: 900, field_application: 1800, transmission: 3000 },
  MASTERY_LABELS: { discovery: 'Découverte', practice: 'Pratique', proficiency: 'Maîtrise', field_application: 'Application terrain', transmission: 'Transmission' },
}))

vi.mock('../../features/gamification/recommendations', () => ({
  getRecommendations: () => [],
}))

describe('SkillsPage', () => {
  it('renders page title', () => {
    render(<SkillsPage />)
    expect(screen.getByText(/compétences/i)).toBeInTheDocument()
  })

  it('renders a card for each of the 19 skills', () => {
    const { container } = render(<SkillsPage />)
    expect(container.querySelectorAll('.skill-progress-card')).toHaveLength(19)
  })
})
