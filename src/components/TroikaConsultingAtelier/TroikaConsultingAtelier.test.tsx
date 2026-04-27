import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import React from 'react'
import { TroikaConsultingAtelier } from '.'

const CORRECT_ORDER = ['problem', 'clarification', 'consultants', 'reaction', 'action'] as const

const INTERVENTIONS = [
  { id: 'i1',  step: 'problem' },
  { id: 'i2',  step: 'problem' },
  { id: 'i3',  step: 'problem' },
  { id: 'i4',  step: 'clarification' },
  { id: 'i5',  step: 'clarification' },
  { id: 'i6',  step: 'clarification' },
  { id: 'i7',  step: 'consultants' },
  { id: 'i8',  step: 'consultants' },
  { id: 'i9',  step: 'consultants' },
  { id: 'i10', step: 'reaction' },
  { id: 'i11', step: 'reaction' },
  { id: 'i12', step: 'reaction' },
  { id: 'i13', step: 'action' },
  { id: 'i14', step: 'action' },
  { id: 'i15', step: 'action' },
] as const

function renderTroikaConsultingAtelier() {
  const router = createMemoryRouter(
    [{ path: '/ateliers/troika-consulting', element: <TroikaConsultingAtelier /> }],
    { initialEntries: ['/ateliers/troika-consulting'] }
  )
  return render(<RouterProvider router={router} />)
}

function placePhase1Correctly() {
  CORRECT_ORDER.forEach((step, i) => {
    fireEvent.dragStart(document.querySelector(`[data-step="${step}"]`)!)
    fireEvent.drop(document.querySelector(`[data-slot="${i}"]`)!)
  })
}

function placeAllInterventionsCorrectly() {
  INTERVENTIONS.forEach(({ id, step }) => {
    fireEvent.dragStart(document.querySelector(`[data-intervention="${id}"]`)!)
    fireEvent.drop(document.querySelector(`[data-step-zone="${step}"]`)!)
  })
}

function reachPhase2() {
  renderTroikaConsultingAtelier()
  placePhase1Correctly()
  fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
  fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
}

function reachPhase3() {
  reachPhase2()
  placeAllInterventionsCorrectly()
  fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
  fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
}

describe('TroikaConsultingAtelier — Phase 1', () => {
  it('renders 5 step cards in pool initially', () => {
    renderTroikaConsultingAtelier()
    expect(document.querySelectorAll('[data-step]')).toHaveLength(5)
  })

  it('disables Vérifier when not all slots filled', () => {
    renderTroikaConsultingAtelier()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('enables Vérifier after all 5 steps placed', () => {
    renderTroikaConsultingAtelier()
    placePhase1Correctly()
    expect(screen.getByRole('button', { name: 'Vérifier' })).not.toBeDisabled()
  })

  it('shows 5/5 and Phase suivante on correct placement', () => {
    renderTroikaConsultingAtelier()
    placePhase1Correctly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/5 \/ 5 correct/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })

  it('shows Réessayer on wrong placement', () => {
    renderTroikaConsultingAtelier()
    const wrongOrder = [...CORRECT_ORDER].reverse()
    wrongOrder.forEach((step, i) => {
      fireEvent.dragStart(document.querySelector(`[data-step="${step}"]`)!)
      fireEvent.drop(document.querySelector(`[data-slot="${i}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Phase suivante/ })).not.toBeInTheDocument()
  })
})

describe('TroikaConsultingAtelier — Phase 2', () => {
  it('renders 15 intervention cards in pool initially', () => {
    reachPhase2()
    expect(document.querySelectorAll('[data-intervention]')).toHaveLength(15)
  })

  it('disables Vérifier when not all interventions assigned', () => {
    reachPhase2()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('shows 15/15 on all-correct placement', () => {
    reachPhase2()
    placeAllInterventionsCorrectly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15 correct/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 and Phase suivante after verification', () => {
    reachPhase2()
    INTERVENTIONS.forEach(({ id }) => {
      fireEvent.dragStart(document.querySelector(`[data-intervention="${id}"]`)!)
      fireEvent.drop(document.querySelector('[data-step-zone="problem"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })
})

describe('TroikaConsultingAtelier — Phase 3', () => {
  it('disables Vérifier ma simulation when fields empty', () => {
    reachPhase3()
    expect(screen.getByRole('button', { name: 'Vérifier ma simulation' })).toBeDisabled()
  })

  it('enables Vérifier ma simulation after all fields filled', () => {
    reachPhase3()
    fireEvent.change(document.querySelector('[data-question-input="1"]')!, { target: { value: 'Comment as-tu géré cela ?' } })
    fireEvent.change(document.querySelector('[data-question-input="2"]')!, { target: { value: "Qu'as-tu déjà essayé ?" } })
    fireEvent.change(document.querySelector('[data-advice-input="advice"]')!, { target: { value: "Il semble que l'équipe manque de sécurité psychologique." } })
    expect(screen.getByRole('button', { name: 'Vérifier ma simulation' })).not.toBeDisabled()
  })

  it('shows score after verify', () => {
    reachPhase3()
    fireEvent.change(document.querySelector('[data-question-input="1"]')!, { target: { value: 'test question' } })
    fireEvent.change(document.querySelector('[data-question-input="2"]')!, { target: { value: 'autre question' } })
    fireEvent.change(document.querySelector('[data-advice-input="advice"]')!, { target: { value: 'un conseil' } })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier ma simulation' }))
    expect(screen.getByText(/\/ 3 items Troika/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 3 after verify', () => {
    reachPhase3()
    fireEvent.change(document.querySelector('[data-question-input="1"]')!, { target: { value: 'test' } })
    fireEvent.change(document.querySelector('[data-question-input="2"]')!, { target: { value: 'test' } })
    fireEvent.change(document.querySelector('[data-advice-input="advice"]')!, { target: { value: 'test' } })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier ma simulation' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 3' })).toBeInTheDocument()
  })

  it('shows Excellent badge on good answers with phase2 >= 13', () => {
    reachPhase3()
    fireEvent.change(document.querySelector('[data-question-input="1"]')!, { target: { value: 'Comment as-tu essayé de les motiver ?' } })
    fireEvent.change(document.querySelector('[data-question-input="2"]')!, { target: { value: "Qu'est-ce qui fonctionne déjà un peu ?" } })
    fireEvent.change(document.querySelector('[data-advice-input="advice"]')!, { target: { value: "Il semble que l'équipe manque d'espace pour s'exprimer librement." } })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier ma simulation' }))
    expect(screen.getByText(/Excellent/)).toBeInTheDocument()
  })
})
