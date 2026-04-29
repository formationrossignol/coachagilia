import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { BadgeGrid } from './BadgeGrid'
import { BADGES } from '../../features/gamification'

describe('BadgeGrid', () => {
  it('renders a card for each badge', () => {
    const { container } = render(
      <BadgeGrid badges={BADGES} unlockedIds={[]} events={[]} />
    )
    expect(container.querySelectorAll('.badge-card')).toHaveLength(BADGES.length)
  })

  it('puts unlocked badges before locked ones', () => {
    const targetBadge = BADGES[BADGES.length - 1]
    const { container } = render(
      <BadgeGrid badges={[targetBadge]} unlockedIds={[targetBadge.id]} events={[]} />
    )
    const card = container.querySelector('.badge-card')
    expect(card).not.toHaveClass('badge-card--locked')
  })
})
