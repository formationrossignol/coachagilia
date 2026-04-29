import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkillProgressCard } from './SkillProgressCard'

describe('SkillProgressCard', () => {
  const defaultProps = {
    skill: 'conflict' as const,
    xp: 450,
    level: 'practice' as const,
    recommendations: ['thomas-kilmann', 'sbi'],
  }

  it('displays the French skill name', () => {
    render(<SkillProgressCard {...defaultProps} />)
    expect(screen.getByText('Conflit')).toBeInTheDocument()
  })

  it('displays the XP amount', () => {
    render(<SkillProgressCard {...defaultProps} />)
    expect(screen.getByText('450 XP')).toBeInTheDocument()
  })

  it('renders a MasteryLevelBadge with the correct level', () => {
    render(<SkillProgressCard {...defaultProps} />)
    expect(screen.getByText('Pratique')).toBeInTheDocument()
  })

  it('shows recommendations when provided', () => {
    render(<SkillProgressCard {...defaultProps} />)
    expect(screen.getByText('thomas-kilmann')).toBeInTheDocument()
    expect(screen.getByText('sbi')).toBeInTheDocument()
  })

  it('does not render recommendations section when array is empty', () => {
    const { container } = render(
      <SkillProgressCard {...defaultProps} recommendations={[]} />
    )
    expect(container.querySelector('.skill-progress-card__recs')).toBeNull()
  })

  it('renders a progressbar', () => {
    render(<SkillProgressCard {...defaultProps} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})
