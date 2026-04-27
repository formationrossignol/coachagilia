import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import React from 'react'
import { useExitGuard } from './useExitGuard'

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const router = createMemoryRouter(
    [{ path: '/', element: <>{children}</> }, { path: '/other', element: <div /> }],
    { initialEntries: ['/'] }
  )
  return <RouterProvider router={router} />
}

describe('useExitGuard', () => {
  it('showModal is false initially when isDirty=false', () => {
    const { result } = renderHook(() => useExitGuard(false), { wrapper })
    expect(result.current.showModal).toBe(false)
  })

  it('showModal is false initially when isDirty=true (no navigation attempted)', () => {
    const { result } = renderHook(() => useExitGuard(true), { wrapper })
    expect(result.current.showModal).toBe(false)
  })

  it('returns confirm and cancel as functions', () => {
    const { result } = renderHook(() => useExitGuard(false), { wrapper })
    expect(typeof result.current.confirm).toBe('function')
    expect(typeof result.current.cancel).toBe('function')
  })

  it('calling confirm when not blocked does not throw', () => {
    const { result } = renderHook(() => useExitGuard(true), { wrapper })
    expect(() => act(() => result.current.confirm())).not.toThrow()
  })

  it('calling cancel when not blocked does not throw', () => {
    const { result } = renderHook(() => useExitGuard(true), { wrapper })
    expect(() => act(() => result.current.cancel())).not.toThrow()
  })
})
