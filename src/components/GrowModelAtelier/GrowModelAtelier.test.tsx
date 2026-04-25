import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { GrowModelAtelier } from '.'

const CORRECT_ORDER = ['goal', 'reality', 'options', 'will']

function placeAllCorrectly() {
  CORRECT_ORDER.forEach((stepKey, i) => {
    fireEvent.dragStart(document.querySelector(`[data-step="${stepKey}"]`)!)
    fireEvent.drop(document.querySelector(`[data-slot="slot-${i + 1}"]`)!)
  })
}

describe('GrowModelAtelier — Phase 1', () => {
  it('renders 4 GROW step cards in the palette', () => {
    render(<GrowModelAtelier />)
    expect(document.querySelectorAll('[data-step]')).toHaveLength(4)
  })

  it('disables Vérifier button when not all slots are filled', () => {
    render(<GrowModelAtelier />)
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('enables Vérifier after all 4 steps are placed', () => {
    render(<GrowModelAtelier />)
    placeAllCorrectly()
    expect(screen.getByRole('button', { name: 'Vérifier' })).not.toBeDisabled()
  })

  it('shows 4/4 and Phase suivante button on perfect placement', () => {
    render(<GrowModelAtelier />)
    placeAllCorrectly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/4 \/ 4 correct/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })

  it('shows Réessayer button when placement is wrong', () => {
    render(<GrowModelAtelier />)
    ;[...CORRECT_ORDER].reverse().forEach((stepKey, i) => {
      fireEvent.dragStart(document.querySelector(`[data-step="${stepKey}"]`)!)
      fireEvent.drop(document.querySelector(`[data-slot="slot-${i + 1}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Phase suivante/ })).not.toBeInTheDocument()
  })
})

describe('GrowModelAtelier — Phase 2', () => {
  function reachPhase2() {
    render(<GrowModelAtelier />)
    placeAllCorrectly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
  }

  it('renders 16 question cards in the pool after entering phase 2', () => {
    reachPhase2()
    expect(document.querySelectorAll('[data-question]')).toHaveLength(16)
  })

  it('disables Vérifier when not all questions are assigned', () => {
    reachPhase2()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('shows 16/16 on all-correct assignment', () => {
    reachPhase2()
    const stepById: Record<string, string> = {
      q1: 'goal',    q2: 'goal',    q3: 'goal',    q4: 'goal',
      q5: 'reality', q6: 'reality', q7: 'reality', q8: 'reality',
      q9: 'options', q10:'options', q11:'options', q12:'options',
      q13:'will',    q14:'will',    q15:'will',    q16:'will',
    }
    document.querySelectorAll('[data-question]').forEach(card => {
      const id = card.getAttribute('data-question')!
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector(`[data-mode="${stepById[id]}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/16 \/ 16 correct/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 button after verification', () => {
    reachPhase2()
    document.querySelectorAll('[data-question]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-mode="goal"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('returns questions to pool after Réessayer phase 2', () => {
    reachPhase2()
    document.querySelectorAll('[data-question]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-mode="goal"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('[data-question]')).toHaveLength(16)
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })
})
