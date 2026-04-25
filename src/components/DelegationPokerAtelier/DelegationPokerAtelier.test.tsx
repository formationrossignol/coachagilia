import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DelegationPokerAtelier } from '.'

const CORRECT_ORDER = ['tell', 'sell', 'consult', 'agree', 'advise', 'inquire', 'delegate']

function placeAllCorrectly() {
  CORRECT_ORDER.forEach((levelKey, i) => {
    fireEvent.dragStart(document.querySelector(`[data-level="${levelKey}"]`)!)
    fireEvent.drop(document.querySelector(`[data-slot="slot-${i + 1}"]`)!)
  })
}

describe('DelegationPokerAtelier — Phase 1', () => {
  it('renders 7 delegation level cards in the palette', () => {
    render(<DelegationPokerAtelier />)
    expect(document.querySelectorAll('[data-level]')).toHaveLength(7)
  })

  it('disables Vérifier button when not all slots are filled', () => {
    render(<DelegationPokerAtelier />)
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('enables Vérifier after all 7 levels are placed', () => {
    render(<DelegationPokerAtelier />)
    placeAllCorrectly()
    expect(screen.getByRole('button', { name: 'Vérifier' })).not.toBeDisabled()
  })

  it('shows 7/7 and Phase suivante button on perfect placement', () => {
    render(<DelegationPokerAtelier />)
    placeAllCorrectly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/7 \/ 7 correct/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })

  it('shows Réessayer button when placement is wrong', () => {
    render(<DelegationPokerAtelier />)
    // Place in reverse order (wrong)
    ;[...CORRECT_ORDER].reverse().forEach((levelKey, i) => {
      fireEvent.dragStart(document.querySelector(`[data-level="${levelKey}"]`)!)
      fireEvent.drop(document.querySelector(`[data-slot="slot-${i + 1}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Phase suivante/ })).not.toBeInTheDocument()
  })
})

describe('DelegationPokerAtelier — Phase 2', () => {
  function reachPhase2() {
    render(<DelegationPokerAtelier />)
    placeAllCorrectly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
  }

  it('renders 14 situation cards in the pool after entering phase 2', () => {
    reachPhase2()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(14)
  })

  it('disables Vérifier when not all situations are assigned', () => {
    reachPhase2()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('shows 14/14 on all-correct assignment', () => {
    reachPhase2()
    const levelById: Record<string, string> = {
      s1: 'tell',     s2: 'tell',
      s3: 'sell',     s4: 'sell',
      s5: 'consult',  s6: 'consult',
      s7: 'agree',    s8: 'agree',
      s9: 'advise',   s10: 'advise',
      s11: 'inquire', s12: 'inquire',
      s13: 'delegate',s14: 'delegate',
    }
    document.querySelectorAll('[data-situation]').forEach(card => {
      const id = card.getAttribute('data-situation')!
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector(`[data-mode="${levelById[id]}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/14 \/ 14 correct/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 button after verification', () => {
    reachPhase2()
    document.querySelectorAll('[data-situation]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-mode="tell"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('returns situations to pool after Réessayer phase 2', () => {
    reachPhase2()
    document.querySelectorAll('[data-situation]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-mode="tell"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(14)
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })
})
