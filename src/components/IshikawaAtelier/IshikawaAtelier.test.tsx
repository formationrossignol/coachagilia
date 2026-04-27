import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { IshikawaAtelier } from '.'

const CORRECT_PLACEMENTS = [
  ['b0', 'people'], ['b1', 'process'], ['b2', 'tools'],
  ['b3', 'product'], ['b4', 'environment'], ['b5', 'management'],
] as const

const CAUSES = [
  { id: 'c1',  category: 'people' },  { id: 'c2',  category: 'people' },  { id: 'c3',  category: 'people' },
  { id: 'c4',  category: 'process' }, { id: 'c5',  category: 'process' }, { id: 'c6',  category: 'process' },
  { id: 'c7',  category: 'tools' },   { id: 'c8',  category: 'tools' },   { id: 'c9',  category: 'tools' },
  { id: 'c10', category: 'product' }, { id: 'c11', category: 'product' }, { id: 'c12', category: 'product' },
  { id: 'c13', category: 'environment' }, { id: 'c14', category: 'environment' }, { id: 'c15', category: 'environment' },
  { id: 'c16', category: 'management' },  { id: 'c17', category: 'management' },  { id: 'c18', category: 'management' },
] as const

function placePhase1Correctly() {
  CORRECT_PLACEMENTS.forEach(([branchId, category]) => {
    fireEvent.dragStart(document.querySelector(`[data-category="${category}"]`)!)
    fireEvent.drop(document.querySelector(`[data-branch="${branchId}"]`)!)
  })
}

function placeAllCausesCorrectly() {
  CAUSES.forEach(({ id, category }) => {
    fireEvent.dragStart(document.querySelector(`[data-cause="${id}"]`)!)
    fireEvent.drop(document.querySelector(`[data-category-zone="${category}"]`)!)
  })
}

function reachPhase2() {
  render(<IshikawaAtelier />)
  placePhase1Correctly()
  fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
  fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
}

function reachPhase3() {
  reachPhase2()
  placeAllCausesCorrectly()
  fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
  fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
}

describe('IshikawaAtelier — Phase 1', () => {
  it('renders 6 category labels in palette', () => {
    render(<IshikawaAtelier />)
    expect(document.querySelectorAll('[data-category]')).toHaveLength(6)
  })

  it('disables Vérifier when not all branches filled', () => {
    render(<IshikawaAtelier />)
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('enables Vérifier after all 6 labels placed', () => {
    render(<IshikawaAtelier />)
    placePhase1Correctly()
    expect(screen.getByRole('button', { name: 'Vérifier' })).not.toBeDisabled()
  })

  it('shows 6/6 and Phase suivante on correct placement', () => {
    render(<IshikawaAtelier />)
    placePhase1Correctly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/6 \/ 6 correct/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })

  it('shows Réessayer on wrong placement', () => {
    render(<IshikawaAtelier />)
    const wrong = [
      ['b0', 'management'], ['b1', 'environment'], ['b2', 'product'],
      ['b3', 'tools'], ['b4', 'process'], ['b5', 'people'],
    ] as const
    wrong.forEach(([branchId, category]) => {
      fireEvent.dragStart(document.querySelector(`[data-category="${category}"]`)!)
      fireEvent.drop(document.querySelector(`[data-branch="${branchId}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Phase suivante/ })).not.toBeInTheDocument()
  })
})

describe('IshikawaAtelier — Phase 2', () => {
  it('renders 18 cause cards in pool initially', () => {
    reachPhase2()
    expect(document.querySelectorAll('[data-cause]')).toHaveLength(18)
  })

  it('disables Vérifier when not all causes assigned', () => {
    reachPhase2()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('shows 18/18 on all-correct placement', () => {
    reachPhase2()
    placeAllCausesCorrectly()
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/18 \/ 18 correct/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 and Phase suivante after verification', () => {
    reachPhase2()
    CAUSES.forEach(({ id }) => {
      fireEvent.dragStart(document.querySelector(`[data-cause="${id}"]`)!)
      fireEvent.drop(document.querySelector('[data-category-zone="people"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })
})

describe('IshikawaAtelier — Phase 3', () => {
  it('renders 18 cause items with checkboxes', () => {
    reachPhase3()
    expect(document.querySelectorAll('[data-root-cause]')).toHaveLength(18)
  })

  it('disables Valider when fewer than 2 causes selected', () => {
    reachPhase3()
    expect(screen.getByRole('button', { name: 'Valider mon analyse' })).toBeDisabled()
  })

  it('enables Valider after 2 causes selected with fields filled', () => {
    reachPhase3()
    fireEvent.click(document.querySelector('[data-root-cause="c1"] input[type="checkbox"]')!)
    fireEvent.click(document.querySelector('[data-root-cause="c2"] input[type="checkbox"]')!)
    fireEvent.change(document.querySelector('[data-justification="c1"]')!, { target: { value: 'Cause fréquente et impactante' } })
    fireEvent.change(document.querySelector('[data-justification="c2"]')!, { target: { value: 'Cause récurrente identifiée' } })
    fireEvent.change(document.querySelector('[data-action="c1"]')!, { target: { value: 'Mettre en place des ateliers' } })
    fireEvent.change(document.querySelector('[data-action="c2"]')!, { target: { value: 'Formation des équipes' } })
    expect(screen.getByRole('button', { name: 'Valider mon analyse' })).not.toBeDisabled()
  })

  it('shows Analyse complétée badge when phase2 is 18/18', () => {
    reachPhase3()
    fireEvent.click(document.querySelector('[data-root-cause="c1"] input[type="checkbox"]')!)
    fireEvent.click(document.querySelector('[data-root-cause="c2"] input[type="checkbox"]')!)
    fireEvent.change(document.querySelector('[data-justification="c1"]')!, { target: { value: 'Cause fréquente et impactante' } })
    fireEvent.change(document.querySelector('[data-justification="c2"]')!, { target: { value: 'Cause récurrente identifiée' } })
    fireEvent.change(document.querySelector('[data-action="c1"]')!, { target: { value: 'Mettre en place des ateliers' } })
    fireEvent.change(document.querySelector('[data-action="c2"]')!, { target: { value: 'Formation des équipes' } })
    fireEvent.click(screen.getByRole('button', { name: 'Valider mon analyse' }))
    expect(screen.getByText('Analyse complétée')).toBeInTheDocument()
  })

  it('shows Réessayer phase 3 after validation', () => {
    reachPhase3()
    fireEvent.click(document.querySelector('[data-root-cause="c1"] input[type="checkbox"]')!)
    fireEvent.click(document.querySelector('[data-root-cause="c2"] input[type="checkbox"]')!)
    fireEvent.change(document.querySelector('[data-justification="c1"]')!, { target: { value: 'Cause fréquente' } })
    fireEvent.change(document.querySelector('[data-justification="c2"]')!, { target: { value: 'Cause récurrente' } })
    fireEvent.change(document.querySelector('[data-action="c1"]')!, { target: { value: 'Action 1' } })
    fireEvent.change(document.querySelector('[data-action="c2"]')!, { target: { value: 'Action 2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Valider mon analyse' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 3' })).toBeInTheDocument()
  })

  it('limits selection to 4 causes maximum', () => {
    reachPhase3()
    ;['c1', 'c2', 'c3', 'c4'].forEach(id => {
      fireEvent.click(document.querySelector(`[data-root-cause="${id}"] input[type="checkbox"]`)!)
    })
    expect(document.querySelector('[data-root-cause="c5"] input[type="checkbox"]')).toHaveProperty('disabled', true)
  })
})

describe('IshikawaAtelier — Structure fishbone', () => {
  it('renders SVG avec colonne vertébrale, queue, tête et 6 zones de dépôt', () => {
    render(<IshikawaAtelier />)
    const svg = document.querySelector('.ishi-fishbone__svg')
    expect(svg).toBeInTheDocument()
    expect(svg!.querySelector('line[x1="70"][y1="140"][x2="680"][y2="140"]')).toBeInTheDocument()
    expect(svg!.querySelector('polyline')).toBeInTheDocument()
    expect(svg!.querySelector('path')).toBeInTheDocument()
    expect(document.querySelector('.ishi-effect-label')).toBeInTheDocument()
    expect(document.querySelectorAll('[data-branch]')).toHaveLength(6)
    expect(svg!.querySelectorAll('line')).toHaveLength(7) // 1 spine + 6 bones
  })
})
