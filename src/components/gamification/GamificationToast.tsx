import { useEffect } from 'react'
import { useGamificationStore } from '../../features/gamification'

export function GamificationToast() {
  const toastQueue = useGamificationStore(s => s.toastQueue)
  const dismissToast = useGamificationStore(s => s.dismissToast)
  const toast = toastQueue[0]

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(dismissToast, 3000)
    return () => clearTimeout(timer)
  }, [toast, dismissToast])

  if (!toast) return null

  return (
    <div className="gamification-toast" role="status" aria-live="polite">
      <span className="gamification-toast__message">{toast.message}</span>
      {toast.detail && (
        <span className="gamification-toast__detail">{toast.detail}</span>
      )}
    </div>
  )
}
