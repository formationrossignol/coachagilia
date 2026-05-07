import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { TopicPracticeScreen } from './index'

function renderPractice(certId = 'pspo', topicSlug = 'product-value') {
  return render(
    <MemoryRouter initialEntries={[`/certifications/${certId}/topic/${topicSlug}`]}>
      <Routes>
        <Route path="/certifications/:certId/topic/:topicSlug" element={<TopicPracticeScreen />} />
        <Route path="/certifications/:certId" element={<div>Portal</div>} />
        <Route path="/certifications" element={<div>Hub</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('TopicPracticeScreen', () => {
  it('renders topic label', () => {
    renderPractice()
    expect(screen.getByText(/Product Value/i)).toBeInTheDocument()
  })

  it('shows first question', () => {
    renderPractice()
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0)
  })

  it('shows feedback after selecting an answer', () => {
    renderPractice()
    const buttons = screen.getAllByRole('button')
    const optionBtn = buttons.find(b => /^[A-D]\./.test(b.textContent ?? ''))
    if (optionBtn) fireEvent.click(optionBtn)
    expect(screen.getByText(/correct|incorrect/i)).toBeInTheDocument()
  })

  it('redirects to portal for unknown topic', () => {
    renderPractice('pspo', 'nonexistent-topic')
    expect(screen.getByText('Portal')).toBeInTheDocument()
  })
})
