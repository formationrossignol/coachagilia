import { useState } from 'react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type IshikawaCategory = 'people' | 'process' | 'tools' | 'product' | 'environment' | 'management'
type Phase = 1 | 2 | 3

const BRANCH_LIST: { id: string; category: IshikawaCategory; label: string }[] = [
  { id: 'b0', category: 'people',      label: 'People' },
  { id: 'b1', category: 'process',     label: 'Process' },
  { id: 'b2', category: 'tools',       label: 'Tools' },
  { id: 'b3', category: 'product',     label: 'Product' },
  { id: 'b4', category: 'environment', label: 'Environment' },
  { id: 'b5', category: 'management',  label: 'Management' },
]

const CATEGORY_META: Record<IshikawaCategory, { label: string }> = {
  people:      { label: 'People' },
  process:     { label: 'Process' },
  tools:       { label: 'Tools' },
  product:     { label: 'Product' },
  environment: { label: 'Environment' },
  management:  { label: 'Management' },
}

const CATEGORY_IDS = BRANCH_LIST.map(b => b.category)

type BranchId = typeof BRANCH_LIST[number]['id']

const BRANCH_POSITIONS: Record<BranchId, { left: string; top: string }> = {
  b0: { left: '15.85%', top: '10.71%' },
  b1: { left: '36.59%', top: '10.71%' },
  b2: { left: '57.93%', top: '10.71%' },
  b3: { left: '15.85%', top: '89.29%' },
  b4: { left: '36.59%', top: '89.29%' },
  b5: { left: '57.93%', top: '89.29%' },
}


type Cause = { id: string; text: string; category: IshikawaCategory }

const CAUSES: Cause[] = [
  { id: 'c1',  text: 'Manque de communication entre développeurs',  category: 'people' },
  { id: 'c2',  text: 'Compétences techniques insuffisantes',          category: 'people' },
  { id: 'c3',  text: 'Mauvaise collaboration avec le Product Owner', category: 'people' },
  { id: 'c4',  text: 'Processus de refinement insuffisant',           category: 'process' },
  { id: 'c5',  text: 'Sprint Planning mal préparée',                  category: 'process' },
  { id: 'c6',  text: 'Absence de règles claires',                     category: 'process' },
  { id: 'c7',  text: 'Outils de build instables',                     category: 'tools' },
  { id: 'c8',  text: 'Environnement de test peu fiable',              category: 'tools' },
  { id: 'c9',  text: 'Mauvaise configuration CI/CD',                  category: 'tools' },
  { id: 'c10', text: 'User Stories mal définies',                     category: 'product' },
  { id: 'c11', text: 'Dette technique élevée',                        category: 'product' },
  { id: 'c12', text: 'Complexité fonctionnelle excessive',            category: 'product' },
  { id: 'c13', text: 'Interruptions fréquentes',                      category: 'environment' },
  { id: 'c14', text: 'Dépendances externes bloquantes',               category: 'environment' },
  { id: 'c15', text: 'Pression organisationnelle forte',              category: 'environment' },
  { id: 'c16', text: 'Priorités changeantes',                         category: 'management' },
  { id: 'c17', text: 'Manque de vision produit',                      category: 'management' },
  { id: 'c18', text: 'Décisions tardives',                            category: 'management' },
]

type DraggingState =
  | { type: 'category'; category: IshikawaCategory }
  | { type: 'cause'; causeId: string }
  | null

function FishboneSVG() {
  return (
    <svg className="ishi-fishbone__svg" viewBox="0 0 820 280" aria-hidden="true">
      <polyline points="70,140 20,100 20,180 70,140" fill="none" style={{ stroke: 'var(--color-primary)' }} strokeWidth={2.5} strokeLinejoin="round"/>
      <line x1={70} y1={140} x2={680} y2={140} style={{ stroke: 'var(--color-primary)' }} strokeWidth={3.5}/>
      <path d="M680,100 Q760,100 780,140 Q760,180 680,180 Z" fill="none" style={{ stroke: 'var(--color-primary)' }} strokeWidth={2.5}/>
      <circle cx={730} cy={130} r={6} fill="none" style={{ stroke: 'var(--color-primary)' }} strokeWidth={2}/>
      <circle cx={730} cy={130} r={2} style={{ fill: 'var(--color-primary)' }}/>
      <line x1={200} y1={140} x2={130} y2={30} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
      <line x1={370} y1={140} x2={300} y2={30} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
      <line x1={540} y1={140} x2={475} y2={30} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
      <line x1={200} y1={140} x2={130} y2={250} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
      <line x1={370} y1={140} x2={300} y2={250} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
      <line x1={540} y1={140} x2={475} y2={250} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
    </svg>
  )
}

function BranchZone({ branch, placed, result, onDrop, onDragStart }: {
  branch: typeof BRANCH_LIST[0]
  placed: IshikawaCategory | undefined
  result: Partial<Record<string, boolean>> | null
  onDrop: (branchId: string) => void
  onDragStart: (category: IshikawaCategory) => void
}) {
  const verified = result !== null
  const correct = result?.[branch.id]
  const { left, top } = BRANCH_POSITIONS[branch.id]
  return (
    <div
      data-branch={branch.id}
      className={
        'ishi-zone' +
        (placed ? ' ishi-zone--filled' : '') +
        (verified ? (correct ? ' ishi-zone--correct' : ' ishi-zone--wrong') : '')
      }
      style={{ left, top }}
      onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('ishi-zone--hover') }}
      onDragLeave={e => e.currentTarget.classList.remove('ishi-zone--hover')}
      onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('ishi-zone--hover'); onDrop(branch.id) }}
    >
      {placed ? (
        <span
          data-category={placed}
          className="ishi-category-label ishi-category-label--placed"
          draggable
          onDragStart={() => onDragStart(placed)}
        >
          {CATEGORY_META[placed].label}
        </span>
      ) : (
        <span className="ishi-zone__placeholder">Déposer ici</span>
      )}
    </div>
  )
}

export function IshikawaAtelier() {
  const { markComplete } = useWorkshopCompletion('ishikawa')
  const [phase, setPhase] = useState<Phase>(1)

  // Phase 1
  const [branchAssignments, setBranchAssignments] = useState<Partial<Record<string, IshikawaCategory>>>({})
  const isDirty = phase > 1 || Object.keys(branchAssignments).length > 0
  const { showModal, confirm, cancel } = useExitGuard(isDirty)
  const [phase1Result, setPhase1Result] = useState<Partial<Record<string, boolean>> | null>(null)

  // Phase 2
  const [causeAssignments, setCauseAssignments] = useState<Record<string, IshikawaCategory>>({})
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  // Phase 3
  const [selectedRoots, setSelectedRoots] = useState<string[]>([])
  const [justifications, setJustifications] = useState<Record<string, string>>({})
  const [rootActions, setRootActions] = useState<Record<string, string>>({})
  const [phase3Verified, setPhase3Verified] = useState(false)

  const [dragging, setDragging] = useState<DraggingState>(null)

  // Phase 1 derived
  const palette1 = CATEGORY_IDS.filter(c => !Object.values(branchAssignments).includes(c))
  const phase1AllFilled = BRANCH_LIST.every(b => branchAssignments[b.id])
  const phase1Score = phase1Result ? BRANCH_LIST.filter(b => phase1Result[b.id]).length : null
  const phase1Perfect = phase1Score === 6

  function handleDragStartCategory(category: IshikawaCategory) {
    setDragging({ type: 'category', category })
    setPhase1Result(null)
  }
  function handleDropOnBranch(branchId: string) {
    if (!dragging || dragging.type !== 'category') return
    const { category } = dragging
    setBranchAssignments(prev => {
      const next = { ...prev }
      const prevBranch = Object.entries(prev).find(([, c]) => c === category)?.[0]
      if (prevBranch) delete next[prevBranch]
      next[branchId] = category
      return next
    })
    setDragging(null)
  }
  function handleDropOnPalette1() {
    if (!dragging || dragging.type !== 'category') { setDragging(null); return }
    const { category } = dragging
    setBranchAssignments(prev => {
      const next = { ...prev }
      const branchId = Object.entries(prev).find(([, c]) => c === category)?.[0]
      if (branchId) delete next[branchId]
      return next
    })
    setDragging(null)
  }
  function verifyPhase1() {
    const result: Partial<Record<string, boolean>> = {}
    BRANCH_LIST.forEach(b => { result[b.id] = branchAssignments[b.id] === b.category })
    setPhase1Result(result)
  }
  function resetPhase1() { setBranchAssignments({}); setPhase1Result(null) }

  // Phase 2 derived
  const pool2 = CAUSES.filter(c => !(c.id in causeAssignments))
  const phase2AllAssigned = pool2.length === 0
  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  function handleDragStartCause(causeId: string) {
    setDragging({ type: 'cause', causeId })
    setPhase2Result(null)
  }
  function handleDropOnCategoryZone(category: IshikawaCategory) {
    if (!dragging || dragging.type !== 'cause') return
    setCauseAssignments(prev => ({ ...prev, [dragging.causeId]: category }))
    setDragging(null)
  }
  function handleDropOnPool2() {
    if (!dragging || dragging.type !== 'cause') { setDragging(null); return }
    setCauseAssignments(prev => { const next = { ...prev }; delete next[dragging.causeId]; return next })
    setDragging(null)
  }
  function verifyPhase2() {
    const result: Record<string, boolean> = {}
    CAUSES.forEach(c => { result[c.id] = causeAssignments[c.id] === c.category })
    setPhase2Result(result)
  }
  function resetPhase2() { setCauseAssignments({}); setPhase2Result(null) }

  // Phase 3 derived
  const phase3Valid =
    selectedRoots.length >= 2 &&
    selectedRoots.length <= 4 &&
    selectedRoots.every(id => justifications[id]?.trim().length > 0 && rootActions[id]?.trim().length > 0)
  const finalBadgeGreen = phase2Score === 18 && phase3Verified

  function toggleRootCause(causeId: string) {
    setPhase3Verified(false)
    setSelectedRoots(prev => {
      if (prev.includes(causeId)) return prev.filter(id => id !== causeId)
      if (prev.length >= 4) return prev
      return [...prev, causeId]
    })
  }

  return (
    <>
    <div className="atelier-page">
      <WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'ishikawa')!} />
      <header className="atelier-header">
        <h1 className="atelier-title">Diagramme d'Ishikawa</h1>
        <p className="atelier-subtitle">
          {phase === 1 && 'Phase 1 / 3 — Positionnez les 6 catégories sur les branches du diagramme.'}
          {phase === 2 && 'Phase 2 / 3 — Classez les 18 causes dans la bonne catégorie.'}
          {phase === 3 && 'Phase 3 / 3 — Identifiez les causes racines et proposez des actions correctives.'}
        </p>
      </header>

      {phase === 1 && (
        <>
          <div className="ishi-fishbone">
            <FishboneSVG />
            <div className="ishi-fishbone__overlay">
              <div className="ishi-effect-label" style={{ left: '88.4%', top: '50%' }}>
                Vélocité<br/>insuffisante
              </div>
              {BRANCH_LIST.map(b => (
                <BranchZone
                  key={b.id}
                  branch={b}
                  placed={branchAssignments[b.id]}
                  result={phase1Result}
                  onDrop={handleDropOnBranch}
                  onDragStart={handleDragStartCategory}
                />
              ))}
            </div>
          </div>

          {phase1Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                {phase1Score} / 6 correct{phase1Perfect ? ' — Parfait !' : ''}
              </span>
            </div>
          )}

          <div className="scrum-palette" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPalette1}>
            <p className="scrum-palette__title">Catégories à placer</p>
            <div className="scrum-palette__labels">
              {palette1.map(category => (
                <span key={category} data-category={category} className="scrum-label" draggable onDragStart={() => handleDragStartCategory(category)}>
                  {CATEGORY_META[category].label}
                </span>
              ))}
              {palette1.length === 0 && <span className="scrum-palette__empty">Toutes les catégories ont été placées</span>}
            </div>
          </div>

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={verifyPhase1} disabled={!phase1AllFilled}>Vérifier</button>
            {phase1Result && !phase1Perfect && (
              <button className="btn btn--secondary" onClick={resetPhase1}>Réessayer</button>
            )}
            {phase1Perfect && (
              <button className="btn btn--primary" onClick={() => setPhase(2)}>Phase suivante →</button>
            )}
          </div>
        </>
      )}

      {phase === 2 && (
        <>
          <div className="ishi-fishbone">
            <FishboneSVG />
            <div className="ishi-fishbone__overlay">
              <div className="ishi-effect-label" style={{ left: '88.4%', top: '50%' }}>
                Vélocité<br/>insuffisante
              </div>
              {BRANCH_LIST.map(b => {
                const colCauses = CAUSES.filter(c => causeAssignments[c.id] === b.category)
                const { left, top } = BRANCH_POSITIONS[b.id]
                return (
                  <div
                    key={b.id}
                    data-category-zone={b.category}
                    className="ishi-zone ishi-zone--filled"
                    style={{ left, top }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleDropOnCategoryZone(b.category)}
                  >
                    <p className="ishi-zone__header">{b.label}</p>
                    <div className="ishi-zone__cards">
                      {colCauses.map(c => (
                        <div
                          key={c.id}
                          data-cause={c.id}
                          className={'ishi-cause-card' + (phase2Result !== null ? (phase2Result[c.id] ? ' ishi-cause-card--correct' : ' ishi-cause-card--wrong') : '')}
                          draggable
                          onDragStart={() => handleDragStartCause(c.id)}
                        >
                          {c.text}
                        </div>
                      ))}
                      {colCauses.length === 0 && <span className="ishi-zone__placeholder">Déposer ici</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="ishi-pool" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPool2}>
            <p className="scrum-palette__title">Causes à classer</p>
            <div className="ishi-pool__cards">
              {pool2.map(c => (
                <div key={c.id} data-cause={c.id} className="ishi-cause-card" draggable onDragStart={() => handleDragStartCause(c.id)}>{c.text}</div>
              ))}
              {pool2.length === 0 && <span className="scrum-palette__empty">Toutes les causes ont été classées</span>}
            </div>
          </div>

          {phase2Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase2Score === 18 ? 'badge--green' : 'badge--orange'}`}>
                {phase2Score} / 18 correct
              </span>
            </div>
          )}

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={verifyPhase2} disabled={!phase2AllAssigned}>Vérifier</button>
            {phase2Result && (
              <>
                <button className="btn btn--secondary" onClick={resetPhase2}>Réessayer phase 2</button>
                <button className="btn btn--primary" onClick={() => setPhase(3)}>Phase suivante →</button>
              </>
            )}
          </div>
        </>
      )}

      {phase === 3 && (
        <>
          <div className="ishi-root-section">
            <p className="ishi-root-instructions">
              Sélectionnez <strong>2 à 4 causes racines</strong> et justifiez votre choix.
              {selectedRoots.length > 0 && ` (${selectedRoots.length}/4 sélectionnées)`}
            </p>
            {BRANCH_LIST.map(b => (
              <div key={b.id} className="ishi-root-category">
                <h3 className="ishi-root-category__title">{b.label}</h3>
                {CAUSES.filter(c => c.category === b.category).map(c => {
                  const isSelected = selectedRoots.includes(c.id)
                  const isDisabled = !isSelected && selectedRoots.length >= 4
                  return (
                    <div key={c.id} data-root-cause={c.id} className={'ishi-root-item' + (isSelected ? ' ishi-root-item--selected' : '')}>
                      <label className="ishi-root-item__label">
                        <input type="checkbox" checked={isSelected} disabled={isDisabled} onChange={() => toggleRootCause(c.id)} />
                        <span>{c.text}</span>
                      </label>
                      {isSelected && (
                        <div className="ishi-root-fields">
                          <label className="mm-action-label">Justification</label>
                          <input type="text" data-justification={c.id} className="at-phrase-input"
                            placeholder="Pourquoi est-ce une cause racine ?"
                            value={justifications[c.id] ?? ''}
                            onChange={e => setJustifications(prev => ({ ...prev, [c.id]: e.target.value }))} />
                          <label className="mm-action-label">Action corrective</label>
                          <input type="text" data-action={c.id} className="at-phrase-input"
                            placeholder="Quelle action mettre en place ?"
                            value={rootActions[c.id] ?? ''}
                            onChange={e => setRootActions(prev => ({ ...prev, [c.id]: e.target.value }))} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {phase3Verified && (
            <div className="mm-result">
              <h2 className="mm-result__title">Analyse des causes racines</h2>
              <div className="mm-result__section">
                <p className="mm-result__label">Causes racines identifiées</p>
                <div className="mm-result__list">
                  {selectedRoots.map(id => {
                    const cause = CAUSES.find(c => c.id === id)!
                    return <span key={id} className="mm-result__item">{cause.text}</span>
                  })}
                </div>
              </div>
              <div className="mm-result__section">
                <span className={`badge ${finalBadgeGreen ? 'badge--green' : 'badge--orange'}`}>
                  {finalBadgeGreen ? 'Analyse complétée' : 'Analyse terminée'}
                </span>
              </div>
            </div>
          )}

          <div className="scrum-actions">
            {!phase3Verified && (
              <button className="btn btn--primary" onClick={() => { setPhase3Verified(true); markComplete() }} disabled={!phase3Valid}>
                Valider mon analyse
              </button>
            )}
            {phase3Verified && (
              <button className="btn btn--secondary" onClick={() => { setPhase3Verified(false); setSelectedRoots([]); setJustifications({}); setRootActions({}) }}>
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
