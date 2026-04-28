import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { SBIAtelier } from '.'

const CORRECT_ORDER = ['situation', 'behavior', 'impact'] as const

const ITEMS = [
  { id: 's1', zone: 'situation' },
  { id: 's2', zone: 'situation' },
  { id: 's3', zone: 'situation' },
  { id: 's4', zone: 'situation' },
  { id: 'b1', zone: 'behavior' },
  { id: 'b2', zone: 'behavior' },
  { id: 'b3', zone: 'behavior' },
  { id: 'b4', zone: 'behavior' },
  { id: 'i1', zone: 'impact' },
  { id: 'i2', zone: 'impact' },
  { id: 'i3', zone: 'impact' },
  { id: 'i4', zone: 'impact' },
] as const

function renderSBIAtelier() {
  const router = createMemoryRouter(
    [{ path: '/ateliers/sbi', element: <SBIAtelier /> }],
    { initialEntries: ['/ateliers/sbi'] }
  )
  return render(<RouterProvider router={router} />)
}

function placePhase1Correctly() {
  CORRECT_ORDER.forEach((block, i) => {
    fireEvent.dragStart(document.querySelector(`[data-block="${block}"]`)!)
    fireEvent.drop(document.querySelector(`[data-slot="${i}"]`)!)
  })
}

function placeAllItemsCorrectly() {
  ITEMS.forEach(({ id, zone }) => {
    fireEvent.dragStart(document.querySelector(`[data-item="${id}"]`)!)
    fireEvent.drop(document.querySelector(`[data-zone="${zone}"]`)!)
  })
}

function reachPhase2() {
  renderSBIAtelier()
  placePhase1Correctly()
  fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
  fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
}

function reachPhase3() {
  reachPhase2()
  placeAllItemsCorrectly()
  fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
  fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
}

describe('SBIAtelier — Phase 1', () => {
  it('renders 3 block cards in pool initially', () => {
    renderSBIAtelier()
    expect(document.querySelectorAll('[data-block]')).toHaveLength(3)
  })

  it('disables Vérifier when not all slots filled', () => {
    renderSBIAtelier()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('enables Vérifier after all 3 blocks placed', () => {
    renderSBIAtelier()
    placePhase1Correctly()
    expect(screen.getByRole('button', { name: 'Vérifier' })).not.toBeDisabled()
  })

  it('shows 3/3 and Phase suivante on correct placement', () => {
    renderSBIAtelier()
    placePhase1Correctly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/3 \/ 3 correct/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })

  it('shows Réessayer on wrong placement', () => {
    renderSBIAtelier()
    const wrongOrder = ['impact', 'behavior', 'situation'] as const
    wrongOrder.forEach((block, i) => {
      fireEvent.dragStart(document.querySelector(`[data-block="${block}"]`)!)
      fireEvent.drop(document.querySelector(`[data-slot="${i}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Phase suivante/ })).not.toBeInTheDocument()
  })
})

describe('SBIAtelier — Phase 2', () => {
  it('renders 12 item cards in pool initially', () => {
    reachPhase2()
    expect(document.querySelectorAll('[data-item]')).toHaveLength(12)
  })

  it('disables Vérifier when not all items assigned', () => {
    reachPhase2()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('shows 12/12 on all-correct placement', () => {
    reachPhase2()
    placeAllItemsCorrectly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/12 \/ 12 correct/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 and Phase suivante after verification', () => {
    reachPhase2()
    ITEMS.forEach(({ id }) => {
      fireEvent.dragStart(document.querySelector(`[data-item="${id}"]`)!)
      fireEvent.drop(document.querySelector('[data-zone="situation"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })
})

describe('SBIAtelier — Phase 3', () => {
  it('disables Vérifier mon feedback when fields empty', () => {
    reachPhase3()
    expect(screen.getByRole('button', { name: 'Vérifier mon feedback' })).toBeDisabled()
  })

  it('enables Vérifier mon feedback after all fields filled', () => {
    reachPhase3()
    fireEvent.change(document.querySelector('[data-sbi-field="situation"]')!, { target: { value: 'Lors du Daily ce matin' } })
    fireEvent.change(document.querySelector('[data-sbi-field="behavior"]')!, { target: { value: 'Tu as interrompu les autres plusieurs fois' } })
    fireEvent.change(document.querySelector('[data-sbi-field="impact"]')!, { target: { value: "Cela a créé de la confusion" } })
    expect(screen.getByRole('button', { name: 'Vérifier mon feedback' })).not.toBeDisabled()
  })

  it('shows indicators after verify', () => {
    reachPhase3()
    fireEvent.change(document.querySelector('[data-sbi-field="situation"]')!, { target: { value: 'Lors du Daily ce matin' } })
    fireEvent.change(document.querySelector('[data-sbi-field="behavior"]')!, { target: { value: 'Tu as interrompu les autres plusieurs fois' } })
    fireEvent.change(document.querySelector('[data-sbi-field="impact"]')!, { target: { value: "Cela a créé de la confusion" } })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier mon feedback' }))
    expect(screen.getByText(/Contexte précis/)).toBeInTheDocument()
    expect(screen.getByText(/Observable/)).toBeInTheDocument()
    expect(screen.getByText(/Sans jugement/)).toBeInTheDocument()
    expect(screen.getByText(/Conséquence claire/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 3 after verify', () => {
    reachPhase3()
    fireEvent.change(document.querySelector('[data-sbi-field="situation"]')!, { target: { value: 'texte quelconque' } })
    fireEvent.change(document.querySelector('[data-sbi-field="behavior"]')!, { target: { value: 'texte quelconque' } })
    fireEvent.change(document.querySelector('[data-sbi-field="impact"]')!, { target: { value: 'texte quelconque' } })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier mon feedback' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 3' })).toBeInTheDocument()
  })

  it('shows Feedback SBI maîtrisé badge on good inputs with phase2 >= 10', () => {
    reachPhase3()
    fireEvent.change(document.querySelector('[data-sbi-field="situation"]')!, { target: { value: 'Lors du Daily Scrum de ce matin' } })
    fireEvent.change(document.querySelector('[data-sbi-field="behavior"]')!, { target: { value: 'Tu as interrompu plusieurs fois tes collègues' } })
    fireEvent.change(document.querySelector('[data-sbi-field="impact"]')!, { target: { value: "Cela a créé de la confusion dans l'équipe" } })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier mon feedback' }))
    expect(screen.getByText(/maîtrisé/)).toBeInTheDocument()
  })
})
