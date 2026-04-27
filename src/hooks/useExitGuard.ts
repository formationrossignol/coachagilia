import { useEffect, useState } from 'react'
import { useBlocker } from 'react-router-dom'

export function useExitGuard(isDirty: boolean) {
  const [showModal, setShowModal] = useState(false)

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  )

  useEffect(() => {
    if (blocker.state === 'blocked') setShowModal(true)
  }, [blocker.state])

  function confirm() {
    setShowModal(false)
    if (blocker.state === 'blocked') blocker.proceed()
  }

  function cancel() {
    setShowModal(false)
    if (blocker.state === 'blocked') blocker.reset()
  }

  return { showModal, confirm, cancel }
}
