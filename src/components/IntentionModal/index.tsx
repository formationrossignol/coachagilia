import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { WorkshopIntention } from '../../data/workshops/intentions'
import { WORKSHOP_DEFINITIONS, INTENTION_WORKSHOP_MAP } from '../../data/workshops'
import { WorkshopCard } from '../WorkshopCard'
import { useGamificationStore } from '../../features/gamification'

interface Props {
  intention: WorkshopIntention
  onClose: () => void
}

export function IntentionModal({ intention, onClose }: Props) {
  const completedSlugs = useGamificationStore(useShallow(s => s.getCompletedContentSlugs()))

  const workshopSlugs = INTENTION_WORKSHOP_MAP[intention.slug] ?? []
  const workshops = WORKSHOP_DEFINITIONS.filter(w => workshopSlugs.includes(w.slug))
  const availableCount = workshops.filter(w => !w.comingSoon).length
  const comingSoonCount = workshops.filter(w => w.comingSoon).length

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="intention-modal" role="dialog" aria-modal="true" aria-labelledby="intention-modal-title">
      <div className="intention-modal__backdrop" onClick={onClose} />
      <div className="intention-modal__box" data-intention={intention.slug}>
        <div className="intention-modal__header">
          <span className="intention-modal__emoji">{intention.emoji}</span>
          <div>
            <div className="intention-modal__label">Intention</div>
            <h2 className="intention-modal__title" id="intention-modal-title">{intention.name}</h2>
            <p className="intention-modal__sub">{intention.subtitle}</p>
          </div>
          <button className="intention-modal__close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>
        <div className="intention-modal__body">
          {workshops.map(w => (
            <WorkshopCard key={w.id} workshop={w} isCompleted={completedSlugs.includes(w.slug)} />
          ))}
        </div>
        <div className="intention-modal__footer">
          {availableCount} atelier{availableCount !== 1 ? 's' : ''} disponible{availableCount !== 1 ? 's' : ''}
          {comingSoonCount > 0 && ` · ${comingSoonCount} à venir`}
        </div>
      </div>
    </div>
  )
}
