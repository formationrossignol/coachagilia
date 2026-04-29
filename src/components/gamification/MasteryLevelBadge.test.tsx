import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MasteryLevelBadge } from './MasteryLevelBadge'

describe('MasteryLevelBadge', () => {
  it('renders French label for discovery', () => {
    render(<MasteryLevelBadge level="discovery" />)
    expect(screen.getByText('Découverte')).toBeInTheDocument()
  })

  it('renders French label for transmission', () => {
    render(<MasteryLevelBadge level="transmission" />)
    expect(screen.getByText('Transmission')).toBeInTheDocument()
  })

  it('applies the correct BEM modifier class', () => {
    const { container } = render(<MasteryLevelBadge level="practice" />)
    expect(container.querySelector('.mastery-badge--practice')).toBeInTheDocument()
  })
})
