import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { EmpathyMapAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'empathy-map',
      slug: 'empathy-map',
      title: 'Empathy Map',
      route: '/ateliers/empathy-map',
      categorySlug: 'team-intelligence',
      toolName: 'Empathy Map',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'drag-and-drop',
      summary: "Mieux comprendre les besoins et émotions d'un utilisateur ou d'un membre d'équipe.",
    },
  ],
}))

vi.mock('../../features/gamification', () => {
  const storeState = {
    events: [] as unknown[],
    recordEvent: vi.fn(),
    getCompletedContentSlugs: () => [] as string[],
  }
  const useGamificationStore = Object.assign(
    (selector: (s: typeof storeState) => unknown) => selector(storeState),
    { getState: () => storeState }
  )
  return { useGamificationStore }
})

function renderAtelier() {
  const router = createMemoryRouter(
    [{ path: '/ateliers/empathy-map', element: <EmpathyMapAtelier /> }],
    { initialEntries: ['/ateliers/empathy-map'] }
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

describe('EmpathyMapAtelier', () => {
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

  it('places a card in a core zone via drag-and-drop', () => {
    renderAtelier()
    dragCard('c1', 'says')
    const zone = document.querySelector('[data-zone="says"]')!
    expect(zone.querySelector('[data-card="c1"]')).toBeInTheDocument()
  })

  it('returns a card to the palette on drop on palette', () => {
    renderAtelier()
    dragCard('c1', 'says')
    const palette = document.querySelector('.tki-pool')!
    const card = document.querySelector('[data-zone="says"] [data-card="c1"]')!
    fireEvent.dragStart(card)
    fireEvent.dragOver(palette)
    fireEvent.drop(palette)
    expect(document.querySelector('.tki-pool [data-card="c1"]')).toBeInTheDocument()
  })

  it('enables Vérifier and shows 12/12 on all-correct phase 1', () => {
    renderAtelier()
    const correct = [
      ['c1','says'],['c2','says'],['c3','says'],
      ['c4','thinks'],['c5','thinks'],['c6','thinks'],
      ['c7','does'],['c8','does'],['c9','does'],
      ['c10','feels'],['c11','feels'],['c12','feels'],
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
    ;['c1','c2','c3','c4','c5','c6'].forEach(id => dragCard(id, 'says'))
    ;['c7','c8','c9','c10','c11','c12'].forEach(id => dragCard(id, 'thinks'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByText(/Phase suivante/)).not.toBeInTheDocument()
  })

  it('renders phase 2 with 15 extended cards after phase 1 success', () => {
    renderAtelier()
    const correct = [
      ['c1','says'],['c2','says'],['c3','says'],
      ['c4','thinks'],['c5','thinks'],['c6','thinks'],
      ['c7','does'],['c8','does'],['c9','does'],
      ['c10','feels'],['c11','feels'],['c12','feels'],
    ]
    correct.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    expect(screen.getByText(/Phase 2/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-card]')).toHaveLength(15)
  })

  it('places an extended card in a zone via drag-and-drop (phase 2)', () => {
    renderAtelier()
    const correct = [
      ['c1','says'],['c2','says'],['c3','says'],
      ['c4','thinks'],['c5','thinks'],['c6','thinks'],
      ['c7','does'],['c8','does'],['c9','does'],
      ['c10','feels'],['c11','feels'],['c12','feels'],
    ]
    correct.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    dragCard('e1', 'says')
    const zone = document.querySelector('[data-zone="says"]')!
    expect(zone.querySelector('[data-card="e1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Maîtrisé on all-correct phase 2', () => {
    renderAtelier()
    const p1 = [
      ['c1','says'],['c2','says'],['c3','says'],
      ['c4','thinks'],['c5','thinks'],['c6','thinks'],
      ['c7','does'],['c8','does'],['c9','does'],
      ['c10','feels'],['c11','feels'],['c12','feels'],
    ]
    p1.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))

    const p2 = [
      ['e1','says'],['e2','says'],['e3','says'],
      ['e4','thinks'],['e5','thinks'],['e6','thinks'],
      ['e7','does'],['e8','does'],['e9','does'],
      ['e10','feels'],['e11','feels'],['e12','feels'],
      ['e13','needs'],['e14','needs'],['e15','needs'],
    ]
    p2.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Maîtrisé/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 on wrong phase 2 result', () => {
    renderAtelier()
    const p1 = [
      ['c1','says'],['c2','says'],['c3','says'],
      ['c4','thinks'],['c5','thinks'],['c6','thinks'],
      ['c7','does'],['c8','does'],['c9','does'],
      ['c10','feels'],['c11','feels'],['c12','feels'],
    ]
    p1.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))

    ;['e1','e2','e3','e4','e5','e6','e7','e8'].forEach(id => dragCard(id, 'says'))
    ;['e9','e10','e11','e12','e13','e14','e15'].forEach(id => dragCard(id, 'thinks'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('resets phase 2 cards on Réessayer phase 2', () => {
    renderAtelier()
    const p1 = [
      ['c1','says'],['c2','says'],['c3','says'],
      ['c4','thinks'],['c5','thinks'],['c6','thinks'],
      ['c7','does'],['c8','does'],['c9','does'],
      ['c10','feels'],['c11','feels'],['c12','feels'],
    ]
    p1.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['e1','e2','e3','e4','e5','e6','e7','e8'].forEach(id => dragCard(id, 'says'))
    ;['e9','e10','e11','e12','e13','e14','e15'].forEach(id => dragCard(id, 'thinks'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('.tki-pool [data-card]')).toHaveLength(15)
  })
})
