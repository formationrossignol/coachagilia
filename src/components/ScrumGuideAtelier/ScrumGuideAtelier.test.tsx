import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import React from 'react'
import { ScrumGuideAtelier } from './index'

function renderScrumGuideAtelier() {
  const router = createMemoryRouter(
    [{ path: '/ateliers/scrum-guide', element: <ScrumGuideAtelier /> }],
    { initialEntries: ['/ateliers/scrum-guide'] }
  )
  return render(<RouterProvider router={router} />)
}

describe('ScrumGuideAtelier', () => {
  it('renders 14 draggable labels in the palette', () => {
    renderScrumGuideAtelier()
    const labels = document.querySelectorAll('[data-label]')
    expect(labels).toHaveLength(14)
  })

  it('renders 14 drop zones', () => {
    renderScrumGuideAtelier()
    const zones = document.querySelectorAll('[data-zone]')
    expect(zones).toHaveLength(14)
  })

  it('"Vérifier" button is disabled when zones are empty', () => {
    renderScrumGuideAtelier()
    const btn = screen.getByRole('button', { name: /vérifier/i })
    expect(btn).toBeDisabled()
  })

  it('renders title and palette section', () => {
    renderScrumGuideAtelier()
    expect(screen.getByText(/cadre scrum/i)).toBeInTheDocument()
    expect(screen.getByText(/product owner/i)).toBeInTheDocument()
  })
})
