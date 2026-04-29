import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LearningPathTimeline } from './LearningPathTimeline'
import { LEARNING_PATHS } from '../../features/gamification'

const path = LEARNING_PATHS[0]  // 4 steps

describe('LearningPathTimeline', () => {
  it('renders a step for each path step', () => {
    const { container } = render(
      <MemoryRouter>
        <LearningPathTimeline path={path} completedSlugs={[]} />
      </MemoryRouter>
    )
    expect(container.querySelectorAll('.learning-path-timeline__step')).toHaveLength(path.steps.length)
  })

  it('marks completed steps', () => {
    const { container } = render(
      <MemoryRouter>
        <LearningPathTimeline path={path} completedSlugs={['thomas-kilmann']} />
      </MemoryRouter>
    )
    expect(container.querySelectorAll('.learning-path-timeline__step--completed')).toHaveLength(1)
  })

  it('shows optional label for non-required steps', () => {
    const facilitation = LEARNING_PATHS.find(p => p.slug === 'facilitation')!
    render(
      <MemoryRouter>
        <LearningPathTimeline path={facilitation} completedSlugs={[]} />
      </MemoryRouter>
    )
    expect(screen.getByText(/optionnel/i)).toBeInTheDocument()
  })
})
