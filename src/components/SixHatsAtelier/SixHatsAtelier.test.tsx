import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { SixHatsAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'six-hats',
      slug: 'six-hats',
      title: 'Six Chapeaux de Bono',
      route: '/ateliers/six-hats',
      categorySlug: 'facilitation',
      toolName: 'Six Thinking Hats',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'drag-and-drop',
      summary: 'Structurer la réflexion collective en explorant 6 perspectives distinctes.',
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
    [{ path: '/ateliers/six-hats', element: <SixHatsAtelier /> }],
    { initialEntries: ['/ateliers/six-hats'] }
  )
  return render(<RouterProvider router={router} />)
}

function dragCard(cardId: string, hatId: string) {
  const card = document.querySelector(`[data-card="${cardId}"]`)!
  const hat = document.querySelector(`[data-hat="${hatId}"]`)!
  fireEvent.dragStart(card)
  fireEvent.dragOver(hat)
  fireEvent.drop(hat)
}

function dragSituation(situationId: string, intentId: string) {
  const situation = document.querySelector(`[data-situation="${situationId}"]`)!
  const intent = document.querySelector(`[data-intent="${intentId}"]`)!
  fireEvent.dragStart(situation)
  fireEvent.dragOver(intent)
  fireEvent.drop(intent)
}

describe('SixHatsAtelier', () => {
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

  it('places a card in a hat via drag-and-drop', () => {
    renderAtelier()
    dragCard('c1', 'white')
    const hat = document.querySelector('[data-hat="white"]')!
    expect(hat.querySelector('[data-card="c1"]')).toBeInTheDocument()
  })

  it('returns a card to the palette on drop on palette', () => {
    renderAtelier()
    dragCard('c1', 'white')
    const palette = document.querySelector('.tki-pool')!
    const card = document.querySelector('[data-hat="white"] [data-card="c1"]')!
    fireEvent.dragStart(card)
    fireEvent.dragOver(palette)
    fireEvent.drop(palette)
    expect(document.querySelector('.tki-pool [data-card="c1"]')).toBeInTheDocument()
  })

  it('enables Vérifier and shows 12/12 on all-correct phase 1', () => {
    renderAtelier()
    const correct = [
      ['c1','white'],['c2','white'],
      ['c3','red'],['c4','red'],
      ['c5','black'],['c6','black'],
      ['c7','yellow'],['c8','yellow'],
      ['c9','green'],['c10','green'],
      ['c11','blue'],['c12','blue'],
    ]
    correct.forEach(([id, hat]) => dragCard(id, hat))
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(screen.getByText(/12 \/ 12/)).toBeInTheDocument()
    expect(screen.getByText(/Phase suivante/)).toBeInTheDocument()
  })

  it('shows Réessayer on wrong phase 1 result', () => {
    renderAtelier()
    ;['c1','c2','c3','c4','c5','c6'].forEach(id => dragCard(id, 'white'))
    ;['c7','c8','c9','c10','c11','c12'].forEach(id => dragCard(id, 'red'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByText(/Phase suivante/)).not.toBeInTheDocument()
  })

  it('renders phase 2 with 15 situations after phase 1 success', () => {
    renderAtelier()
    const correct = [
      ['c1','white'],['c2','white'],
      ['c3','red'],['c4','red'],
      ['c5','black'],['c6','black'],
      ['c7','yellow'],['c8','yellow'],
      ['c9','green'],['c10','green'],
      ['c11','blue'],['c12','blue'],
    ]
    correct.forEach(([id, hat]) => dragCard(id, hat))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    expect(screen.getByText(/Phase 2/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
  })

  it('places a situation in an intent via drag-and-drop (phase 2)', () => {
    renderAtelier()
    const correct = [
      ['c1','white'],['c2','white'],
      ['c3','red'],['c4','red'],
      ['c5','black'],['c6','black'],
      ['c7','yellow'],['c8','yellow'],
      ['c9','green'],['c10','green'],
      ['c11','blue'],['c12','blue'],
    ]
    correct.forEach(([id, hat]) => dragCard(id, hat))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    dragSituation('s1', 'objectify')
    const intent = document.querySelector('[data-intent="objectify"]')!
    expect(intent.querySelector('[data-situation="s1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Maîtrisé on all-correct phase 2', () => {
    renderAtelier()
    const p1 = [
      ['c1','white'],['c2','white'],
      ['c3','red'],['c4','red'],
      ['c5','black'],['c6','black'],
      ['c7','yellow'],['c8','yellow'],
      ['c9','green'],['c10','green'],
      ['c11','blue'],['c12','blue'],
    ]
    p1.forEach(([id, hat]) => dragCard(id, hat))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))

    const p2 = [
      ['s1','objectify'],['s2','objectify'],['s3','objectify'],
      ['s4','feel'],['s5','feel'],['s6','feel'],
      ['s7','secure'],['s8','secure'],['s9','secure'],
      ['s10','value'],['s11','value'],['s12','value'],
      ['s13','imagine'],['s14','imagine'],
      ['s15','structure'],
    ]
    p2.forEach(([id, intent]) => dragSituation(id, intent))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Maîtrisé/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 on wrong phase 2 result', () => {
    renderAtelier()
    const p1 = [
      ['c1','white'],['c2','white'],
      ['c3','red'],['c4','red'],
      ['c5','black'],['c6','black'],
      ['c7','yellow'],['c8','yellow'],
      ['c9','green'],['c10','green'],
      ['c11','blue'],['c12','blue'],
    ]
    p1.forEach(([id, hat]) => dragCard(id, hat))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))

    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'objectify'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'feel'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('resets phase 2 situations on Réessayer phase 2', () => {
    renderAtelier()
    const p1 = [
      ['c1','white'],['c2','white'],
      ['c3','red'],['c4','red'],
      ['c5','black'],['c6','black'],
      ['c7','yellow'],['c8','yellow'],
      ['c9','green'],['c10','green'],
      ['c11','blue'],['c12','blue'],
    ]
    p1.forEach(([id, hat]) => dragCard(id, hat))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'objectify'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'feel'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('.tki-pool [data-situation]')).toHaveLength(15)
  })
})
