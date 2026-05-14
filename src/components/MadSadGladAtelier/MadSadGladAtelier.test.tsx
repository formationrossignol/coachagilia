import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { MadSadGladAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'mad-sad-glad',
      slug: 'mad-sad-glad',
      title: 'Mad / Sad / Glad',
      route: '/ateliers/mad-sad-glad',
      categorySlug: 'retrospectives',
      toolName: 'Mad/Sad/Glad',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'drag-and-drop',
      summary: "Explorer les émotions de l'équipe autour du Sprint.",
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
    [{ path: '/ateliers/mad-sad-glad', element: <MadSadGladAtelier /> }],
    { initialEntries: ['/ateliers/mad-sad-glad'] }
  )
  return render(<RouterProvider router={router} />)
}

function dragCard(cardId: string, columnId: string) {
  const card = document.querySelector(`[data-card="${cardId}"]`)!
  const col = document.querySelector(`[data-column="${columnId}"]`)!
  fireEvent.dragStart(card)
  fireEvent.dragOver(col)
  fireEvent.drop(col)
}

function dragSituation(situationId: string, columnId: string) {
  const situation = document.querySelector(`[data-situation="${situationId}"]`)!
  const col = document.querySelector(`[data-column="${columnId}"]`)!
  fireEvent.dragStart(situation)
  fireEvent.dragOver(col)
  fireEvent.drop(col)
}

const CORRECT_P1: [string, string][] = [
  ['mad-1', 'mad'], ['mad-2', 'mad'], ['mad-3', 'mad'], ['mad-4', 'mad'],
  ['sad-1', 'sad'], ['sad-2', 'sad'], ['sad-3', 'sad'], ['sad-4', 'sad'],
  ['glad-1', 'glad'], ['glad-2', 'glad'], ['glad-3', 'glad'], ['glad-4', 'glad'],
]

const CORRECT_P2: [string, string][] = [
  ['s1', 'mad'], ['s2', 'mad'], ['s3', 'mad'], ['s4', 'mad'], ['s5', 'mad'],
  ['s6', 'sad'], ['s7', 'sad'], ['s8', 'sad'], ['s9', 'sad'], ['s10', 'sad'],
  ['s11', 'glad'], ['s12', 'glad'], ['s13', 'glad'], ['s14', 'glad'], ['s15', 'glad'],
]

describe('MadSadGladAtelier', () => {
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

  it('places a card in a column via drag-and-drop', () => {
    renderAtelier()
    dragCard('mad-1', 'mad')
    const col = document.querySelector('[data-column="mad"]')!
    expect(col.querySelector('[data-card="mad-1"]')).toBeInTheDocument()
  })

  it('returns a card to pool on drop on pool', () => {
    renderAtelier()
    dragCard('mad-1', 'mad')
    const pool = document.querySelector('.tki-pool')!
    const card = document.querySelector('[data-column="mad"] [data-card="mad-1"]')!
    fireEvent.dragStart(card)
    fireEvent.dragOver(pool)
    fireEvent.drop(pool)
    expect(document.querySelector('.tki-pool [data-card="mad-1"]')).toBeInTheDocument()
  })

  it('shows 12/12 and Phase suivante on all-correct phase 1', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, col]) => dragCard(card, col))
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(screen.getByText(/12 \/ 12/)).toBeInTheDocument()
    expect(screen.getByText(/Phase suivante/)).toBeInTheDocument()
  })

  it('shows Réessayer on wrong phase 1 result', () => {
    renderAtelier()
    ;['mad-1', 'mad-2', 'mad-3', 'mad-4'].forEach(id => dragCard(id, 'sad'))
    ;['sad-1', 'sad-2', 'sad-3', 'sad-4'].forEach(id => dragCard(id, 'glad'))
    ;['glad-1', 'glad-2', 'glad-3', 'glad-4'].forEach(id => dragCard(id, 'mad'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByText(/Phase suivante/)).not.toBeInTheDocument()
  })

  it('renders phase 2 with 15 situations after phase 1 success', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, col]) => dragCard(card, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    expect(screen.getByText(/Phase 2/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
  })

  it('places a situation in a column via drag-and-drop (phase 2)', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, col]) => dragCard(card, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    dragSituation('s1', 'mad')
    const col = document.querySelector('[data-column="mad"]')!
    expect(col.querySelector('[data-situation="s1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Maîtrisé on all-correct phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, col]) => dragCard(card, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    CORRECT_P2.forEach(([id, col]) => dragSituation(id, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Maîtrisé/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 on wrong phase 2 result', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, col]) => dragCard(card, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'glad'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'mad'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('resets phase 2 situations on Réessayer phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, col]) => dragCard(card, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'glad'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'mad'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('.tki-pool [data-situation]')).toHaveLength(15)
  })
})
