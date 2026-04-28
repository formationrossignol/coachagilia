import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { CynefinFrameworkAtelier } from '.'

type CynefinDomain = 'clear' | 'complicated' | 'complex' | 'chaotic' | 'disorder'

const DOMAIN_IDS: CynefinDomain[] = ['clear', 'complicated', 'complex', 'chaotic', 'disorder']

const SITUATIONS: { id: string; domain: CynefinDomain }[] = [
  { id: 'cl1', domain: 'clear' },
  { id: 'cl2', domain: 'clear' },
  { id: 'cl3', domain: 'clear' },
  { id: 'co1', domain: 'complicated' },
  { id: 'co2', domain: 'complicated' },
  { id: 'co3', domain: 'complicated' },
  { id: 'cx1', domain: 'complex' },
  { id: 'cx2', domain: 'complex' },
  { id: 'cx3', domain: 'complex' },
  { id: 'ch1', domain: 'chaotic' },
  { id: 'ch2', domain: 'chaotic' },
  { id: 'ch3', domain: 'chaotic' },
  { id: 'd1',  domain: 'disorder' },
  { id: 'd2',  domain: 'disorder' },
  { id: 'd3',  domain: 'disorder' },
]

function renderCynefinFrameworkAtelier() {
  const router = createMemoryRouter(
    [{ path: '/ateliers/cynefin-framework', element: <CynefinFrameworkAtelier /> }],
    { initialEntries: ['/ateliers/cynefin-framework'] }
  )
  return render(<RouterProvider router={router} />)
}

function placeAllDomainsCorrectly() {
  DOMAIN_IDS.forEach(id => {
    fireEvent.dragStart(document.querySelector(`[data-domain="${id}"]`)!)
    fireEvent.drop(document.querySelector(`[data-zone="${id}"]`)!)
  })
}

function placeAllSituationsCorrectly() {
  SITUATIONS.forEach(({ id, domain }) => {
    fireEvent.dragStart(document.querySelector(`[data-situation="${id}"]`)!)
    fireEvent.drop(document.querySelector(`[data-domain-zone="${domain}"]`)!)
  })
}

function reachPhase2() {
  renderCynefinFrameworkAtelier()
  placeAllDomainsCorrectly()
  fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
  fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
}

function reachPhase3() {
  reachPhase2()
  placeAllSituationsCorrectly()
  fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
  fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
}

describe('CynefinFrameworkAtelier — Phase 1', () => {
  it('renders 5 domain cards in the palette initially', () => {
    renderCynefinFrameworkAtelier()
    expect(document.querySelectorAll('[data-domain]')).toHaveLength(5)
  })

  it('disables Vérifier when not all zones filled', () => {
    renderCynefinFrameworkAtelier()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('enables Vérifier after all 5 domains placed', () => {
    renderCynefinFrameworkAtelier()
    placeAllDomainsCorrectly()
    expect(screen.getByRole('button', { name: 'Vérifier' })).not.toBeDisabled()
  })

  it('shows 5/5 and Phase suivante on correct placement', () => {
    renderCynefinFrameworkAtelier()
    placeAllDomainsCorrectly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/5 \/ 5 correct/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })

  it('shows Réessayer on wrong placement', () => {
    renderCynefinFrameworkAtelier()
    // Shift all domains one position clockwise
    fireEvent.dragStart(document.querySelector('[data-domain="clear"]')!)
    fireEvent.drop(document.querySelector('[data-zone="complex"]')!)
    fireEvent.dragStart(document.querySelector('[data-domain="complicated"]')!)
    fireEvent.drop(document.querySelector('[data-zone="clear"]')!)
    fireEvent.dragStart(document.querySelector('[data-domain="complex"]')!)
    fireEvent.drop(document.querySelector('[data-zone="complicated"]')!)
    fireEvent.dragStart(document.querySelector('[data-domain="chaotic"]')!)
    fireEvent.drop(document.querySelector('[data-zone="disorder"]')!)
    fireEvent.dragStart(document.querySelector('[data-domain="disorder"]')!)
    fireEvent.drop(document.querySelector('[data-zone="chaotic"]')!)
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Phase suivante/ })).not.toBeInTheDocument()
  })
})

describe('CynefinFrameworkAtelier — Phase 2', () => {
  it('renders 15 situation cards in pool initially', () => {
    reachPhase2()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
  })

  it('disables Vérifier when not all situations assigned', () => {
    reachPhase2()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('shows 15/15 on all-correct placement', () => {
    reachPhase2()
    placeAllSituationsCorrectly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15 correct/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 and Phase suivante after verification', () => {
    reachPhase2()
    // Place everything in 'clear' (mostly wrong)
    SITUATIONS.forEach(({ id }) => {
      fireEvent.dragStart(document.querySelector(`[data-situation="${id}"]`)!)
      fireEvent.drop(document.querySelector('[data-domain-zone="clear"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })
})

describe('CynefinFrameworkAtelier — Phase 3', () => {
  it('renders 15 situation checkboxes', () => {
    reachPhase3()
    expect(document.querySelectorAll('[data-situation-checkbox]')).toHaveLength(15)
  })

  it('disables Vérifier mon plan when no situation selected', () => {
    reachPhase3()
    expect(screen.getByRole('button', { name: 'Vérifier mon plan' })).toBeDisabled()
  })

  it('enables Vérifier mon plan after selecting a situation and filling fields', () => {
    reachPhase3()
    fireEvent.click(document.querySelector('[data-situation-checkbox="cl1"]')!)
    fireEvent.change(document.querySelector('[data-posture="cl1"]')!, { target: { value: 'Standardiser le processus' } })
    fireEvent.change(document.querySelector('[data-first-action="cl1"]')!, { target: { value: 'Documenter la procédure' } })
    expect(screen.getByRole('button', { name: 'Vérifier mon plan' })).not.toBeDisabled()
  })

  it('shows coherence indicator after verify', () => {
    reachPhase3()
    fireEvent.click(document.querySelector('[data-situation-checkbox="cl1"]')!)
    fireEvent.change(document.querySelector('[data-posture="cl1"]')!, { target: { value: 'Standardiser' } })
    fireEvent.change(document.querySelector('[data-first-action="cl1"]')!, { target: { value: 'Appliquer la checklist' } })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier mon plan' }))
    expect(screen.getAllByText(/Cohérence/)).not.toHaveLength(0)
  })

  it('shows badge after verify', () => {
    reachPhase3()
    fireEvent.click(document.querySelector('[data-situation-checkbox="cl1"]')!)
    fireEvent.change(document.querySelector('[data-posture="cl1"]')!, { target: { value: 'posture' } })
    fireEvent.change(document.querySelector('[data-first-action="cl1"]')!, { target: { value: 'action' } })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier mon plan' }))
    expect(screen.getByText(/Cynefin.*(maîtrisé|améliorer)/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 3 after verify', () => {
    reachPhase3()
    fireEvent.click(document.querySelector('[data-situation-checkbox="cl1"]')!)
    fireEvent.change(document.querySelector('[data-posture="cl1"]')!, { target: { value: 'x' } })
    fireEvent.change(document.querySelector('[data-first-action="cl1"]')!, { target: { value: 'y' } })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier mon plan' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 3' })).toBeInTheDocument()
  })

  it('shows Cynefin maîtrisé badge with phase2 15/15 and coherent posture', () => {
    reachPhase3()
    fireEvent.click(document.querySelector('[data-situation-checkbox="cl1"]')!)
    fireEvent.change(document.querySelector('[data-posture="cl1"]')!, { target: { value: 'Standardiser le processus' } })
    fireEvent.change(document.querySelector('[data-first-action="cl1"]')!, { target: { value: 'Appliquer la checklist' } })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier mon plan' }))
    expect(screen.getByText(/maîtrisé/)).toBeInTheDocument()
  })
})
