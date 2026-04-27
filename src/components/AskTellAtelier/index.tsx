import { useState } from 'react'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

const ZONE_ANSWERS: Record<string, string> = {
  'tell': 'Posture directive',
  'ask':  'Posture de coaching',
}
const ZONE_IDS = ['tell', 'ask']
const STANCE_LABELS = Object.values(ZONE_ANSWERS)

const ZONE_META: Record<string, { header: string; sub: string }> = {
  tell: { header: 'Tell', sub: 'Donner la solution, imposer une décision' },
  ask:  { header: 'Ask',  sub: 'Questionner, faire réfléchir, responsabiliser' },
}

type Situation = { id: string; text: string; stance: string }

const SITUATIONS: Situation[] = [
  { id: 's1',  text: 'Une faille de sécurité critique nécessite une action immédiate.', stance: 'tell' },
  { id: 's2',  text: 'Une règle légale ou contractuelle doit être respectée sans discussion.', stance: 'tell' },
  { id: 's3',  text: "L'équipe viole la Definition of Done de manière répétée.", stance: 'tell' },
  { id: 's4',  text: "Un comportement toxique impacte fortement l'équipe.", stance: 'tell' },
  { id: 's5',  text: 'Une urgence production nécessite une décision rapide.', stance: 'tell' },
  { id: 's6',  text: "Un standard technique obligatoire n'est pas respecté.", stance: 'tell' },
  { id: 's7',  text: 'Un risque majeur est identifié et nécessite une action immédiate.', stance: 'tell' },
  { id: 's8',  text: 'Un développeur bloque sur une solution technique.', stance: 'ask' },
  { id: 's9',  text: "L'équipe manque d'idées pour améliorer la rétrospective.", stance: 'ask' },
  { id: 's10', text: 'Le Product Owner hésite sur une priorisation.', stance: 'ask' },
  { id: 's11', text: "L'équipe a du mal à s'organiser efficacement.", stance: 'ask' },
  { id: 's12', text: 'Un membre semble démotivé.', stance: 'ask' },
  { id: 's13', text: "L'équipe ne comprend pas pourquoi une pratique est utile.", stance: 'ask' },
  { id: 's14', text: 'Un conflit léger apparaît entre deux membres.', stance: 'ask' },
]

type DirectivePhrase = { id: string; text: string }

const DIRECTIVE_PHRASES: DirectivePhrase[] = [
  { id: 'r1', text: 'Tu devrais découper cette User Story.' },
  { id: 'r2', text: 'Il faut améliorer vos Daily Scrum.' },
  { id: 'r3', text: 'Tu dois mieux communiquer avec l\'équipe.' },
  { id: 'r4', text: 'Cette solution n\'est pas la bonne.' },
  { id: 'r5', text: 'Vous devez réduire la taille des tickets.' },
  { id: 'r6', text: 'Il faut suivre la Definition of Done.' },
  { id: 'r7', text: 'Tu dois prioriser différemment.' },
]

type AnalysisResult = { isOpenQuestion: boolean; isNonDirective: boolean; isReflective: boolean }

function analyzeReformulation(text: string): AnalysisResult {
  const t = text.trim().toLowerCase()
  const openWords = ["qu'", "quoi", "comment", "pourquoi", "quel", "quelle", "quels", "quelles", "à quoi", "de quoi", "en quoi", "que ", "qu'est", "quand", "lequel", "laquelle"]
  const directivePatterns = ["tu dois", "il faut", "vous devez", "tu devrais", "il faudrait", "faites", "arrêtez", "commencez", "fais ", "ne pas "]

  const isOpenQuestion = t.includes("?") && openWords.some(w => t.startsWith(w))
  const isNonDirective = t.length > 0 && !directivePatterns.some(p => t.includes(p))
  const isReflective = isOpenQuestion && isNonDirective

  return { isOpenQuestion, isNonDirective, isReflective }
}

function StanceZone({ zoneId, label, result, onDrop, onDragStart }: {
  zoneId: string
  label: string
  result: Record<string, boolean> | null
  onDrop: (zoneId: string) => void
  onDragStart: (label: string, fromZone?: string) => void
}) {
  const verified = result !== null
  const correct = result?.[zoneId]
  const meta = ZONE_META[zoneId]
  return (
    <div
      data-zone={zoneId}
      className={
        'at-stance-zone' +
        (label ? ' at-stance-zone--filled' : ' at-stance-zone--empty') +
        (verified ? (correct ? ' at-stance-zone--correct' : ' at-stance-zone--wrong') : '')
      }
      onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('at-stance-zone--hover') }}
      onDragLeave={e => e.currentTarget.classList.remove('at-stance-zone--hover')}
      onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('at-stance-zone--hover'); onDrop(zoneId) }}
    >
      <p className="at-stance-zone__header">{meta.header}</p>
      <p className="at-stance-zone__sub">{meta.sub}</p>
      {label ? (
        <span className="scrum-label scrum-label--placed" draggable onDragStart={() => onDragStart(label, zoneId)}>
          {label}
        </span>
      ) : (
        <span className="at-stance-zone__placeholder">Déposer ici</span>
      )}
    </div>
  )
}

export function AskTellAtelier() {
  const [phase, setPhase] = useState<1 | 2 | 3>(1)

  // Phase 1
  const [stanceZones, setStanceZones] = useState<Record<string, string>>(() =>
    Object.fromEntries(ZONE_IDS.map(id => [id, '']))
  )
  const isDirty = phase > 1 || Object.values(stanceZones).some(Boolean)
  const { showModal, confirm, cancel } = useExitGuard(isDirty)
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)

  // Phase 2
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  // Phase 3
  const [reformulations, setReformulations] = useState<Record<string, string>>(() =>
    Object.fromEntries(DIRECTIVE_PHRASES.map(p => [p.id, '']))
  )
  const [phase3Result, setPhase3Result] = useState<Record<string, AnalysisResult> | null>(null)

  // Shared drag
  const [dragging, setDragging] = useState<{ label: string; fromZone?: string } | null>(null)

  // Phase 1 derived
  const placedLabels = new Set(Object.values(stanceZones).filter(Boolean))
  const paletteLabels = STANCE_LABELS.filter(l => !placedLabels.has(l))
  const phase1AllFilled = paletteLabels.length === 0

  function handleLabelDragStart(label: string, fromZone?: string) {
    setDragging({ label, fromZone })
    setPhase1Result(null)
  }
  function handleDropOnStanceZone(zoneId: string) {
    if (!dragging) return
    setStanceZones(prev => {
      const next = { ...prev }
      if (dragging.fromZone) next[dragging.fromZone] = ''
      next[zoneId] = dragging.label
      return next
    })
    setDragging(null)
  }
  function handleDropOnPalette() {
    if (!dragging?.fromZone) { setDragging(null); return }
    setStanceZones(prev => ({ ...prev, [dragging.fromZone!]: '' }))
    setDragging(null)
  }
  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const zoneId of ZONE_IDS) {
      result[zoneId] = stanceZones[zoneId] === ZONE_ANSWERS[zoneId]
    }
    setPhase1Result(result)
  }
  function handleResetPhase1() {
    setStanceZones(Object.fromEntries(ZONE_IDS.map(id => [id, ''])))
    setPhase1Result(null)
  }
  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : null
  const phase1Perfect = phase1Score === 2

  // Phase 2 derived
  const unassigned = SITUATIONS.filter(s => !(s.id in assignments))
  const phase2AllAssigned = unassigned.length === 0

  function handleSituationDragStart(situationId: string) {
    setDragging({ label: situationId })
    setPhase2Result(null)
  }
  function handleDropOnColumn(stance: string) {
    if (!dragging) return
    setAssignments(prev => ({ ...prev, [dragging.label]: stance }))
    setDragging(null)
  }
  function handleDropOnPool() {
    if (!dragging) { setDragging(null); return }
    setAssignments(prev => { const next = { ...prev }; delete next[dragging.label]; return next })
    setDragging(null)
  }
  function handleVerifyPhase2() {
    const result: Record<string, boolean> = {}
    for (const s of SITUATIONS) result[s.id] = assignments[s.id] === s.stance
    setPhase2Result(result)
  }
  function handleResetPhase2() { setAssignments({}); setPhase2Result(null) }
  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  // Phase 3
  const phase3AllFilled = DIRECTIVE_PHRASES.every(p => reformulations[p.id].trim().length > 0)

  function handleVerifyPhase3() {
    const result: Record<string, AnalysisResult> = {}
    for (const p of DIRECTIVE_PHRASES) {
      result[p.id] = analyzeReformulation(reformulations[p.id])
    }
    setPhase3Result(result)
  }
  function handleResetPhase3() {
    setReformulations(Object.fromEntries(DIRECTIVE_PHRASES.map(p => [p.id, ''])))
    setPhase3Result(null)
  }
  const phase3Score = phase3Result
    ? Object.values(phase3Result).filter(r => r.isReflective).length
    : null

  const finalBadgeGreen = phase2Score !== null && phase2Score >= 12 && phase3Score !== null && phase3Score >= 5

  return (
    <>
    <div className="atelier-page">
      <WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'ask-vs-tell')!} />
      <header className="atelier-header">
        <h1 className="atelier-title">Ask vs Tell — Posture de coaching</h1>
        <p className="atelier-subtitle">
          {phase === 1 && 'Phase 1 / 3 — Associez chaque posture à sa description.'}
          {phase === 2 && 'Phase 2 / 3 — Classez les situations selon la posture appropriée.'}
          {phase === 3 && 'Phase 3 / 3 — Transformez ces phrases directives en questions de coaching.'}
        </p>
      </header>

      {phase === 1 && (
        <>
          <div className="at-stance-zones">
            {ZONE_IDS.map(zoneId => (
              <StanceZone
                key={zoneId}
                zoneId={zoneId}
                label={stanceZones[zoneId]}
                result={phase1Result}
                onDrop={handleDropOnStanceZone}
                onDragStart={handleLabelDragStart}
              />
            ))}
          </div>

          {phase1Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                {phase1Score} / 2 correct{phase1Perfect ? ' — Parfait !' : ''}
              </span>
            </div>
          )}

          <div className="scrum-palette" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPalette}>
            <p className="scrum-palette__title">Postures à associer</p>
            <div className="scrum-palette__labels">
              {paletteLabels.map(label => (
                <span key={label} className="scrum-label" draggable onDragStart={() => handleLabelDragStart(label)}>
                  {label}
                </span>
              ))}
              {paletteLabels.length === 0 && (
                <span className="scrum-palette__empty">Toutes les postures ont été associées</span>
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
            {ZONE_IDS.map(stance => {
              const colSituations = SITUATIONS.filter(s => assignments[s.id] === stance)
              return (
                <div
                  key={stance}
                  data-mode={stance}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnColumn(stance)}
                >
                  <h3 className="tki-column__title">{ZONE_META[stance].header}</h3>
                  <div className="tki-column__cards">
                    {colSituations.map(s => (
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
              <span className={`badge ${phase2Score! >= 12 ? 'badge--green' : 'badge--orange'}`}>
                {phase2Score} / 14 correct
              </span>
            </div>
          )}

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={handleVerifyPhase2} disabled={!phase2AllAssigned}>
              Vérifier
            </button>
            {phase2Result && (
              <>
                <button className="btn btn--secondary" onClick={handleResetPhase2}>Réessayer phase 2</button>
                <button className="btn btn--primary" onClick={() => setPhase(3)}>Phase suivante →</button>
              </>
            )}
          </div>
        </>
      )}

      {phase === 3 && (
        <>
          <div className="at-reformulations">
            {DIRECTIVE_PHRASES.map(phrase => {
              const analysis = phase3Result?.[phrase.id]
              return (
                <div key={phrase.id} className="at-phrase-item">
                  <p className="at-directive">
                    <span className="at-directive__tag">Tell</span>
                    {phrase.text}
                  </p>
                  <input
                    data-reformulation-id={phrase.id}
                    type="text"
                    className="at-phrase-input"
                    placeholder="Reformulez en question ouverte…"
                    value={reformulations[phrase.id]}
                    onChange={e => setReformulations(prev => ({ ...prev, [phrase.id]: e.target.value }))}
                  />
                  {analysis && (
                    <div className="at-indicators">
                      <span className={`at-indicator ${analysis.isOpenQuestion ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                        {analysis.isOpenQuestion ? '✓' : '✗'} Question ouverte
                      </span>
                      <span className={`at-indicator ${analysis.isNonDirective ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                        {analysis.isNonDirective ? '✓' : '✗'} Non directive
                      </span>
                      <span className={`at-indicator ${analysis.isReflective ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                        {analysis.isReflective ? '✓' : '✗'} Orientée réflexion
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {phase3Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${finalBadgeGreen ? 'badge--green' : 'badge--orange'}`}>
                {phase3Score} / 7 questions réflexives
                {finalBadgeGreen ? ' — Excellent !' : ''}
              </span>
            </div>
          )}

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={handleVerifyPhase3} disabled={!phase3AllFilled}>
              Vérifier mes reformulations
            </button>
            {phase3Result && (
              <button className="btn btn--secondary" onClick={handleResetPhase3}>Réessayer phase 3</button>
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
