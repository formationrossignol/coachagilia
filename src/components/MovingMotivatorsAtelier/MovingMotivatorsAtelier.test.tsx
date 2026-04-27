import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import React from 'react'
import { MovingMotivatorsAtelier } from '.'

const MOTIVATOR_IDS = ['curiosity', 'honor', 'acceptance', 'mastery', 'power', 'freedom', 'relatedness', 'order', 'goal', 'status'] as const

function renderMovingMotivatorsAtelier() {
  const router = createMemoryRouter(
    [{ path: '/ateliers/moving-motivators', element: <MovingMotivatorsAtelier /> }],
    { initialEntries: ['/ateliers/moving-motivators'] }
  )
  return render(<RouterProvider router={router} />)
}

function placeAllInSlots() {
  MOTIVATOR_IDS.forEach((m, i) => {
    fireEvent.dragStart(document.querySelector(`[data-motivator="${m}"]`)!)
    fireEvent.drop(document.querySelector(`[data-slot="${i}"]`)!)
  })
}

function reachPhase2() {
  renderMovingMotivatorsAtelier()
  placeAllInSlots()
  fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
  fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
}

function rateAll(level: 'low' | 'medium' | 'high') {
  MOTIVATOR_IDS.forEach(m => {
    fireEvent.click(document.querySelector(`[data-satisfaction="${m}-${level}"]`)!)
  })
}

function reachPhase3WithCriticals() {
  reachPhase2()
  MOTIVATOR_IDS.forEach((m, i) => {
    const level = i < 5 ? 'low' : 'high'
    fireEvent.click(document.querySelector(`[data-satisfaction="${m}-${level}"]`)!)
  })
  fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
}

function reachPhase3NoCriticals() {
  reachPhase2()
  rateAll('high')
  fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
}

describe('MovingMotivatorsAtelier — Phase 1', () => {
  it('renders 10 motivator cards in the pool initially', () => {
    renderMovingMotivatorsAtelier()
    expect(document.querySelectorAll('[data-motivator]')).toHaveLength(10)
  })

  it('disables Vérifier when not all placed', () => {
    renderMovingMotivatorsAtelier()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('enables Vérifier after all 10 cards are placed', () => {
    renderMovingMotivatorsAtelier()
    placeAllInSlots()
    expect(screen.getByRole('button', { name: 'Vérifier' })).not.toBeDisabled()
  })

  it('shows "Classement enregistré" after clicking Vérifier', () => {
    renderMovingMotivatorsAtelier()
    placeAllInSlots()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/Classement enregistré/)).toBeInTheDocument()
  })

  it('shows Phase suivante button after clicking Vérifier', () => {
    renderMovingMotivatorsAtelier()
    placeAllInSlots()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })

  it('moves card to slot when dropped', () => {
    renderMovingMotivatorsAtelier()
    fireEvent.dragStart(document.querySelector('[data-motivator="curiosity"]')!)
    fireEvent.drop(document.querySelector('[data-slot="0"]')!)
    expect(document.querySelector('[data-slot="0"] [data-motivator="curiosity"]')).toBeInTheDocument()
  })
})

describe('MovingMotivatorsAtelier — Phase 2', () => {
  it('renders 10 satisfaction rows', () => {
    reachPhase2()
    expect(document.querySelectorAll('.mm-satisfaction-row')).toHaveLength(10)
  })

  it('disables Phase suivante when not all rated', () => {
    reachPhase2()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeDisabled()
  })

  it('enables Phase suivante when all motivators are rated', () => {
    reachPhase2()
    rateAll('high')
    expect(screen.getByRole('button', { name: /Phase suivante/ })).not.toBeDisabled()
  })

  it('marks top-5 row as critical when satisfaction is low', () => {
    reachPhase2()
    fireEvent.click(document.querySelector('[data-satisfaction="curiosity-low"]')!)
    expect(document.querySelector('.mm-satisfaction-row--critical')).toBeInTheDocument()
    expect(screen.getByText('Critique')).toBeInTheDocument()
  })

  it('does not mark row critical when rank > 5 has low satisfaction', () => {
    reachPhase2()
    // freedom is at index 5 (rank 6) in the default placement
    fireEvent.click(document.querySelector('[data-satisfaction="freedom-low"]')!)
    expect(document.querySelector('.mm-satisfaction-row--critical')).not.toBeInTheDocument()
  })
})

describe('MovingMotivatorsAtelier — Phase 3 (with criticals)', () => {
  it('renders one action item per critical motivator', () => {
    reachPhase3WithCriticals()
    expect(document.querySelectorAll('[data-action-motivator]')).toHaveLength(5)
  })

  it("disables Valider when action fields are empty", () => {
    reachPhase3WithCriticals()
    expect(screen.getByRole('button', { name: "Valider mon plan d'action" })).toBeDisabled()
  })

  it("enables Valider after all fields are filled", () => {
    reachPhase3WithCriticals()
    document.querySelectorAll('[data-field="action"]').forEach(input => {
      fireEvent.change(input, { target: { value: 'Organiser une session de partage' } })
    })
    document.querySelectorAll('[data-field="first-step"]').forEach(input => {
      fireEvent.change(input, { target: { value: 'Envoyer un message dès lundi' } })
    })
    expect(screen.getByRole('button', { name: "Valider mon plan d'action" })).not.toBeDisabled()
  })

  it('shows Profil complété badge after validation', () => {
    reachPhase3WithCriticals()
    document.querySelectorAll('[data-field="action"]').forEach(input => {
      fireEvent.change(input, { target: { value: 'Organiser une session de partage' } })
    })
    document.querySelectorAll('[data-field="first-step"]').forEach(input => {
      fireEvent.change(input, { target: { value: 'Envoyer un message dès lundi' } })
    })
    fireEvent.click(screen.getByRole('button', { name: "Valider mon plan d'action" }))
    expect(screen.getByText('Profil complété')).toBeInTheDocument()
  })

  it('shows top 3 motivators in result', () => {
    reachPhase3WithCriticals()
    document.querySelectorAll('[data-field="action"]').forEach(input => {
      fireEvent.change(input, { target: { value: 'Organiser une session de partage' } })
    })
    document.querySelectorAll('[data-field="first-step"]').forEach(input => {
      fireEvent.change(input, { target: { value: 'Envoyer un message dès lundi' } })
    })
    fireEvent.click(screen.getByRole('button', { name: "Valider mon plan d'action" }))
    expect(screen.getByText(/Top 3 motivateurs/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 3 after validation', () => {
    reachPhase3WithCriticals()
    document.querySelectorAll('[data-field="action"]').forEach(input => {
      fireEvent.change(input, { target: { value: 'Organiser une session de partage' } })
    })
    document.querySelectorAll('[data-field="first-step"]').forEach(input => {
      fireEvent.change(input, { target: { value: 'Envoyer un message dès lundi' } })
    })
    fireEvent.click(screen.getByRole('button', { name: "Valider mon plan d'action" }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 3' })).toBeInTheDocument()
  })

  it('resets action plan on Réessayer phase 3', () => {
    reachPhase3WithCriticals()
    document.querySelectorAll('[data-field="action"]').forEach(input => {
      fireEvent.change(input, { target: { value: 'Organiser une session de partage' } })
    })
    document.querySelectorAll('[data-field="first-step"]').forEach(input => {
      fireEvent.change(input, { target: { value: 'Envoyer un message dès lundi' } })
    })
    fireEvent.click(screen.getByRole('button', { name: "Valider mon plan d'action" }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 3' }))
    expect(screen.getByRole('button', { name: "Valider mon plan d'action" })).toBeDisabled()
    expect(document.querySelectorAll('[data-action-motivator]')).toHaveLength(5)
  })
})

describe('MovingMotivatorsAtelier — Phase 3 (no criticals)', () => {
  it('shows no-critical message', () => {
    reachPhase3NoCriticals()
    expect(screen.getByText(/Aucun motivateur critique/)).toBeInTheDocument()
  })

  it('shows Profil complété badge directly', () => {
    reachPhase3NoCriticals()
    expect(screen.getByText('Profil complété')).toBeInTheDocument()
  })

  it('does not render any action items', () => {
    reachPhase3NoCriticals()
    expect(document.querySelectorAll('[data-action-motivator]')).toHaveLength(0)
  })
})
