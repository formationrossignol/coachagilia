import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { WorkshopCategoryPage } from '.'

function renderWithRoute(slug: string) {
  render(
    <MemoryRouter initialEntries={[`/ateliers/categories/${slug}`]}>
      <Routes>
        <Route path="/ateliers/categories/:slug" element={<WorkshopCategoryPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('WorkshopCategoryPage', () => {
  it('renders category title', () => {
    renderWithRoute('facilitation')
    expect(screen.getByRole('heading', { name: 'Facilitation' })).toBeInTheDocument()
  })

  it('renders category description', () => {
    renderWithRoute('facilitation')
    expect(screen.getByText(/concevoir, animer/)).toBeInTheDocument()
  })

  it('renders available workshops in the category', () => {
    renderWithRoute('facilitation')
    expect(screen.getAllByText('Troika Consulting').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/TRIZ/).length).toBeGreaterThan(0)
  })

  it('shows Par où commencer section', () => {
    renderWithRoute('facilitation')
    expect(screen.getByText(/Par où commencer/)).toBeInTheDocument()
  })

  it('renders back link to /ateliers', () => {
    renderWithRoute('facilitation')
    expect(screen.getByRole('link', { name: /Ateliers/ })).toHaveAttribute('href', '/ateliers')
  })

  it('shows error for unknown category slug', () => {
    renderWithRoute('unknown-slug')
    expect(screen.getByText(/introuvable/i)).toBeInTheDocument()
  })
})
