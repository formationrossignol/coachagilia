import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { RadicalCandorAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'radical-candor',
      slug: 'radical-candor',
      title: 'Radical Candor',
      route: '/ateliers/radical-candor',
      categorySlug: 'conflict-and-communication',
      toolName: 'Radical Candor',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'drag-and-drop',
      summary: 'Apprendre à défier directement tout en montrant que vous vous souciez personnellement.',
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
    [{ path: '/ateliers/radical-candor', element: <RadicalCandorAtelier /> }],
    { initialEntries: ['/ateliers/radical-candor'] }
  )
  return render(<RouterProvider router={router} />)
}

function dragLabel(quadrantId: string, zoneId: string) {
  const label = document.querySelector(`[data-label="${quadrantId}"]`)!
  const zone = document.querySelector(`[data-zone="${zoneId}"]`)!
  fireEvent.dragStart(label)
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
  ['ruinous-empathy', 'top-left'],
  ['radical-candor', 'top-right'],
  ['manipulative-insincerity', 'bottom-left'],
  ['obnoxious-aggression', 'bottom-right'],
]

const CORRECT_P2: [string, string][] = [
  ['s1', 'radical-candor'], ['s2', 'radical-candor'], ['s3', 'radical-candor'],
  ['s4', 'ruinous-empathy'], ['s5', 'ruinous-empathy'], ['s6', 'ruinous-empathy'],
  ['s7', 'obnoxious-aggression'], ['s8', 'obnoxious-aggression'], ['s9', 'obnoxious-aggression'],
  ['s10', 'manipulative-insincerity'], ['s11', 'manipulative-insincerity'], ['s12', 'manipulative-insincerity'],
  ['s13', 'towards-radical-candor'], ['s14', 'towards-radical-candor'], ['s15', 'towards-radical-candor'],
]

describe('RadicalCandorAtelier', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders phase 1 with 4 labels in the palette', () => {
    renderAtelier()
    expect(screen.getByText(/Phase 1/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-label]')).toHaveLength(4)
  })

  it('Vérifier button is disabled until all 4 labels are placed', () => {
    renderAtelier()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('places a label in a diagram zone via drag-and-drop', () => {
    renderAtelier()
    dragLabel('radical-candor', 'top-right')
    const zone = document.querySelector('[data-zone="top-right"]')!
    expect(zone.querySelector('[data-label="radical-candor"]')).toBeInTheDocument()
  })

  it('returns a label to palette on drop on palette', () => {
    renderAtelier()
    dragLabel('radical-candor', 'top-right')
    const palette = document.querySelector('.scrum-palette')!
    const label = document.querySelector('[data-zone="top-right"] [data-label="radical-candor"]')!
    fireEvent.dragStart(label)
    fireEvent.dragOver(palette)
    fireEvent.drop(palette)
    expect(document.querySelector('.scrum-palette [data-label="radical-candor"]')).toBeInTheDocument()
  })

  it('shows 4/4 and Phase suivante on all-correct phase 1', () => {
    renderAtelier()
    CORRECT_P1.forEach(([label, zone]) => dragLabel(label, zone))
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(screen.getByText(/4 \/ 4/)).toBeInTheDocument()
    expect(screen.getByText(/Phase suivante/)).toBeInTheDocument()
  })

  it('shows Réessayer on wrong phase 1 result', () => {
    renderAtelier()
    dragLabel('radical-candor', 'top-left')
    dragLabel('ruinous-empathy', 'top-right')
    dragLabel('obnoxious-aggression', 'bottom-left')
    dragLabel('manipulative-insincerity', 'bottom-right')
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByText(/Phase suivante/)).not.toBeInTheDocument()
  })

  it('renders phase 2 with 15 situations after phase 1 success', () => {
    renderAtelier()
    CORRECT_P1.forEach(([label, zone]) => dragLabel(label, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    expect(screen.getByText(/Phase 2/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
  })

  it('places a situation in a column via drag-and-drop (phase 2)', () => {
    renderAtelier()
    CORRECT_P1.forEach(([label, zone]) => dragLabel(label, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    dragSituation('s1', 'radical-candor')
    const column = document.querySelector('[data-column="radical-candor"]')!
    expect(column.querySelector('[data-situation="s1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Maîtrisé on all-correct phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([label, zone]) => dragLabel(label, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    CORRECT_P2.forEach(([id, col]) => dragSituation(id, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Maîtrisé/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 on wrong phase 2 result', () => {
    renderAtelier()
    CORRECT_P1.forEach(([label, zone]) => dragLabel(label, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'ruinous-empathy'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'radical-candor'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('resets phase 2 situations on Réessayer phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([label, zone]) => dragLabel(label, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'ruinous-empathy'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'radical-candor'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('.tki-pool [data-situation]')).toHaveLength(15)
  })
})
