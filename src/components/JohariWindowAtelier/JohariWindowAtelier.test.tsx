import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { JohariWindowAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'johari-window',
      slug: 'johari-window',
      title: 'Fenêtre de Johari',
      route: '/ateliers/johari-window',
      categorySlug: 'conflict-and-communication',
      toolName: 'Johari Window',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'drag-and-drop',
      summary: "Comprendre les zones d'aveuglement et améliorer la connaissance de soi dans l'équipe.",
    },
  ],
}))

vi.mock('../../features/gamification', () => {
  const storeState = {
    events: [],
    recordEvent: vi.fn(),
    getCompletedContentSlugs: () => [],
  }
  const useGamificationStore = Object.assign(
    (selector: (s: typeof storeState) => unknown) => selector(storeState),
    { getState: () => storeState }
  )
  return { useGamificationStore }
})

function renderAtelier() {
  const router = createMemoryRouter(
    [{ path: '/ateliers/johari-window', element: <JohariWindowAtelier /> }],
    { initialEntries: ['/ateliers/johari-window'] }
  )
  return render(<RouterProvider router={router} />)
}

function dragCard(cardId: string, zoneId: string) {
  const card = document.querySelector(`[data-card="${cardId}"]`)!
  const zone = document.querySelector(`[data-zone="${zoneId}"]`)!
  fireEvent.dragStart(card)
  fireEvent.dragOver(zone)
  fireEvent.drop(zone)
}

function dragSituation(situationId: string, zoneId: string) {
  const situation = document.querySelector(`[data-situation="${situationId}"]`)!
  const zone = document.querySelector(`[data-zone="${zoneId}"]`)!
  fireEvent.dragStart(situation)
  fireEvent.dragOver(zone)
  fireEvent.drop(zone)
}

describe('JohariWindowAtelier', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders phase 1 with 12 cards in the palette', () => {
    renderAtelier()
    expect(screen.getByText(/Phase 1/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-card]')).toHaveLength(12)
  })

  it('Vérifier button is disabled until all 12 cards are placed', () => {
    renderAtelier()
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).toBeDisabled()
  })

  it('places a card in a johari zone via drag-and-drop', () => {
    renderAtelier()
    dragCard('z1', 'open')
    const zone = document.querySelector('[data-zone="open"]')!
    expect(zone.querySelector('[data-card="z1"]')).toBeInTheDocument()
  })

  it('returns a card to the palette on drop on palette', () => {
    renderAtelier()
    dragCard('z1', 'open')
    const palette = document.querySelector('.tki-pool')!
    const card = document.querySelector('[data-zone="open"] [data-card="z1"]')!
    fireEvent.dragStart(card)
    fireEvent.dragOver(palette)
    fireEvent.drop(palette)
    expect(document.querySelector('.tki-pool [data-card="z1"]')).toBeInTheDocument()
  })

  it('enables Vérifier and shows 12/12 on all-correct phase 1', () => {
    renderAtelier()
    const correct = [
      ['z1','open'],['z2','open'],['z3','open'],
      ['z4','blind'],['z5','blind'],['z6','blind'],
      ['z7','hidden'],['z8','hidden'],['z9','hidden'],
      ['z10','unknown'],['z11','unknown'],['z12','unknown'],
    ]
    correct.forEach(([id, zone]) => dragCard(id, zone))
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(screen.getByText(/12 \/ 12/)).toBeInTheDocument()
    expect(screen.getByText(/Phase suivante/)).toBeInTheDocument()
  })

  it('shows Réessayer on wrong phase 1 result', () => {
    renderAtelier()
    ;['z1','z2','z3','z4','z5','z6'].forEach(id => dragCard(id, 'open'))
    ;['z7','z8','z9','z10','z11','z12'].forEach(id => dragCard(id, 'blind'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByText(/Phase suivante/)).not.toBeInTheDocument()
  })

  it('renders phase 2 with 15 situations after phase 1 success', () => {
    renderAtelier()
    const correct = [
      ['z1','open'],['z2','open'],['z3','open'],
      ['z4','blind'],['z5','blind'],['z6','blind'],
      ['z7','hidden'],['z8','hidden'],['z9','hidden'],
      ['z10','unknown'],['z11','unknown'],['z12','unknown'],
    ]
    correct.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    expect(screen.getByText(/Phase 2/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
  })

  it('places a situation in an extended zone via drag-and-drop (phase 2)', () => {
    renderAtelier()
    const correct = [
      ['z1','open'],['z2','open'],['z3','open'],
      ['z4','blind'],['z5','blind'],['z6','blind'],
      ['z7','hidden'],['z8','hidden'],['z9','hidden'],
      ['z10','unknown'],['z11','unknown'],['z12','unknown'],
    ]
    correct.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    dragSituation('s1', 'open')
    const zone = document.querySelector('[data-zone="open"]')!
    expect(zone.querySelector('[data-situation="s1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Maîtrisé on all-correct phase 2', () => {
    renderAtelier()
    const p1 = [
      ['z1','open'],['z2','open'],['z3','open'],
      ['z4','blind'],['z5','blind'],['z6','blind'],
      ['z7','hidden'],['z8','hidden'],['z9','hidden'],
      ['z10','unknown'],['z11','unknown'],['z12','unknown'],
    ]
    p1.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))

    const p2 = [
      ['s1','open'],['s2','open'],['s3','open'],
      ['s4','blind'],['s5','blind'],['s6','blind'],
      ['s7','hidden'],['s8','hidden'],['s9','hidden'],
      ['s10','unknown'],['s11','unknown'],['s12','unknown'],
      ['s13','towards-open'],['s14','towards-open'],['s15','towards-open'],
    ]
    p2.forEach(([id, zone]) => dragSituation(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Maîtrisé/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 on wrong phase 2 result', () => {
    renderAtelier()
    const p1 = [
      ['z1','open'],['z2','open'],['z3','open'],
      ['z4','blind'],['z5','blind'],['z6','blind'],
      ['z7','hidden'],['z8','hidden'],['z9','hidden'],
      ['z10','unknown'],['z11','unknown'],['z12','unknown'],
    ]
    p1.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))

    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'open'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'blind'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('resets phase 2 situations on Réessayer phase 2', () => {
    renderAtelier()
    const p1 = [
      ['z1','open'],['z2','open'],['z3','open'],
      ['z4','blind'],['z5','blind'],['z6','blind'],
      ['z7','hidden'],['z8','hidden'],['z9','hidden'],
      ['z10','unknown'],['z11','unknown'],['z12','unknown'],
    ]
    p1.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'open'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'blind'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('.tki-pool [data-situation]')).toHaveLength(15)
  })
})
