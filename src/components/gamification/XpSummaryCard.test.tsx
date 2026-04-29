import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { XpSummaryCard } from './XpSummaryCard'

describe('XpSummaryCard', () => {
  it('displays the XP value formatted for fr-FR locale', () => {
    const { container } = render(<XpSummaryCard totalXp={1250} />)
    expect(container.querySelector('.xp-summary-card__value')?.textContent).toBe(
      (1250).toLocaleString('fr-FR')
    )
  })

  it('shows "XP total" label', () => {
    render(<XpSummaryCard totalXp={0} />)
    expect(screen.getByText('XP total')).toBeInTheDocument()
  })
})
