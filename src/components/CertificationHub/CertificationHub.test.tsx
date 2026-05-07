import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CertificationHub } from './index'

function renderHub() {
  return render(<MemoryRouter><CertificationHub /></MemoryRouter>)
}

describe('CertificationHub', () => {
  it('renders all 4 certification cards', () => {
    renderHub()
    expect(screen.getByText(/Professional Scrum Master/i)).toBeInTheDocument()
    expect(screen.getByText(/Professional Scrum Product Owner/i)).toBeInTheDocument()
    expect(screen.getByText(/PMI Agile Certified Practitioner/i)).toBeInTheDocument()
    expect(screen.getByText(/Scaled Agile Framework/i)).toBeInTheDocument()
  })

  it('each card links to /certifications/:certId', () => {
    renderHub()
    const links = screen.getAllByRole('link')
    const hrefs = links.map(l => l.getAttribute('href'))
    expect(hrefs).toContain('/certifications/psm')
    expect(hrefs).toContain('/certifications/pspo')
    expect(hrefs).toContain('/certifications/pmi-acp')
    expect(hrefs).toContain('/certifications/safe')
  })
})
