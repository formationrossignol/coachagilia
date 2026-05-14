import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { SailboatRetrospectiveAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'sailboat',
      slug: 'sailboat',
      title: 'Sailboat Retrospective',
      route: '/ateliers/sailboat',
      categorySlug: 'retrospectives',
      toolName: 'Sailboat / Speed Boat',
      level: 'beginner',
      durationMinutes: 30,
      interactionType: 'canvas',
      summary: "Visualiser ce qui propulse et ce qui freine l'équipe comme un voilier.",
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
    [{ path: '/ateliers/sailboat', element: <SailboatRetrospectiveAtelier /> }],
    { initialEntries: ['/ateliers/sailboat'] }
  )
  return render(<RouterProvider router={router} />)
}

function dragCard(cardId: string, zoneId: string) {
  const card = document.querySelector(`[data-card="${cardId}"]`)!
  const zone = document.querySelector(`[data-column="${zoneId}"]`)!
  fireEvent.dragStart(card)
  fireEvent.dragOver(zone)
  fireEvent.drop(zone)
}

function dragSituation(situationId: string, columnId: string) {
  const situation = document.querySelector(`[data-situation="${situationId}"]`)!
  const column = document.querySelector(`[data-column="${columnId}"]`)!
  fireEvent.dragStart(situation)
  fireEvent.dragOver(column)
  fireEvent.drop(column)
}

const CORRECT_P1: [string, string][] = [
  ['p1c1', 'wind'], ['p1c2', 'wind'], ['p1c3', 'wind'],
  ['p1c4', 'anchor'], ['p1c5', 'anchor'], ['p1c6', 'anchor'],
  ['p1c7', 'rocks'], ['p1c8', 'rocks'],
  ['p1c9', 'island'], ['p1c10', 'island'],
  ['p1c11', 'sun'], ['p1c12', 'sun'],
]

const CORRECT_P2: [string, string][] = [
  ['s1', 'wind'], ['s2', 'wind'], ['s3', 'wind'],
  ['s4', 'anchor'], ['s5', 'anchor'], ['s6', 'anchor'],
  ['s7', 'rocks'], ['s8', 'rocks'], ['s9', 'rocks'],
  ['s10', 'island'], ['s11', 'island'], ['s12', 'island'],
  ['s13', 'sun'], ['s14', 'sun'], ['s15', 'sun'],
]

describe('SailboatRetrospectiveAtelier', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders phase 1 with 12 cards in pool', () => {
    renderAtelier()
    expect(screen.getByText(/Phase 1/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-card]')).toHaveLength(12)
  })

  it('Vérifier button is disabled until all 12 cards are placed', () => {
    renderAtelier()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('places a card in a zone via drag-and-drop', () => {
    renderAtelier()
    dragCard('p1c1', 'wind')
    const zone = document.querySelector('[data-column="wind"]')!
    expect(zone.querySelector('[data-card="p1c1"]')).toBeInTheDocument()
  })

  it('returns a card to pool on drop on pool', () => {
    renderAtelier()
    dragCard('p1c1', 'wind')
    const pool = document.querySelector('.tki-pool')!
    const card = document.querySelector('[data-column="wind"] [data-card="p1c1"]')!
    fireEvent.dragStart(card)
    fireEvent.dragOver(pool)
    fireEvent.drop(pool)
    expect(document.querySelector('.tki-pool [data-card="p1c1"]')).toBeInTheDocument()
  })

  it('shows 12/12 and Phase suivante on all-correct phase 1', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(screen.getByText(/12 \/ 12/)).toBeInTheDocument()
    expect(screen.getByText(/Phase suivante/)).toBeInTheDocument()
  })

  it('shows Réessayer on wrong phase 1 result', () => {
    renderAtelier()
    // Place all cards in wrong zones
    ;['p1c1','p1c2','p1c3'].forEach(id => dragCard(id, 'anchor'))
    ;['p1c4','p1c5','p1c6'].forEach(id => dragCard(id, 'wind'))
    ;['p1c7','p1c8'].forEach(id => dragCard(id, 'island'))
    ;['p1c9','p1c10'].forEach(id => dragCard(id, 'rocks'))
    ;['p1c11','p1c12'].forEach(id => dragCard(id, 'anchor'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByText(/Phase suivante/)).not.toBeInTheDocument()
  })

  it('renders phase 2 with 15 situations after phase 1 success', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    expect(screen.getByText(/Phase 2/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
  })

  it('places a situation in a column via drag-and-drop (phase 2)', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    dragSituation('s1', 'wind')
    const column = document.querySelector('[data-column="wind"]')!
    expect(column.querySelector('[data-situation="s1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Maîtrisé on all-correct phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    CORRECT_P2.forEach(([id, col]) => dragSituation(id, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Maîtrisé/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 on wrong phase 2 result', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'anchor'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'wind'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('resets phase 2 situations on Réessayer phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'anchor'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'wind'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('.tki-pool [data-situation]')).toHaveLength(15)
  })
})
