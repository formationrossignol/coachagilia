import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import { AteliersHome } from '.'

beforeEach(() => {
  localStorage.clear()
})

describe('AteliersHome', () => {
  it('renders all available workshops by default', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getByText('SBI — Situation Behavior Impact')).toBeInTheDocument()
    expect(screen.getByText('TRIZ — Anti-Goal')).toBeInTheDocument()
    expect(screen.getByText('Troika Consulting')).toBeInTheDocument()
  })

  it('shows intention nav by default', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /Gérer un conflit/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Facilitation/ })).not.toBeInTheDocument()
  })

  it('switches to list view on toggle click', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Liste complète/ }))
    expect(screen.getByRole('button', { name: /Facilitation/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Gérer un conflit/ })).not.toBeInTheDocument()
  })

  it('persists view preference to localStorage', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Liste complète/ }))
    expect(localStorage.getItem('ateliers-view')).toBe('list')
  })

  it('reads view preference from localStorage on mount', () => {
    localStorage.setItem('ateliers-view', 'list')
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /Facilitation/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Gérer un conflit/ })).not.toBeInTheDocument()
  })

  it('falls back to intention view when localStorage value is invalid', () => {
    localStorage.setItem('ateliers-view', 'INVALID')
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /Gérer un conflit/ })).toBeInTheDocument()
  })

  it('filters workshops by selected intention', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Trouver une cause racine/ }))
    expect(screen.getByText('Ishikawa (Fishbone)')).toBeInTheDocument()
    expect(screen.queryByText('Modèle GROW')).not.toBeInTheDocument()
  })

  it('shows all workshops when active intention is re-clicked', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Trouver une cause racine/ }))
    fireEvent.click(screen.getByRole('button', { name: /Trouver une cause racine/ }))
    expect(screen.getByText('Modèle GROW')).toBeInTheDocument()
  })

  it('filters to facilitation category in list view', () => {
    localStorage.setItem('ateliers-view', 'list')
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Facilitation/ }))
    expect(screen.getByText('Troika Consulting')).toBeInTheDocument()
    expect(screen.queryByText('SBI — Situation Behavior Impact')).not.toBeInTheDocument()
  })

  it('resets filter when switching views', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Trouver une cause racine/ }))
    fireEvent.click(screen.getByRole('button', { name: /Liste complète/ }))
    expect(screen.getByText('SBI — Situation Behavior Impact')).toBeInTheDocument()
    expect(screen.getByText('Modèle GROW')).toBeInTheDocument()
  })

  it('shows coming soon cards', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getAllByText('Bientôt').length).toBeGreaterThan(0)
  })
})
