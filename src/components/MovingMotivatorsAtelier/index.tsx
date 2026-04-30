import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import {
  Compass, Shield, Heart, Award, Zap, Wind, Users, LayoutGrid, Target, Star,
  ChevronUp, ChevronDown, Minus,
} from 'lucide-react'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type Motivator = 'curiosity' | 'honor' | 'acceptance' | 'mastery' | 'power' | 'freedom' | 'relatedness' | 'order' | 'goal' | 'status'
type SatisfactionLevel = 'low' | 'medium' | 'high'
type Phase = 1 | 2 | 3

const MOTIVATOR_IDS: Motivator[] = [
  'curiosity', 'honor', 'acceptance', 'mastery', 'power',
  'freedom', 'relatedness', 'order', 'goal', 'status',
]

type MotivatorDef = {
  name: string
  description: string
  Icon: LucideIcon
  color: string
  rgb: string
}

const MOTIVATORS: Record<Motivator, MotivatorDef> = {
  curiosity:   { name: 'Curiosity',   description: 'Apprendre et explorer',          Icon: Compass,    color: '#f59e0b', rgb: '245,158,11' },
  honor:       { name: 'Honor',       description: 'Agir selon ses valeurs',          Icon: Shield,     color: '#8b5cf6', rgb: '139,92,246' },
  acceptance:  { name: 'Acceptance',  description: 'Être reconnu et accepté',         Icon: Heart,      color: '#f43f5e', rgb: '244,63,94'  },
  mastery:     { name: 'Mastery',     description: 'Progresser et devenir expert',    Icon: Award,      color: '#3b82f6', rgb: '59,130,246' },
  power:       { name: 'Power',       description: "Influencer et avoir de l'impact", Icon: Zap,        color: '#ef4444', rgb: '239,68,68'  },
  freedom:     { name: 'Freedom',     description: 'Être autonome',                   Icon: Wind,       color: '#0ea5e9', rgb: '14,165,233' },
  relatedness: { name: 'Relatedness', description: 'Créer du lien',                   Icon: Users,      color: '#22c55e', rgb: '34,197,94'  },
  order:       { name: 'Order',       description: 'Avoir de la structure',            Icon: LayoutGrid, color: '#94a3b8', rgb: '148,163,184'},
  goal:        { name: 'Goal',        description: 'Avoir un objectif clair',          Icon: Target,     color: '#f97316', rgb: '249,115,22' },
  status:      { name: 'Status',      description: 'Être reconnu socialement',         Icon: Star,       color: '#eab308', rgb: '234,179,8'  },
}

type DraggingState = { motivator: Motivator; fromIndex?: number } | null

function isActionConcrete(text: string): boolean {
  return text.trim().split(/\s+/).length >= 3
}

function isFirstStepClear(text: string): boolean {
  return text.trim().length >= 8
}

type MotivatorCardProps = {
  motivator: Motivator
  satLevel?: SatisfactionLevel
  isCritical?: boolean
  draggable?: boolean
  onDragStart?: () => void
}

function MotivatorCard({ motivator, satLevel, isCritical, draggable, onDragStart }: MotivatorCardProps) {
  const { name, description, Icon, color, rgb } = MOTIVATORS[motivator]
  return (
    <div
      data-motivator={motivator}
      className={`mm-card${isCritical ? ' mm-card--critical' : ''}`}
      style={{ '--mm-color': color, '--mm-rgb': rgb } as React.CSSProperties}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      <div className="mm-card__icon-area">
        <Icon size={26} strokeWidth={1.6} />
      </div>
      <div className="mm-card__body">
        <strong className="mm-card__name">{name}</strong>
        <span className="mm-card__desc">{description}</span>
      </div>
      {satLevel && (
        <div className={`mm-card__sat mm-card__sat--${satLevel}`}>
          {satLevel === 'high' && <ChevronUp size={13} strokeWidth={2.5} />}
          {satLevel === 'medium' && <Minus size={13} strokeWidth={2.5} />}
          {satLevel === 'low' && <ChevronDown size={13} strokeWidth={2.5} />}
        </div>
      )}
    </div>
  )
}

export function MovingMotivatorsAtelier() {
  const { markComplete } = useWorkshopCompletion('moving-motivators')
  const [phase, setPhase] = useState<Phase>(1)
  const [ranking, setRanking] = useState<(Motivator | null)[]>(Array(10).fill(null))
  const isDirty = phase > 1 || ranking.some(m => m !== null)
  const { showModal, confirm, cancel } = useExitGuard(isDirty)
  const [phase1Verified, setPhase1Verified] = useState(false)
  const [satisfaction, setSatisfaction] = useState<Partial<Record<Motivator, SatisfactionLevel>>>({})
  const [actionPlan, setActionPlan] = useState<Partial<Record<Motivator, { action: string; firstStep: string }>>>({})
  const [phase3Verified, setPhase3Verified] = useState(false)
  const [dragging, setDragging] = useState<DraggingState>(null)

  const pool = MOTIVATOR_IDS.filter(m => !ranking.includes(m))
  const phase1AllFilled = ranking.every(m => m !== null)

  function handleDragStartFromPool(motivator: Motivator) {
    setDragging({ motivator })
    setPhase1Verified(false)
  }
  function handleDragStartFromSlot(motivator: Motivator, fromIndex: number) {
    setDragging({ motivator, fromIndex })
    setPhase1Verified(false)
  }
  function handleDropOnSlot(slotIndex: number) {
    if (!dragging) return
    const { motivator, fromIndex } = dragging
    setRanking(prev => {
      const next = [...prev]
      const existing = next[slotIndex]
      if (fromIndex !== undefined) next[fromIndex] = existing
      next[slotIndex] = motivator
      return next
    })
    setDragging(null)
  }
  function handleDropOnPool() {
    if (!dragging) { setDragging(null); return }
    if (dragging.fromIndex !== undefined) {
      setRanking(prev => {
        const next = [...prev]
        next[dragging.fromIndex!] = null
        return next
      })
    }
    setDragging(null)
  }

  const topRanking = ranking.filter((m): m is Motivator => m !== null)
  const phase2AllRated = MOTIVATOR_IDS.every(m => satisfaction[m] !== undefined)
  const criticalMotivators = topRanking.slice(0, 5).filter(m => satisfaction[m] === 'low')

  const phase3AllFilled = criticalMotivators.length === 0 || criticalMotivators.every(m => {
    const plan = actionPlan[m]
    return plan && plan.action.trim().length > 0 && plan.firstStep.trim().length > 0
  })
  const top3 = topRanking.slice(0, 3)

  return (
    <>
    <div className="atelier-page">
      <WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'moving-motivators')!} />
      <header className="atelier-header">
        <h1 className="atelier-title">Moving Motivators</h1>
        <p className="atelier-subtitle">
          {phase === 1 && 'Phase 1 / 3 — Classez vos motivateurs du plus au moins important.'}
          {phase === 2 && 'Phase 2 / 3 — Évaluez votre niveau de satisfaction pour chaque motivateur.'}
          {phase === 3 && "Phase 3 / 3 — Définissez un plan d'action pour vos motivateurs critiques."}
        </p>
      </header>

      {phase === 1 && (
        <>
          <div className="mm-direction-bar">
            <span>← Plus important</span>
            <div className="mm-direction-bar__line" />
            <span>Moins important →</span>
          </div>

          <div className="mm-track-scroller">
            <div className="mm-track">
              {Array.from({ length: 10 }, (_, i) => {
                const m = ranking[i]
                return (
                  <div
                    key={i}
                    data-slot={i}
                    className={`mm-track-slot${m ? ' mm-track-slot--filled' : ''}`}
                    onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('mm-track-slot--hover') }}
                    onDragLeave={e => e.currentTarget.classList.remove('mm-track-slot--hover')}
                    onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('mm-track-slot--hover'); handleDropOnSlot(i) }}
                  >
                    <span className="mm-track-slot__rank">{i + 1}</span>
                    {m ? (
                      <MotivatorCard
                        motivator={m}
                        draggable
                        onDragStart={() => handleDragStartFromSlot(m, i)}
                      />
                    ) : (
                      <div className="mm-track-slot__empty">
                        <span>Déposer<br />ici</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {pool.length > 0 && (
            <div
              className="mm-pool"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropOnPool}
            >
              <p className="mm-section-label">Motivateurs à classer</p>
              <div className="mm-pool__grid">
                {pool.map(m => (
                  <MotivatorCard
                    key={m}
                    motivator={m}
                    draggable
                    onDragStart={() => handleDragStartFromPool(m)}
                  />
                ))}
              </div>
            </div>
          )}

          {phase1Verified && (
            <div className="scrum-score-banner">
              <span className="badge badge--green">Classement enregistré !</span>
            </div>
          )}

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={() => setPhase1Verified(true)} disabled={!phase1AllFilled}>
              Vérifier
            </button>
            {phase1Verified && (
              <button className="btn btn--primary" onClick={() => setPhase(2)}>Phase suivante →</button>
            )}
          </div>
        </>
      )}

      {phase === 2 && (
        <>
          <div className="mm-direction-bar">
            <span>← Plus important</span>
            <div className="mm-direction-bar__line" />
            <span>Moins important →</span>
          </div>

          <div className="mm-track-scroller">
            <div className="mm-track mm-track--phase2">
              {topRanking.map((m, i) => {
                const sat = satisfaction[m]
                const isCritical = i < 5 && sat === 'low'
                return (
                  <div
                    key={m}
                    className={`mm-track-slot mm-track-slot--phase2 mm-satisfaction-row${isCritical ? ' mm-satisfaction-row--critical' : ''}`}
                  >
                    <span className="mm-track-slot__rank">#{i + 1}</span>
                    <MotivatorCard motivator={m} satLevel={sat} isCritical={isCritical} />
                    <div className="mm-sat-controls">
                      {(['low', 'medium', 'high'] as SatisfactionLevel[]).map(level => (
                        <button
                          key={level}
                          data-satisfaction={`${m}-${level}`}
                          className={`mm-sat-btn mm-sat-btn--${level}${sat === level ? ' mm-sat-btn--active' : ''}`}
                          onClick={() => setSatisfaction(prev => ({ ...prev, [m]: level }))}
                          title={level === 'low' ? 'Faible' : level === 'medium' ? 'Moyen' : 'Élevé'}
                        >
                          {level === 'low' && <ChevronDown size={13} />}
                          {level === 'medium' && <Minus size={13} />}
                          {level === 'high' && <ChevronUp size={13} />}
                        </button>
                      ))}
                    </div>
                    {isCritical && <span className="badge badge--red mm-critical-badge">Critique</span>}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={() => setPhase(3)} disabled={!phase2AllRated}>
              Phase suivante →
            </button>
          </div>
        </>
      )}

      {phase === 3 && (
        <>
          {criticalMotivators.length > 0 && !phase3Verified && (
            <div className="mm-action-plan">
              {criticalMotivators.map(m => {
                const { name, description, Icon, color, rgb } = MOTIVATORS[m]
                const plan = actionPlan[m] ?? { action: '', firstStep: '' }
                return (
                  <div key={m} className="mm-action-item" data-action-motivator={m}>
                    <div
                      className="mm-action-item__header"
                      style={{ '--mm-color': color, '--mm-rgb': rgb } as React.CSSProperties}
                    >
                      <div className="mm-action-item__icon">
                        <Icon size={18} strokeWidth={1.6} />
                      </div>
                      <div>
                        <h3 className="mm-action-item__title">{name}</h3>
                        <span className="mm-card__desc">{description}</span>
                      </div>
                      <span className="badge badge--red" style={{ marginLeft: 'auto' }}>Critique</span>
                    </div>
                    <div className="mm-action-fields">
                      <label className="mm-action-label">Action concrète</label>
                      <input
                        type="text"
                        data-field="action"
                        className="at-phrase-input"
                        placeholder="Quelle action allez-vous mettre en place ?"
                        value={plan.action}
                        onChange={e => setActionPlan(prev => ({
                          ...prev,
                          [m]: { ...(prev[m] ?? { action: '', firstStep: '' }), action: e.target.value },
                        }))}
                      />
                      <label className="mm-action-label">Premier pas</label>
                      <input
                        type="text"
                        data-field="first-step"
                        className="at-phrase-input"
                        placeholder="Quel est le premier pas dès cette semaine ?"
                        value={plan.firstStep}
                        onChange={e => setActionPlan(prev => ({
                          ...prev,
                          [m]: { ...(prev[m] ?? { action: '', firstStep: '' }), firstStep: e.target.value },
                        }))}
                      />
                      {phase3Verified && (
                        <div className="at-indicators">
                          <span className={`at-indicator ${isActionConcrete(plan.action) ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                            {isActionConcrete(plan.action) ? '✓ Action concrète' : "✗ Précisez davantage l'action"}
                          </span>
                          <span className={`at-indicator ${isFirstStepClear(plan.firstStep) ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                            {isFirstStepClear(plan.firstStep) ? '✓ Premier pas identifié' : '✗ Précisez le premier pas'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {criticalMotivators.length === 0 && (
            <div className="mm-no-critical">
              <p>Aucun motivateur critique identifié — tous vos motivateurs importants ont un niveau de satisfaction satisfaisant.</p>
            </div>
          )}

          {(phase3Verified || criticalMotivators.length === 0) && (
            <div className="mm-result">
              <h2 className="mm-result__title">Votre profil motivationnel</h2>
              {top3.length > 0 && (
                <div className="mm-result__section">
                  <p className="mm-result__label">Top 3 motivateurs</p>
                  <div className="mm-result__list">
                    {top3.map((m, i) => {
                      const { name, Icon, color, rgb } = MOTIVATORS[m]
                      return (
                        <span
                          key={m}
                          className="mm-result__item"
                          style={{ '--mm-color': color, '--mm-rgb': rgb } as React.CSSProperties}
                        >
                          <span className="mm-result__item-icon"><Icon size={14} strokeWidth={1.8} /></span>
                          <span className="mm-rank-badge">#{i + 1}</span> {name}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
              {criticalMotivators.length > 0 && (
                <div className="mm-result__section">
                  <p className="mm-result__label">Motivateurs à risque</p>
                  <div className="mm-result__list">
                    {criticalMotivators.map(m => (
                      <span key={m} className="mm-result__item mm-result__item--risk">
                        {MOTIVATORS[m].name} — {MOTIVATORS[m].description}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mm-result__section">
                <span className="badge badge--green">Profil complété</span>
              </div>
            </div>
          )}

          <div className="scrum-actions">
            {criticalMotivators.length > 0 && !phase3Verified && (
              <button className="btn btn--primary" onClick={() => { setPhase3Verified(true); markComplete() }} disabled={!phase3AllFilled}>
                Valider mon plan d'action
              </button>
            )}
            {phase3Verified && (
              <button className="btn btn--secondary" onClick={() => { setPhase3Verified(false); setActionPlan({}) }}>
                Réessayer phase 3
              </button>
            )}
          </div>
        </>
      )}
    </div>

    {showModal && (
      <ConfirmLeaveModal
        title="Quitter l'atelier ?"
        body="Votre progression sera perdue."
        cancelLabel="Continuer"
        confirmLabel="Quitter quand même"
        onConfirm={confirm}
        onCancel={cancel}
      />
    )}
    </>
  )
}
