import { useState } from 'react'

const DIAGRAM_ANSWERS: Record<string, string> = {
  'top-left':     'Compétition',
  'top-right':    'Collaboration',
  'center':       'Compromis',
  'bottom-left':  'Évitement',
  'bottom-right': 'Accommodation',
}
const DIAGRAM_ZONE_IDS = Object.keys(DIAGRAM_ANSWERS)
const MODE_LABELS = Object.values(DIAGRAM_ANSWERS)

type Situation = { id: string; text: string; mode: string }

const SITUATIONS: Situation[] = [
  { id: 's1',  text: "Un membre de l'équipe pousse une solution technique non conforme à la DoD — le SM doit trancher pour protéger la qualité.", mode: 'Compétition' },
  { id: 's2',  text: "Une livraison est bloquée par un désaccord de dernière minute — une décision rapide s'impose.", mode: 'Compétition' },
  { id: 's3',  text: "Un développeur refuse systématiquement les revues de code — le SM pose une limite ferme.", mode: 'Compétition' },
  { id: 's4',  text: "Deux développeurs ont des visions opposées sur l'architecture d'une fonctionnalité clé — le SM facilite une session de co-conception.", mode: 'Collaboration' },
  { id: 's5',  text: "Une tension récurrente entre deux membres dégrade l'atmosphère de l'équipe — le SM organise un dialogue structuré.", mode: 'Collaboration' },
  { id: 's6',  text: "L'équipe ne s'accorde pas sur la définition du Done — le SM anime un atelier pour construire une vision commune.", mode: 'Collaboration' },
  { id: 's7',  text: "Le Product Owner et l'équipe ne s'accordent pas sur la priorité de deux User Stories de même valeur — on négocie un ordre acceptable pour les deux.", mode: 'Compromis' },
  { id: 's8',  text: "L'équipe est divisée sur la durée du prochain Sprint (1 ou 2 semaines) — on convient d'un essai de 2 semaines réévalué à la rétrospective.", mode: 'Compromis' },
  { id: 's9',  text: "Les ressources ne permettent pas de traiter tous les items prévus — on réduit le périmètre de manière équilibrée.", mode: 'Compromis' },
  { id: 's10', text: "Une légère irritation sur le choix d'un outil de communication, sans impact sur la livraison — le SM laisse passer.", mode: 'Évitement' },
  { id: 's11', text: "Une friction ponctuelle entre deux membres en fin de Sprint surchargé — le SM note le sujet pour la rétrospective plutôt que d'intervenir immédiatement.", mode: 'Évitement' },
  { id: 's12', text: "Un désaccord sur le format des standup notes, mineur et sans conséquence sur le travail — le SM ne prend pas position.", mode: 'Évitement' },
  { id: 's13', text: "Un développeur senior propose une approche différente de celle prévue, avec une expertise reconnue — le SM cède et soutient sa proposition.", mode: 'Accommodation' },
  { id: 's14', text: "Un stakeholder important demande un ajustement raisonnable sur la présentation du Sprint Review — le SM accepte pour préserver la relation.", mode: 'Accommodation' },
  { id: 's15', text: "Un membre de l'équipe demande à changer l'heure du Daily Scrum pour des raisons personnelles légitimes — le SM accommode la demande.", mode: 'Accommodation' },
]

function DiagramZone({ zoneId, label, result, onDrop, onDragStart }: {
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
        'tki-zone' +
        (label ? ' tki-zone--filled' : ' tki-zone--empty') +
        (verified ? (correct ? ' tki-zone--correct' : ' tki-zone--wrong') : '')
      }
      onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('tki-zone--hover') }}
      onDragLeave={e => e.currentTarget.classList.remove('tki-zone--hover')}
      onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('tki-zone--hover'); onDrop(zoneId) }}
    >
      {label ? (
        <span className="scrum-label scrum-label--placed" draggable onDragStart={() => onDragStart(label, zoneId)}>
          {label}
        </span>
      ) : (
        <span className="scrum-zone__placeholder">?</span>
      )}
    </div>
  )
}

export function ConflictAtelier() {
  const [phase, setPhase] = useState<1 | 2>(1)

  const [diagramZones, setDiagramZones] = useState<Record<string, string>>(() =>
    Object.fromEntries(DIAGRAM_ZONE_IDS.map(id => [id, '']))
  )
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)

  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  const [dragging, setDragging] = useState<{ label: string; fromDiagramZone?: string } | null>(null)

  const placedModes = new Set(Object.values(diagramZones).filter(Boolean))
  const paletteModes = MODE_LABELS.filter(l => !placedModes.has(l))
  const phase1AllFilled = paletteModes.length === 0

  function handleDiagramDragStart(label: string, fromDiagramZone?: string) {
    setDragging({ label, fromDiagramZone })
    setPhase1Result(null)
  }

  function handleDropOnDiagramZone(zoneId: string) {
    if (!dragging) return
    setDiagramZones(prev => {
      const next = { ...prev }
      if (dragging.fromDiagramZone) next[dragging.fromDiagramZone] = ''
      next[zoneId] = dragging.label
      return next
    })
    setDragging(null)
  }

  function handleDropOnDiagramPalette() {
    if (!dragging?.fromDiagramZone) { setDragging(null); return }
    setDiagramZones(prev => ({ ...prev, [dragging.fromDiagramZone!]: '' }))
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const zoneId of DIAGRAM_ZONE_IDS) {
      result[zoneId] = diagramZones[zoneId] === DIAGRAM_ANSWERS[zoneId]
    }
    setPhase1Result(result)
  }

  function handleResetPhase1() {
    setDiagramZones(Object.fromEntries(DIAGRAM_ZONE_IDS.map(id => [id, ''])))
    setPhase1Result(null)
  }

  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : null
  const phase1Perfect = phase1Score === 5

  const unassigned = SITUATIONS.filter(s => !(s.id in assignments))
  const phase2AllAssigned = unassigned.length === 0

  function handleSituationDragStart(situationId: string) {
    setDragging({ label: situationId })
    setPhase2Result(null)
  }

  function handleDropOnModeColumn(mode: string) {
    if (!dragging) return
    setAssignments(prev => ({ ...prev, [dragging.label]: mode }))
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
    for (const s of SITUATIONS) {
      result[s.id] = assignments[s.id] === s.mode
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
      <header className="atelier-header">
        <h1 className="atelier-title">Gestion des conflits — Thomas-Kilmann</h1>
        <p className="atelier-subtitle">
          {phase === 1
            ? 'Phase 1 / 2 — Placez les 5 modes TKI sur le diagramme Assertivité / Coopération.'
            : 'Phase 2 / 2 — Associez chaque situation au mode de gestion des conflits approprié.'}
        </p>
      </header>

      {phase === 1 && (
        <>
          <div className="tki-diagram">
            <div className="tki-axis tki-axis--y">Assertivité ↑</div>
            <div className="tki-grid">
              <DiagramZone zoneId="top-left"     label={diagramZones['top-left']}     result={phase1Result} onDrop={handleDropOnDiagramZone} onDragStart={handleDiagramDragStart} />
              <div className="tki-cell--empty" />
              <DiagramZone zoneId="top-right"    label={diagramZones['top-right']}    result={phase1Result} onDrop={handleDropOnDiagramZone} onDragStart={handleDiagramDragStart} />
              <div className="tki-cell--empty" />
              <DiagramZone zoneId="center"       label={diagramZones['center']}       result={phase1Result} onDrop={handleDropOnDiagramZone} onDragStart={handleDiagramDragStart} />
              <div className="tki-cell--empty" />
              <DiagramZone zoneId="bottom-left"  label={diagramZones['bottom-left']}  result={phase1Result} onDrop={handleDropOnDiagramZone} onDragStart={handleDiagramDragStart} />
              <div className="tki-cell--empty" />
              <DiagramZone zoneId="bottom-right" label={diagramZones['bottom-right']} result={phase1Result} onDrop={handleDropOnDiagramZone} onDragStart={handleDiagramDragStart} />
            </div>
            <div className="tki-axis tki-axis--x">Coopération →</div>
          </div>

          {phase1Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                {phase1Score} / 5 correct{phase1Perfect ? ' — Parfait !' : ''}
              </span>
            </div>
          )}

          <div className="scrum-palette" onDragOver={e => e.preventDefault()} onDrop={handleDropOnDiagramPalette}>
            <p className="scrum-palette__title">Modes à placer</p>
            <div className="scrum-palette__labels">
              {paletteModes.map(label => (
                <span key={label} className="scrum-label" draggable onDragStart={() => handleDiagramDragStart(label)}>
                  {label}
                </span>
              ))}
              {paletteModes.length === 0 && (
                <span className="scrum-palette__empty">Tous les modes ont été placés</span>
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
          <div className="tki-columns">
            {MODE_LABELS.map(mode => {
              const modeSituations = SITUATIONS.filter(s => assignments[s.id] === mode)
              return (
                <div
                  key={mode}
                  data-mode={mode}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnModeColumn(mode)}
                >
                  <h3 className="tki-column__title">{mode}</h3>
                  <div className="tki-column__cards">
                    {modeSituations.map(s => (
                      <div
                        key={s.id}
                        data-situation={s.id}
                        className={
                          'tki-situation-card' +
                          (phase2Result !== null
                            ? phase2Result[s.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                            : '')
                        }
                        draggable
                        onDragStart={() => handleSituationDragStart(s.id)}
                      >
                        {s.text}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="tki-pool" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPool}>
            <p className="scrum-palette__title">Situations à classer</p>
            <div className="tki-pool__cards">
              {unassigned.map(s => (
                <div
                  key={s.id}
                  data-situation={s.id}
                  className="tki-situation-card"
                  draggable
                  onDragStart={() => handleSituationDragStart(s.id)}
                >
                  {s.text}
                </div>
              ))}
              {unassigned.length === 0 && (
                <span className="scrum-palette__empty">Toutes les situations ont été classées</span>
              )}
            </div>
          </div>

          {phase2Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase2Score === 15 ? 'badge--green' : 'badge--orange'}`}>
                {phase2Score} / 15 correct{phase2Score === 15 ? ' — Parfait !' : ''}
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
