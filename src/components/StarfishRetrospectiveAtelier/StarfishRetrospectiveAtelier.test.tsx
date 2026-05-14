import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { StarfishRetrospectiveAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'starfish',
      slug: 'starfish',
      title: 'Rétrospective Starfish',
      route: '/ateliers/starfish',
      categorySlug: 'retrospectives',
      toolName: 'Starfish Retrospective',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'drag-and-drop',
      summary: "Nuancer l'amélioration continue : amplifier, réduire, commencer, arrêter et conserver.",
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
    [{ path: '/ateliers/starfish', element: <StarfishRetrospectiveAtelier /> }],
    { initialEntries: ['/ateliers/starfish'] }
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
  ['p1c1', 'more-of'], ['p1c2', 'more-of'], ['p1c3', 'more-of'],
  ['p1c4', 'less-of'], ['p1c5', 'less-of'], ['p1c6', 'less-of'],
  ['p1c7', 'start'], ['p1c8', 'start'], ['p1c9', 'start'],
  ['p1c10', 'stop'], ['p1c11', 'stop'], ['p1c12', 'stop'],
  ['p1c13', 'keep'], ['p1c14', 'keep'], ['p1c15', 'keep'],
]

const CORRECT_P2: [string, string][] = [
  ['s1', 'more-of'], ['s2', 'more-of'], ['s3', 'more-of'],
  ['s4', 'less-of'], ['s5', 'less-of'], ['s6', 'less-of'],
  ['s7', 'start'], ['s8', 'start'], ['s9', 'start'],
  ['s10', 'stop'], ['s11', 'stop'], ['s12', 'stop'],
  ['s13', 'keep'], ['s14', 'keep'], ['s15', 'keep'],
]

describe('StarfishRetrospectiveAtelier', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders phase 1 with 15 cards in pool', () => {
    renderAtelier()
    expect(screen.getByText(/Phase 1/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-card]')).toHaveLength(15)
  })

  it('Vérifier button is disabled until all 15 cards are placed', () => {
    renderAtelier()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('places a card in a zone via drag-and-drop', () => {
    renderAtelier()
    dragCard('p1c1', 'more-of')
    const zone = document.querySelector('[data-column="more-of"]')!
    expect(zone.querySelector('[data-card="p1c1"]')).toBeInTheDocument()
  })

  it('returns a card to pool on drop on pool', () => {
    renderAtelier()
    dragCard('p1c1', 'more-of')
    const pool = document.querySelector('.tki-pool')!
    const card = document.querySelector('[data-column="more-of"] [data-card="p1c1"]')!
    fireEvent.dragStart(card)
    fireEvent.dragOver(pool)
    fireEvent.drop(pool)
    expect(document.querySelector('.tki-pool [data-card="p1c1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Phase suivante on all-correct phase 1', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Phase suivante/)).toBeInTheDocument()
  })

  it('shows Réessayer on wrong phase 1 result', () => {
    renderAtelier()
    ;['p1c1','p1c2','p1c3'].forEach(id => dragCard(id, 'stop'))
    ;['p1c4','p1c5','p1c6'].forEach(id => dragCard(id, 'more-of'))
    ;['p1c7','p1c8','p1c9'].forEach(id => dragCard(id, 'keep'))
    ;['p1c10','p1c11','p1c12'].forEach(id => dragCard(id, 'start'))
    ;['p1c13','p1c14','p1c15'].forEach(id => dragCard(id, 'less-of'))
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
    dragSituation('s1', 'more-of')
    const column = document.querySelector('[data-column="more-of"]')!
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
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'stop'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'more-of'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('resets phase 2 situations on Réessayer phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'stop'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'more-of'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('.tki-pool [data-situation]')).toHaveLength(15)
  })
})
