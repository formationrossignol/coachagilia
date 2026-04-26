import { useState } from 'react'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'

// Grid order: top-left, top-right, bottom-left, bottom-right
// Top = High Influence, Bottom = Low Influence
// Left = Low Interest, Right = High Interest
const ZONES = [
  { key: 'high-low',  strategyLabel: 'À satisfaire',        row: 'top',    col: 'left'  },
  { key: 'high-high', strategyLabel: 'À gérer étroitement', row: 'top',    col: 'right' },
  { key: 'low-low',   strategyLabel: 'À surveiller',        row: 'bottom', col: 'left'  },
  { key: 'low-high',  strategyLabel: 'À informer',          row: 'bottom', col: 'right' },
]

const ZONE_ANSWERS: Record<string, string> = {
  'high-high': 'À gérer étroitement',
  'high-low':  'À satisfaire',
  'low-high':  'À informer',
  'low-low':   'À surveiller',
}

const ZONE_IDS = ZONES.map(z => z.key)
const STRATEGY_LABELS = Object.values(ZONE_ANSWERS)

type Stakeholder = { id: string; text: string; zone: string }

const STAKEHOLDERS: Stakeholder[] = [
  { id: 'sh1',  text: 'Product Owner directement responsable du produit', zone: 'high-high' },
  { id: 'sh2',  text: 'Sponsor du projet avec un fort enjeu business', zone: 'high-high' },
  { id: 'sh3',  text: 'Responsable métier impliqué quotidiennement', zone: 'high-high' },
  { id: 'sh4',  text: 'Direction IT peu impliquée dans le détail mais décisionnaire', zone: 'high-low' },
  { id: 'sh5',  text: 'Architecte transverse concerné ponctuellement', zone: 'high-low' },
  { id: 'sh6',  text: 'Responsable sécurité validant les livraisons', zone: 'high-low' },
  { id: 'sh7',  text: 'Utilisateurs finaux impliqués dans les tests', zone: 'low-high' },
  { id: 'sh8',  text: 'Support applicatif en contact avec les clients', zone: 'low-high' },
  { id: 'sh9',  text: 'QA souhaitant améliorer la qualité produit', zone: 'low-high' },
  { id: 'sh10', text: 'Équipe externe impactée marginalement', zone: 'low-low' },
  { id: 'sh11', text: 'Département administratif peu concerné', zone: 'low-low' },
  { id: 'sh12', text: 'Observateur occasionnel du projet', zone: 'low-low' },
]

function MatrixZone({ zoneId, label, result, onDrop, onDragStart }: {
  zoneId: string
  label: string
  result: Record<string, boolean> | null
  onDrop: (zoneId: string) => void
  onDragStart: (label: string, fromZone?: string) => void
}) {
  const verified = result !== null
  const correct = result?.[zoneId]
  return (
    <div
      data-zone={zoneId}
      className={
        'sm-zone' +
        (label ? ' sm-zone--filled' : ' sm-zone--empty') +
        (verified ? (correct ? ' sm-zone--correct' : ' sm-zone--wrong') : '')
      }
      onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('sm-zone--hover') }}
      onDragLeave={e => e.currentTarget.classList.remove('sm-zone--hover')}
      onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('sm-zone--hover'); onDrop(zoneId) }}
    >
      {label ? (
        <span className="scrum-label scrum-label--placed" draggable onDragStart={() => onDragStart(label, zoneId)}>
          {label}
        </span>
      ) : (
        <span className="sm-zone__placeholder">?</span>
      )}
    </div>
  )
}

export function StakeholderMappingAtelier() {
  const [phase, setPhase] = useState<1 | 2>(1)

  const [matrixZones, setMatrixZones] = useState<Record<string, string>>(() =>
    Object.fromEntries(ZONE_IDS.map(id => [id, '']))
  )
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)

  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  const [dragging, setDragging] = useState<{ label: string; fromZone?: string } | null>(null)

  const placedLabels = new Set(Object.values(matrixZones).filter(Boolean))
  const paletteLabels = STRATEGY_LABELS.filter(l => !placedLabels.has(l))
  const phase1AllFilled = paletteLabels.length === 0

  function handleLabelDragStart(label: string, fromZone?: string) {
    setDragging({ label, fromZone })
    setPhase1Result(null)
  }

  function handleDropOnMatrixZone(zoneId: string) {
    if (!dragging) return
    setMatrixZones(prev => {
      const next = { ...prev }
      if (dragging.fromZone) next[dragging.fromZone] = ''
      next[zoneId] = dragging.label
      return next
    })
    setDragging(null)
  }

  function handleDropOnPalette() {
    if (!dragging?.fromZone) { setDragging(null); return }
    setMatrixZones(prev => ({ ...prev, [dragging.fromZone!]: '' }))
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const zoneId of ZONE_IDS) {
      result[zoneId] = matrixZones[zoneId] === ZONE_ANSWERS[zoneId]
    }
    setPhase1Result(result)
  }

  function handleResetPhase1() {
    setMatrixZones(Object.fromEntries(ZONE_IDS.map(id => [id, ''])))
    setPhase1Result(null)
  }

  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : null
  const phase1Perfect = phase1Score === 4

  const unassigned = STAKEHOLDERS.filter(s => !(s.id in assignments))
  const phase2AllAssigned = unassigned.length === 0

  function handleStakeholderDragStart(stakeholderId: string) {
    setDragging({ label: stakeholderId })
    setPhase2Result(null)
  }

  function handleDropOnZoneColumn(zoneKey: string) {
    if (!dragging) return
    setAssignments(prev => ({ ...prev, [dragging.label]: zoneKey }))
    setDragging(null)
  }

  function handleDropOnPool() {
    if (!dragging) { setDragging(null); return }
    setAssignments(prev => {
      const next = { ...prev }
      delete next[dragging.label]
      return next
    })
    setDragging(null)
  }

  function handleVerifyPhase2() {
    const result: Record<string, boolean> = {}
    for (const s of STAKEHOLDERS) {
      result[s.id] = assignments[s.id] === s.zone
    }
    setPhase2Result(result)
  }

  function handleResetPhase2() {
    setAssignments({})
    setPhase2Result(null)
  }

  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  return (
    <div className="atelier-page">
      <WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'stakeholder-mapping')!} />
      <header className="atelier-header">
        <h1 className="atelier-title">Stakeholder Mapping</h1>
        <p className="atelier-subtitle">
          {phase === 1
            ? 'Phase 1 / 2 — Associez la bonne stratégie à chaque quadrant de la matrice Influence / Intérêt.'
            : 'Phase 2 / 2 — Positionnez chaque partie prenante dans le bon quadrant de la matrice.'}
        </p>
      </header>

      {phase === 1 && (
        <>
          <div className="sm-matrix">
            <div className="sm-axis-y">
              <span>Haute</span>
              <span className="sm-axis-y__title">Influence ↑</span>
              <span>Basse</span>
            </div>
            <div className="sm-matrix-grid">
              {ZONES.map(zone => (
                <MatrixZone
                  key={zone.key}
                  zoneId={zone.key}
                  label={matrixZones[zone.key]}
                  result={phase1Result}
                  onDrop={handleDropOnMatrixZone}
                  onDragStart={handleLabelDragStart}
                />
              ))}
            </div>
            <div className="sm-axis-x-spacer" />
            <div className="sm-axis-x">
              <span>Faible</span>
              <span className="sm-axis-x__title">Intérêt →</span>
              <span>Fort</span>
            </div>
          </div>

          {phase1Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                {phase1Score} / 4 correct{phase1Perfect ? ' — Parfait !' : ''}
              </span>
            </div>
          )}

          <div className="scrum-palette" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPalette}>
            <p className="scrum-palette__title">Stratégies à associer</p>
            <div className="scrum-palette__labels">
              {paletteLabels.map(label => (
                <span
                  key={label}
                  className="scrum-label"
                  draggable
                  onDragStart={() => handleLabelDragStart(label)}
                >
                  {label}
                </span>
              ))}
              {paletteLabels.length === 0 && (
                <span className="scrum-palette__empty">Toutes les stratégies ont été associées</span>
              )}
            </div>
          </div>

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={handleVerifyPhase1} disabled={!phase1AllFilled}>
              Vérifier
            </button>
            {phase1Result && !phase1Perfect && (
              <button className="btn btn--secondary" onClick={handleResetPhase1}>Réessayer</button>
            )}
            {phase1Perfect && (
              <button className="btn btn--primary" onClick={() => setPhase(2)}>Phase suivante →</button>
            )}
          </div>
        </>
      )}

      {phase === 2 && (
        <>
          <div className="sm-matrix sm-matrix--phase2">
            <div className="sm-axis-y">
              <span>Haute</span>
              <span className="sm-axis-y__title">Influence ↑</span>
              <span>Basse</span>
            </div>
            <div className="sm-matrix-grid sm-matrix-grid--phase2">
              {ZONES.map(zone => {
                const zoneStakeholders = STAKEHOLDERS.filter(s => assignments[s.id] === zone.key)
                return (
                  <div
                    key={zone.key}
                    data-mode={zone.key}
                    className="sm-zone sm-zone--drop"
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleDropOnZoneColumn(zone.key)}
                  >
                    <p className="sm-zone-title">{zone.strategyLabel}</p>
                    <div className="sm-zone-cards">
                      {zoneStakeholders.map(s => (
                        <div
                          key={s.id}
                          data-stakeholder={s.id}
                          className={
                            'tki-situation-card' +
                            (phase2Result !== null
                              ? phase2Result[s.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                              : '')
                          }
                          draggable
                          onDragStart={() => handleStakeholderDragStart(s.id)}
                        >
                          {s.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="sm-axis-x-spacer" />
            <div className="sm-axis-x">
              <span>Faible</span>
              <span className="sm-axis-x__title">Intérêt →</span>
              <span>Fort</span>
            </div>
          </div>

          <div className="tki-pool" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPool}>
            <p className="scrum-palette__title">Parties prenantes à placer</p>
            <div className="tki-pool__cards">
              {unassigned.map(s => (
                <div
                  key={s.id}
                  data-stakeholder={s.id}
                  className="tki-situation-card"
                  draggable
                  onDragStart={() => handleStakeholderDragStart(s.id)}
                >
                  {s.text}
                </div>
              ))}
              {unassigned.length === 0 && (
                <span className="scrum-palette__empty">Toutes les parties prenantes ont été placées</span>
              )}
            </div>
          </div>

          {phase2Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase2Score === 12 ? 'badge--green' : 'badge--orange'}`}>
                {phase2Score} / 12 correct{phase2Score === 12 ? ' — Parfait !' : ''}
              </span>
            </div>
          )}

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={handleVerifyPhase2} disabled={!phase2AllAssigned}>
              Vérifier
            </button>
            {phase2Result && (
              <button className="btn btn--secondary" onClick={handleResetPhase2}>Réessayer phase 2</button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
