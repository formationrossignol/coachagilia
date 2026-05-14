import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { CelebrationGridAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'celebration-grid',
      slug: 'celebration-grid',
      title: 'Celebration Grid',
      route: '/ateliers/celebration-grid',
      categorySlug: 'management-3-0',
      toolName: 'Celebration Grid',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'matrix',
      summary: 'Distinguer succès et échecs liés aux pratiques vs à la chance pour célébrer intelligemment.',
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
    [{ path: '/ateliers/celebration-grid', element: <CelebrationGridAtelier /> }],
    { initialEntries: ['/ateliers/celebration-grid'] }
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

const CORRECT_P1: [string, string][] = [
  ['mistake-success-1', 'mistake-success'],
  ['mistake-success-2', 'mistake-success'],
  ['mistake-failure-1', 'mistake-failure'],
  ['mistake-failure-2', 'mistake-failure'],
  ['experiment-success-1', 'experiment-success'],
  ['experiment-success-2', 'experiment-success'],
  ['experiment-failure-1', 'experiment-failure'],
  ['experiment-failure-2', 'experiment-failure'],
  ['practice-success-1', 'practice-success'],
  ['practice-success-2', 'practice-success'],
  ['practice-failure-1', 'practice-failure'],
  ['practice-failure-2', 'practice-failure'],
]

const CORRECT_P2: [string, string][] = [
  ['situation-1', 'mistake-success'],
  ['situation-2', 'mistake-success'],
  ['situation-3', 'mistake-failure'],
  ['situation-4', 'mistake-failure'],
  ['situation-5', 'mistake-failure'],
  ['situation-6', 'experiment-success'],
  ['situation-7', 'experiment-success'],
  ['situation-8', 'experiment-success'],
  ['situation-9', 'experiment-failure'],
  ['situation-10', 'experiment-failure'],
  ['situation-11', 'experiment-failure'],
  ['situation-12', 'practice-success'],
  ['situation-13', 'practice-success'],
  ['situation-14', 'practice-failure'],
  ['situation-15', 'practice-failure'],
]

describe('CelebrationGridAtelier', () => {
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
    dragCard('mistake-success-1', 'mistake-success')
    const zone = document.querySelector('[data-zone="mistake-success"]')!
    expect(zone.querySelector('[data-card="mistake-success-1"]')).toBeInTheDocument()
  })

  it('returns a card to pool on drop on pool', () => {
    renderAtelier()
    dragCard('mistake-success-1', 'mistake-success')
    const pool = document.querySelector('.tki-pool')!
    const card = document.querySelector('[data-zone="mistake-success"] [data-card="mistake-success-1"]')!
    fireEvent.dragStart(card)
    fireEvent.dragOver(pool)
    fireEvent.drop(pool)
    expect(document.querySelector('.tki-pool [data-card="mistake-success-1"]')).toBeInTheDocument()
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
    ;['mistake-success-1', 'mistake-success-2'].forEach(id => dragCard(id, 'practice-failure'))
    ;['mistake-failure-1', 'mistake-failure-2'].forEach(id => dragCard(id, 'practice-success'))
    ;['experiment-success-1', 'experiment-success-2'].forEach(id => dragCard(id, 'mistake-failure'))
    ;['experiment-failure-1', 'experiment-failure-2'].forEach(id => dragCard(id, 'mistake-success'))
    ;['practice-success-1', 'practice-success-2'].forEach(id => dragCard(id, 'experiment-failure'))
    ;['practice-failure-1', 'practice-failure-2'].forEach(id => dragCard(id, 'experiment-success'))
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

  it('places a situation in a zone via drag-and-drop (phase 2)', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    dragSituation('situation-1', 'mistake-success')
    const zone = document.querySelector('[data-zone="mistake-success"]')!
    expect(zone.querySelector('[data-situation="situation-1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Maîtrisé on all-correct phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    CORRECT_P2.forEach(([id, zone]) => dragSituation(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Maîtrisé/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 on wrong phase 2 result', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['situation-1','situation-2','situation-3','situation-4','situation-5'].forEach(id => dragSituation(id, 'practice-success'))
    ;['situation-6','situation-7','situation-8','situation-9','situation-10'].forEach(id => dragSituation(id, 'mistake-failure'))
    ;['situation-11','situation-12','situation-13','situation-14','situation-15'].forEach(id => dragSituation(id, 'experiment-failure'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('resets phase 2 situations on Réessayer phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['situation-1','situation-2','situation-3','situation-4','situation-5'].forEach(id => dragSituation(id, 'practice-success'))
    ;['situation-6','situation-7','situation-8','situation-9','situation-10'].forEach(id => dragSituation(id, 'mistake-failure'))
    ;['situation-11','situation-12','situation-13','situation-14','situation-15'].forEach(id => dragSituation(id, 'experiment-failure'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('.tki-pool [data-situation]')).toHaveLength(15)
  })
})
