import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StakeholderMappingAtelier } from '.'

const CORRECT_PLACEMENTS: [string, string][] = [
  ['À gérer étroitement', 'high-high'],
  ['À satisfaire',        'high-low'],
  ['À informer',          'low-high'],
  ['À surveiller',        'low-low'],
]

function placeAllCorrectly() {
  CORRECT_PLACEMENTS.forEach(([label, zoneId]) => {
    fireEvent.dragStart(screen.getByText(label))
    fireEvent.drop(document.querySelector(`[data-zone="${zoneId}"]`)!)
  })
}

describe('StakeholderMappingAtelier — Phase 1', () => {
  it('renders 4 strategy labels in the palette', () => {
    render(<StakeholderMappingAtelier />)
    expect(screen.getByText('À gérer étroitement')).toBeInTheDocument()
    expect(screen.getByText('À satisfaire')).toBeInTheDocument()
    expect(screen.getByText('À informer')).toBeInTheDocument()
    expect(screen.getByText('À surveiller')).toBeInTheDocument()
  })

  it('disables Vérifier when not all zones are filled', () => {
    render(<StakeholderMappingAtelier />)
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('enables Vérifier after all 4 labels are placed', () => {
    render(<StakeholderMappingAtelier />)
    placeAllCorrectly()
    expect(screen.getByRole('button', { name: 'Vérifier' })).not.toBeDisabled()
  })

  it('shows 4/4 and Phase suivante on perfect placement', () => {
    render(<StakeholderMappingAtelier />)
    placeAllCorrectly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/4 \/ 4 correct/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })

  it('shows Réessayer on wrong placement', () => {
    render(<StakeholderMappingAtelier />)
    // Place all labels but in wrong zones
    const wrongPlacements: [string, string][] = [
      ['À gérer étroitement', 'low-low'],
      ['À satisfaire',        'low-high'],
      ['À informer',          'high-low'],
      ['À surveiller',        'high-high'],
    ]
    wrongPlacements.forEach(([label, zoneId]) => {
      fireEvent.dragStart(screen.getByText(label))
      fireEvent.drop(document.querySelector(`[data-zone="${zoneId}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Phase suivante/ })).not.toBeInTheDocument()
  })
})

describe('StakeholderMappingAtelier — Phase 2', () => {
  function reachPhase2() {
    render(<StakeholderMappingAtelier />)
    placeAllCorrectly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
  }

  it('renders 12 stakeholder cards in the pool', () => {
    reachPhase2()
    expect(document.querySelectorAll('[data-stakeholder]')).toHaveLength(12)
  })

  it('disables Vérifier when not all stakeholders are placed', () => {
    reachPhase2()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('shows 12/12 on all-correct placement', () => {
    reachPhase2()
    const zoneById: Record<string, string> = {
      sh1: 'high-high', sh2: 'high-high', sh3: 'high-high',
      sh4: 'high-low',  sh5: 'high-low',  sh6: 'high-low',
      sh7: 'low-high',  sh8: 'low-high',  sh9: 'low-high',
      sh10: 'low-low',  sh11: 'low-low',  sh12: 'low-low',
    }
    document.querySelectorAll('[data-stakeholder]').forEach(card => {
      const id = card.getAttribute('data-stakeholder')!
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector(`[data-mode="${zoneById[id]}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/12 \/ 12 correct/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 button after verification', () => {
    reachPhase2()
    document.querySelectorAll('[data-stakeholder]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-mode="high-high"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('returns stakeholders to pool after Réessayer phase 2', () => {
    reachPhase2()
    document.querySelectorAll('[data-stakeholder]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-mode="high-high"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('[data-stakeholder]')).toHaveLength(12)
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })
})
