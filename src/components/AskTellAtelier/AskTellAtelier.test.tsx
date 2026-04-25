import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AskTellAtelier } from '.'

function placePhase1Correctly() {
  fireEvent.dragStart(screen.getByText('Posture directive'))
  fireEvent.drop(document.querySelector('[data-zone="tell"]')!)
  fireEvent.dragStart(screen.getByText('Posture de coaching'))
  fireEvent.drop(document.querySelector('[data-zone="ask"]')!)
}

describe('AskTellAtelier — Phase 1', () => {
  it('renders 2 stance labels in the palette', () => {
    render(<AskTellAtelier />)
    expect(screen.getByText('Posture directive')).toBeInTheDocument()
    expect(screen.getByText('Posture de coaching')).toBeInTheDocument()
  })

  it('disables Vérifier when not all zones are filled', () => {
    render(<AskTellAtelier />)
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('enables Vérifier after both labels are placed', () => {
    render(<AskTellAtelier />)
    placePhase1Correctly()
    expect(screen.getByRole('button', { name: 'Vérifier' })).not.toBeDisabled()
  })

  it('shows 2/2 and Phase suivante on perfect placement', () => {
    render(<AskTellAtelier />)
    placePhase1Correctly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/2 \/ 2 correct/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })

  it('shows Réessayer on wrong placement', () => {
    render(<AskTellAtelier />)
    fireEvent.dragStart(screen.getByText('Posture directive'))
    fireEvent.drop(document.querySelector('[data-zone="ask"]')!)
    fireEvent.dragStart(screen.getByText('Posture de coaching'))
    fireEvent.drop(document.querySelector('[data-zone="tell"]')!)
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Phase suivante/ })).not.toBeInTheDocument()
  })
})

describe('AskTellAtelier — Phase 2', () => {
  function reachPhase2() {
    render(<AskTellAtelier />)
    placePhase1Correctly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
  }

  it('renders 14 situation cards in the pool', () => {
    reachPhase2()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(14)
  })

  it('disables Vérifier when not all situations are assigned', () => {
    reachPhase2()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('shows 14/14 on all-correct placement', () => {
    reachPhase2()
    const stanceById: Record<string, string> = {
      s1: 'tell', s2: 'tell', s3: 'tell', s4: 'tell', s5: 'tell', s6: 'tell', s7: 'tell',
      s8: 'ask',  s9: 'ask',  s10: 'ask', s11: 'ask', s12: 'ask', s13: 'ask', s14: 'ask',
    }
    document.querySelectorAll('[data-situation]').forEach(card => {
      const id = card.getAttribute('data-situation')!
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector(`[data-mode="${stanceById[id]}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/14 \/ 14 correct/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 and Phase suivante after verification', () => {
    reachPhase2()
    document.querySelectorAll('[data-situation]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-mode="tell"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })
})

describe('AskTellAtelier — Phase 3', () => {
  function reachPhase3() {
    render(<AskTellAtelier />)
    placePhase1Correctly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    document.querySelectorAll('[data-situation]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-mode="tell"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
  }

  it('renders 7 reformulation inputs', () => {
    reachPhase3()
    expect(document.querySelectorAll('[data-reformulation-id]')).toHaveLength(7)
  })

  it('disables Vérifier mes reformulations when inputs are empty', () => {
    reachPhase3()
    expect(screen.getByRole('button', { name: 'Vérifier mes reformulations' })).toBeDisabled()
  })

  it('enables Vérifier after all inputs are filled', () => {
    reachPhase3()
    document.querySelectorAll('[data-reformulation-id]').forEach(input => {
      fireEvent.change(input, { target: { value: 'Comment pourrais-tu aborder ce point ?' } })
    })
    expect(screen.getByRole('button', { name: 'Vérifier mes reformulations' })).not.toBeDisabled()
  })

  it('shows score after verification', () => {
    reachPhase3()
    document.querySelectorAll('[data-reformulation-id]').forEach(input => {
      fireEvent.change(input, { target: { value: 'Comment pourrais-tu aborder ce point ?' } })
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier mes reformulations' }))
    expect(screen.getByText(/\/ 7 questions réflexives/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 3 after verification', () => {
    reachPhase3()
    document.querySelectorAll('[data-reformulation-id]').forEach(input => {
      fireEvent.change(input, { target: { value: 'x' } })
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier mes reformulations' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 3' })).toBeInTheDocument()
  })

  it('detects open question pattern correctly', () => {
    reachPhase3()
    const inputs = document.querySelectorAll('[data-reformulation-id]')
    fireEvent.change(inputs[0], { target: { value: "Comment peux-tu améliorer cela ?" } })
    for (let i = 1; i < inputs.length; i++) {
      fireEvent.change(inputs[i], { target: { value: 'x' } })
    }
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier mes reformulations' }))
    const okIndicators = document.querySelectorAll('.at-indicator--ok')
    expect(okIndicators.length).toBeGreaterThan(0)
  })
})
