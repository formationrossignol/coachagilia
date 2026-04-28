import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { TRIZAtelier } from '.'

const BEHAVIORS = [
  { id: 'b1',  category: 'communication' },
  { id: 'b2',  category: 'communication' },
  { id: 'b3',  category: 'communication' },
  { id: 'b4',  category: 'organization' },
  { id: 'b5',  category: 'organization' },
  { id: 'b6',  category: 'organization' },
  { id: 'b7',  category: 'quality' },
  { id: 'b8',  category: 'quality' },
  { id: 'b9',  category: 'quality' },
  { id: 'b10', category: 'collaboration' },
  { id: 'b11', category: 'collaboration' },
  { id: 'b12', category: 'collaboration' },
  { id: 'b13', category: 'leadership' },
  { id: 'b14', category: 'leadership' },
  { id: 'b15', category: 'leadership' },
] as const

function renderTRIZAtelier() {
  const router = createMemoryRouter(
    [{ path: '/ateliers/triz', element: <TRIZAtelier /> }],
    { initialEntries: ['/ateliers/triz'] }
  )
  return render(<RouterProvider router={router} />)
}

function placeAllBehaviorsCorrectly() {
  BEHAVIORS.forEach(({ id, category }) => {
    fireEvent.dragStart(document.querySelector(`[data-behavior="${id}"]`)!)
    fireEvent.drop(document.querySelector(`[data-category="${category}"]`)!)
  })
}

function reachPhase2() {
  renderTRIZAtelier()
  fireEvent.change(document.querySelector('[data-antigoal-input]')!, {
    target: { value: "Créer une collaboration catastrophique dans l'équipe" },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
  fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
}

function reachPhase3() {
  reachPhase2()
  placeAllBehaviorsCorrectly()
  fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
  fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
}

function reachPhase4() {
  reachPhase3()
  fireEvent.click(document.querySelector('[data-behavior-checkbox="b1"]')!)
  fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
}

describe('TRIZAtelier — Phase 1', () => {
  it('renders anti-goal input', () => {
    renderTRIZAtelier()
    expect(document.querySelector('[data-antigoal-input]')).toBeInTheDocument()
  })

  it('disables Vérifier when input empty', () => {
    renderTRIZAtelier()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('enables Vérifier after typing anti-goal', () => {
    renderTRIZAtelier()
    fireEvent.change(document.querySelector('[data-antigoal-input]')!, {
      target: { value: 'Créer une mauvaise ambiance' },
    })
    expect(screen.getByRole('button', { name: 'Vérifier' })).not.toBeDisabled()
  })

  it('shows feedback indicators after verify', () => {
    renderTRIZAtelier()
    fireEvent.change(document.querySelector('[data-antigoal-input]')!, {
      target: { value: "Créer une collaboration catastrophique dans l'équipe" },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/Logique inversée/)).toBeInTheDocument()
    expect(screen.getByText(/Cohérence/)).toBeInTheDocument()
  })

  it('shows Phase suivante after any verify', () => {
    renderTRIZAtelier()
    fireEvent.change(document.querySelector('[data-antigoal-input]')!, {
      target: { value: 'quelque chose' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })
})

describe('TRIZAtelier — Phase 2', () => {
  it('renders 15 behavior cards in pool initially', () => {
    reachPhase2()
    expect(document.querySelectorAll('[data-behavior]')).toHaveLength(15)
  })

  it('disables Vérifier when not all behaviors assigned', () => {
    reachPhase2()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('shows 15/15 on all-correct placement', () => {
    reachPhase2()
    placeAllBehaviorsCorrectly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15 correct/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 and Phase suivante after verification', () => {
    reachPhase2()
    BEHAVIORS.forEach(({ id }) => {
      fireEvent.dragStart(document.querySelector(`[data-behavior="${id}"]`)!)
      fireEvent.drop(document.querySelector('[data-category="communication"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })
})

describe('TRIZAtelier — Phase 3', () => {
  it('renders 15 behavior checkboxes', () => {
    reachPhase3()
    expect(document.querySelectorAll('[data-behavior-checkbox]')).toHaveLength(15)
  })

  it('disables Phase suivante when no behavior selected', () => {
    reachPhase3()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeDisabled()
  })

  it('enables Phase suivante after selecting at least one behavior', () => {
    reachPhase3()
    fireEvent.click(document.querySelector('[data-behavior-checkbox="b1"]')!)
    expect(screen.getByRole('button', { name: /Phase suivante/ })).not.toBeDisabled()
  })

  it('shows frequency selector for selected behavior', () => {
    reachPhase3()
    fireEvent.click(document.querySelector('[data-behavior-checkbox="b1"]')!)
    expect(document.querySelector('[data-frequency="b1"]')).toBeInTheDocument()
  })
})

describe('TRIZAtelier — Phase 4', () => {
  it('renders action plan fields for selected behaviors', () => {
    reachPhase4()
    expect(document.querySelector('[data-stop-action="b1"]')).toBeInTheDocument()
    expect(document.querySelector('[data-alternative="b1"]')).toBeInTheDocument()
  })

  it('disables Vérifier mon plan when fields empty', () => {
    reachPhase4()
    expect(screen.getByRole('button', { name: 'Vérifier mon plan' })).toBeDisabled()
  })

  it('enables Vérifier mon plan when all fields filled', () => {
    reachPhase4()
    fireEvent.change(document.querySelector('[data-stop-action="b1"]')!, { target: { value: 'Arrêter de couper la parole' } })
    fireEvent.change(document.querySelector('[data-alternative="b1"]')!, { target: { value: "Pratiquer l'écoute active" } })
    expect(screen.getByRole('button', { name: 'Vérifier mon plan' })).not.toBeDisabled()
  })

  it('shows action indicators after verify', () => {
    reachPhase4()
    fireEvent.change(document.querySelector('[data-stop-action="b1"]')!, { target: { value: 'Je vais arrêter immédiatement' } })
    fireEvent.change(document.querySelector('[data-alternative="b1"]')!, { target: { value: "Je vais pratiquer l'écoute" } })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier mon plan' }))
    expect(screen.getAllByText(/Concrète/)).not.toHaveLength(0)
    expect(screen.getAllByText(/Contrôlable/)).not.toHaveLength(0)
  })

  it('shows badge after verify', () => {
    reachPhase4()
    fireEvent.change(document.querySelector('[data-stop-action="b1"]')!, { target: { value: 'texte' } })
    fireEvent.change(document.querySelector('[data-alternative="b1"]')!, { target: { value: 'texte' } })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier mon plan' }))
    expect(screen.getByText(/maîtrisé|améliorer/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 4 after verify', () => {
    reachPhase4()
    fireEvent.change(document.querySelector('[data-stop-action="b1"]')!, { target: { value: 'stop' } })
    fireEvent.change(document.querySelector('[data-alternative="b1"]')!, { target: { value: 'alt' } })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier mon plan' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 4' })).toBeInTheDocument()
  })

  it('shows TRIZ maîtrisé badge with phase2 >= 13', () => {
    reachPhase4()
    fireEvent.change(document.querySelector('[data-stop-action="b1"]')!, { target: { value: 'Arrêter de couper la parole' } })
    fireEvent.change(document.querySelector('[data-alternative="b1"]')!, { target: { value: "Pratiquer l'écoute active" } })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier mon plan' }))
    expect(screen.getByText(/maîtrisé/)).toBeInTheDocument()
  })
})
