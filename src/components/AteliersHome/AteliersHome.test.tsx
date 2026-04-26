import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { AteliersHome } from '.'

describe('AteliersHome', () => {
  it('renders all available workshops by default', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getByText('SBI — Situation Behavior Impact')).toBeInTheDocument()
    expect(screen.getByText('TRIZ — Anti-Goal')).toBeInTheDocument()
    expect(screen.getByText('Troika Consulting')).toBeInTheDocument()
  })

  it('renders category navigation', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /Facilitation/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Management 3\.0/ })).toBeInTheDocument()
  })

  it('filters to facilitation category workshops only', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Facilitation/ }))
    expect(screen.getByText('Troika Consulting')).toBeInTheDocument()
    expect(screen.queryByText('SBI — Situation Behavior Impact')).not.toBeInTheDocument()
  })

  it('resets filter when active category clicked again', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Facilitation/ }))
    fireEvent.click(screen.getByRole('button', { name: /Facilitation/ }))
    expect(screen.getByText('SBI — Situation Behavior Impact')).toBeInTheDocument()
  })

  it('shows coming soon cards', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getAllByText('Bientôt').length).toBeGreaterThan(0)
  })
})
