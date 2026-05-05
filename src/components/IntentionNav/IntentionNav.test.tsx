import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { IntentionNav } from '.'
import { WORKSHOP_INTENTIONS, INTENTION_WORKSHOP_MAP } from '../../data/workshops/intentions'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'

describe('IntentionNav', () => {
  const onSelect = vi.fn()

  beforeEach(() => {
    onSelect.mockClear()
  })

  it('renders all 8 intention tiles', () => {
    render(
      <IntentionNav
        intentions={WORKSHOP_INTENTIONS}
        workshopMap={INTENTION_WORKSHOP_MAP}
        workshops={WORKSHOP_DEFINITIONS}
        activeIntention={null}
        onSelect={onSelect}
      />
    )
    expect(screen.getAllByRole('button')).toHaveLength(8)
    expect(screen.getByRole('button', { name: /Gérer un conflit/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Trouver une cause racine/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Préparer un coaching/ })).toBeInTheDocument()
  })

  it('displays workshop count for each intention', () => {
    render(
      <IntentionNav
        intentions={WORKSHOP_INTENTIONS}
        workshopMap={INTENTION_WORKSHOP_MAP}
        workshops={WORKSHOP_DEFINITIONS}
        activeIntention={null}
        onSelect={onSelect}
      />
    )
    const tile = screen.getByRole('button', { name: /Gérer un conflit/ })
    expect(tile.textContent).toMatch(/\d+ ateliers?/)
  })

  it('calls onSelect with intention slug on click', () => {
    render(
      <IntentionNav
        intentions={WORKSHOP_INTENTIONS}
        workshopMap={INTENTION_WORKSHOP_MAP}
        workshops={WORKSHOP_DEFINITIONS}
        activeIntention={null}
        onSelect={onSelect}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Gérer un conflit/ }))
    expect(onSelect).toHaveBeenCalledWith('gerer-conflit')
  })

  it('calls onSelect with null when active tile is re-clicked', () => {
    render(
      <IntentionNav
        intentions={WORKSHOP_INTENTIONS}
        workshopMap={INTENTION_WORKSHOP_MAP}
        workshops={WORKSHOP_DEFINITIONS}
        activeIntention="gerer-conflit"
        onSelect={onSelect}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Gérer un conflit/ }))
    expect(onSelect).toHaveBeenCalledWith(null)
  })
})
