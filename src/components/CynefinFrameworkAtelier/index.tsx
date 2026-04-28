import { useState } from 'react'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type Phase = 1 | 2 | 3
type CynefinDomain = 'clear' | 'complicated' | 'complex' | 'chaotic' | 'disorder'

const DOMAIN_IDS: CynefinDomain[] = ['clear', 'complicated', 'complex', 'chaotic', 'disorder']

const DOMAIN_META: Record<CynefinDomain, {
  label: string
  description: string
  responseStrategy: string
  suggestedPosture: string
  practiceLabel: string
  bgColor: string
  textColor: string
}> = {
  clear: {
    label: 'Clear',
    description: 'Tightly constrained — no degrees of freedom',
    responseStrategy: 'Sense → Categorize → Respond',
    suggestedPosture: 'Standardiser',
    practiceLabel: 'Best Practice',
    bgColor: '#f5f7fa',
    textColor: '#1e2433',
  },
  complicated: {
    label: 'Complicated',
    description: 'Governing constraints — tightly coupled',
    responseStrategy: 'Sense → Analyze → Respond',
    suggestedPosture: 'Analyser',
    practiceLabel: 'Good Practice',
    bgColor: '#d6dde6',
    textColor: '#1e2433',
  },
  complex: {
    label: 'Complex',
    description: 'Enabling constraints — loosely coupled',
    responseStrategy: 'Probe → Sense → Respond',
    suggestedPosture: 'Expérimenter',
    practiceLabel: 'Emergent Practice',
    bgColor: '#3d4f63',
    textColor: '#ffffff',
  },
  chaotic: {
    label: 'Chaotic',
    description: 'Lacking constraints — de-coupled',
    responseStrategy: 'Act → Sense → Respond',
    suggestedPosture: 'Agir immédiatement',
    practiceLabel: 'Novel Practice',
    bgColor: '#1e2433',
    textColor: '#ffffff',
  },
  disorder: {
    label: 'Disorder',
    description: 'Domaine non identifié',
    responseStrategy: 'Identifier le bon domaine',
    suggestedPosture: 'Diagnostiquer',
    practiceLabel: '',
    bgColor: '#e05c4b',
    textColor: '#ffffff',
  },
}

type Situation = { id: string; text: string; domain: CynefinDomain }

const SITUATIONS: Situation[] = [
  { id: 'cl1', text: 'Une procédure standard de déploiement doit être appliquée sans variation.',                                            domain: 'clear' },
  { id: 'cl2', text: 'Le respect de la Definition of Done suit une règle claire connue de tous.',                                            domain: 'clear' },
  { id: 'cl3', text: 'Une checklist de release validée doit être exécutée.',                                                                 domain: 'clear' },
  { id: 'co1', text: "Une architecture technique complexe nécessite l'avis d'un expert senior.",                                             domain: 'complicated' },
  { id: 'co2', text: 'Une analyse de performance demande une investigation approfondie.',                                                     domain: 'complicated' },
  { id: 'co3', text: 'Le choix entre deux solutions cloud nécessite une expertise technique.',                                                domain: 'complicated' },
  { id: 'cx1', text: 'Une nouvelle organisation produit doit être testée sans certitude sur le meilleur modèle.',                            domain: 'complex' },
  { id: 'cx2', text: "L'équipe veut améliorer la collaboration mais les causes sont multiples et mouvantes.",                                domain: 'complex' },
  { id: 'cx3', text: "Une transformation agile est lancée dans un environnement politique instable.",                                        domain: 'complex' },
  { id: 'ch1', text: 'Une production critique tombe pendant une démonstration client majeure.',                                              domain: 'chaotic' },
  { id: 'ch2', text: 'Une faille de sécurité impose une réaction immédiate.',                                                                domain: 'chaotic' },
  { id: 'ch3', text: 'Une crise majeure bloque totalement la livraison.',                                                                    domain: 'chaotic' },
  { id: 'd1',  text: "L'équipe sait qu'un problème existe mais ne comprend pas encore sa nature.",                                           domain: 'disorder' },
  { id: 'd2',  text: "Plusieurs signaux faibles apparaissent sans qu'on sache s'il s'agit d'un problème process, humain ou technique.",      domain: 'disorder' },
  { id: 'd3',  text: 'Un conflit récurrent persiste sans diagnostic clair.',                                                                 domain: 'disorder' },
]

const POSTURE_KEYWORDS: Record<CynefinDomain, string[]> = {
  clear:       ['standardis', 'appliquer', 'suivre', 'exécuter', 'automatiser', 'procédure', 'checklist', 'règle'],
  complicated: ['analys', 'consult', 'évaluer', 'investigu', 'expert', 'investigation', 'examine'],
  complex:     ['expérim', 'tester', 'sonder', 'explorer', 'itér', 'observer', 'prototype', 'essai'],
  chaotic:     ['agir', 'réagir', 'stabiliser', 'contenir', 'urgence', 'immédiat', 'crise', 'action'],
  disorder:    ['diagnost', 'identifier', 'clarifier', 'comprendre', 'discriminer'],
}

function isPostureCoherent(posture: string, domain: CynefinDomain): boolean {
  const p = posture.trim().toLowerCase()
  return p.length > 2 && POSTURE_KEYWORDS[domain].some(kw => p.includes(kw))
}

type ZoneMap = Record<CynefinDomain, CynefinDomain | ''>
type SituationAssignments = Record<string, CynefinDomain>
type PostureEntry = { posture: string; firstAction: string }
type DecisionPosture = Record<string, PostureEntry>
type Dragging =
  | { type: 'domain'; domain: CynefinDomain }
  | { type: 'situation'; situationId: string }
  | null

function CynefinQuad({
  zoneId, placed, result, onDrop, onDragStart,
}: {
  zoneId: CynefinDomain
  placed: CynefinDomain | ''
  result: Record<CynefinDomain, boolean> | null
  onDrop: (id: CynefinDomain) => void
  onDragStart: (d: CynefinDomain) => void
}) {
  const meta = DOMAIN_META[zoneId]
  const correct = result?.[zoneId]
  const verified = result !== null
  return (
    <div
      data-zone={zoneId}
      className={[
        'cf-quad',
        `cf-quad--${zoneId}`,
        verified ? (correct ? 'cf-quad--correct' : 'cf-quad--wrong') : '',
      ].filter(Boolean).join(' ')}
      style={{ backgroundColor: meta.bgColor, color: meta.textColor }}
      onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('cf-quad--hover') }}
      onDragLeave={e => e.currentTarget.classList.remove('cf-quad--hover')}
      onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('cf-quad--hover'); onDrop(zoneId) }}
    >
      <div className="cf-quad__meta">
        <strong className="cf-quad__label">{meta.label.toUpperCase()}</strong>
        <span className="cf-quad__desc">{meta.description}</span>
        <span className="cf-quad__strategy">{meta.responseStrategy}</span>
      </div>
      <div className="cf-quad__drop-area">
        {placed ? (
          <div
            data-domain={placed}
            className="cf-domain-placed-card"
            draggable
            onDragStart={() => onDragStart(placed)}
          >
            <strong>{DOMAIN_META[placed].label}</strong>
          </div>
        ) : (
          <span className="cf-quad__placeholder">Déposer ici</span>
        )}
      </div>
      {meta.practiceLabel && (
        <span className="cf-quad__practice">{meta.practiceLabel}</span>
      )}
    </div>
  )
}

const EMPTY_ZONES: ZoneMap = Object.fromEntries(DOMAIN_IDS.map(d => [d, ''])) as ZoneMap

export function CynefinFrameworkAtelier() {
  const [phase, setPhase] = useState<Phase>(1)

  // Phase 1 — place 5 domain cards on the diagram
  const [frameworkZones, setFrameworkZones] = useState<ZoneMap>({ ...EMPTY_ZONES })
  const isDirty = phase > 1 || Object.values(frameworkZones).some(Boolean)
  const { showModal, confirm, cancel } = useExitGuard(isDirty)
  const [phase1Result, setPhase1Result] = useState<Record<CynefinDomain, boolean> | null>(null)

  // Phase 2 — assign 15 situations to domains
  const [situationAssignments, setSituationAssignments] = useState<SituationAssignments>({})
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  // Phase 3 — define decision posture for selected situations
  const [selectedSituations, setSelectedSituations] = useState<Set<string>>(new Set())
  const [decisionPosture, setDecisionPosture] = useState<DecisionPosture>({})
  const [phase3Result, setPhase3Result] = useState<Record<string, { postureOk: boolean }> | null>(null)

  const [dragging, setDragging] = useState<Dragging>(null)

  // ── Phase 1 derived ──────────────────────────────────────
  const placedDomains = new Set(Object.values(frameworkZones).filter(Boolean) as CynefinDomain[])
  const paletteDomains = DOMAIN_IDS.filter(d => !placedDomains.has(d))
  const phase1AllFilled = paletteDomains.length === 0
  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : null
  const phase1Perfect = phase1Score === 5

  function handleDragStartDomain(domain: CynefinDomain) {
    setDragging({ type: 'domain', domain })
    setPhase1Result(null)
  }
  function handleDropOnZone(zoneId: CynefinDomain) {
    if (!dragging || dragging.type !== 'domain') return
    setFrameworkZones(prev => {
      const next = { ...prev }
      for (const k of DOMAIN_IDS) if (next[k] === dragging.domain) next[k] = ''
      next[zoneId] = dragging.domain
      return next
    })
    setDragging(null)
  }
  function handleDropOnPalette1() {
    if (!dragging || dragging.type !== 'domain') { setDragging(null); return }
    setFrameworkZones(prev => {
      const next = { ...prev }
      for (const k of DOMAIN_IDS) if (next[k] === dragging.domain) next[k] = ''
      return next
    })
    setDragging(null)
  }
  function verifyPhase1() {
    const result = {} as Record<CynefinDomain, boolean>
    for (const d of DOMAIN_IDS) result[d] = frameworkZones[d] === d
    setPhase1Result(result)
  }
  function resetPhase1() { setFrameworkZones({ ...EMPTY_ZONES }); setPhase1Result(null) }

  // ── Phase 2 derived ──────────────────────────────────────
  const pool2 = SITUATIONS.filter(s => !(s.id in situationAssignments))
  const phase2AllAssigned = pool2.length === 0
  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  function handleDragStartSituation(situationId: string) {
    setDragging({ type: 'situation', situationId })
    setPhase2Result(null)
  }
  function handleDropOnDomainZone(domain: CynefinDomain) {
    if (!dragging || dragging.type !== 'situation') return
    setSituationAssignments(prev => ({ ...prev, [dragging.situationId]: domain }))
    setDragging(null)
  }
  function handleDropOnPool2() {
    if (!dragging || dragging.type !== 'situation') { setDragging(null); return }
    setSituationAssignments(prev => { const next = { ...prev }; delete next[dragging.situationId]; return next })
    setDragging(null)
  }
  function verifyPhase2() {
    const result: Record<string, boolean> = {}
    SITUATIONS.forEach(s => { result[s.id] = situationAssignments[s.id] === s.domain })
    setPhase2Result(result)
  }
  function resetPhase2() { setSituationAssignments({}); setPhase2Result(null) }

  // ── Phase 3 derived ──────────────────────────────────────
  const phase3AllFilled =
    selectedSituations.size > 0 &&
    [...selectedSituations].every(id => {
      const e = decisionPosture[id]
      return e && e.posture.trim().length > 0 && e.firstAction.trim().length > 0
    })

  function toggleSituation(id: string) {
    setSelectedSituations(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
    setPhase3Result(null)
  }
  function updatePosture(id: string, field: keyof PostureEntry, value: string) {
    setDecisionPosture(prev => ({
      ...prev,
      [id]: { posture: '', firstAction: '', ...prev[id], [field]: value },
    }))
    setPhase3Result(null)
  }
  function verifyPhase3() {
    const result: Record<string, { postureOk: boolean }> = {}
    for (const id of selectedSituations) {
      const domain = situationAssignments[id] ?? SITUATIONS.find(s => s.id === id)!.domain
      result[id] = { postureOk: isPostureCoherent(decisionPosture[id]?.posture ?? '', domain) }
    }
    setPhase3Result(result)
  }
  function resetPhase3() {
    setSelectedSituations(new Set())
    setDecisionPosture({})
    setPhase3Result(null)
  }

  const phase3AllCoherent = phase3Result !== null && Object.values(phase3Result).every(r => r.postureOk)
  const finalBadgeGreen = phase2Score !== null && phase2Score >= 13 && phase3AllCoherent

  return (
    <>
    <div className="atelier-page">
      <WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'cynefin-framework')!} />
      <header className="atelier-header">
        <h1 className="atelier-title">Cynefin Framework</h1>
        <p className="atelier-subtitle">
          {phase === 1 && 'Phase 1 / 3 — Positionnez les 5 domaines sur le diagramme Cynefin.'}
          {phase === 2 && 'Phase 2 / 3 — Classez 15 situations dans le bon domaine Cynefin.'}
          {phase === 3 && 'Phase 3 / 3 — Définissez votre posture de décision.'}
        </p>
      </header>

      {phase === 1 && (
        <>
          <div className="cf-phase1-layout">
            <div className="cf-diagram">
              <div className="cf-diagram-grid">
                {(['complex', 'complicated', 'chaotic', 'clear'] as CynefinDomain[]).map(id => (
                  <CynefinQuad
                    key={id}
                    zoneId={id}
                    placed={frameworkZones[id]}
                    result={phase1Result}
                    onDrop={handleDropOnZone}
                    onDragStart={handleDragStartDomain}
                  />
                ))}
              </div>
              <div className="cf-center">
                <div
                  data-zone="disorder"
                  className={[
                    'cf-disorder-zone',
                    phase1Result !== null
                      ? (phase1Result['disorder'] ? 'cf-disorder-zone--correct' : 'cf-disorder-zone--wrong')
                      : '',
                  ].filter(Boolean).join(' ')}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); handleDropOnZone('disorder') }}
                >
                  {frameworkZones['disorder'] ? (
                    <div
                      data-domain={frameworkZones['disorder']}
                      className="cf-domain-placed-card cf-domain-placed-card--center"
                      draggable
                      onDragStart={() => handleDragStartDomain(frameworkZones['disorder'] as CynefinDomain)}
                    >
                      <strong>{DOMAIN_META[frameworkZones['disorder'] as CynefinDomain].label}</strong>
                    </div>
                  ) : (
                    <span className="cf-disorder-zone__label">⬧<br />Disorder</span>
                  )}
                </div>
              </div>
            </div>

            <div className="cf-palette" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPalette1}>
              <p className="mm-section-label">Domaines à placer</p>
              <div className="cf-palette__cards">
                {paletteDomains.map(d => (
                  <div
                    key={d}
                    data-domain={d}
                    className="cf-domain-card"
                    draggable
                    onDragStart={() => handleDragStartDomain(d)}
                  >
                    <strong className="cf-domain-card__name">{DOMAIN_META[d].label}</strong>
                    <span className="cf-domain-card__desc">{DOMAIN_META[d].description}</span>
                  </div>
                ))}
                {paletteDomains.length === 0 && (
                  <span className="scrum-palette__empty">Tous les domaines ont été placés</span>
                )}
              </div>
            </div>
          </div>

          {phase1Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                {phase1Score} / 5 correct{phase1Perfect ? ' — Parfait !' : ''}
              </span>
            </div>
          )}

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
          <div className="cf-diagram cf-diagram--p2">
            <div className="cf-diagram-grid cf-diagram-grid--p2">
              {(['complex', 'complicated', 'chaotic', 'clear'] as CynefinDomain[]).map(domain => {
                const col = SITUATIONS.filter(s => situationAssignments[s.id] === domain)
                return (
                  <div
                    key={domain}
                    data-domain-zone={domain}
                    className={`cf-quad cf-quad--${domain} cf-quad--p2`}
                    style={{ backgroundColor: DOMAIN_META[domain].bgColor, color: DOMAIN_META[domain].textColor }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleDropOnDomainZone(domain)}
                  >
                    <div className="cf-quad__header">
                      <strong className="cf-quad__label">{DOMAIN_META[domain].label.toUpperCase()}</strong>
                      <span className="cf-quad__strategy">{DOMAIN_META[domain].responseStrategy}</span>
                    </div>
                    <div className="cf-quad__cards">
                      {col.map(s => (
                        <div
                          key={s.id}
                          data-situation={s.id}
                          className={'cf-sit-card' + (phase2Result ? (phase2Result[s.id] ? ' cf-sit-card--correct' : ' cf-sit-card--wrong') : '')}
                          draggable
                          onDragStart={() => handleDragStartSituation(s.id)}
                        >
                          {s.text}
                        </div>
                      ))}
                      {col.length === 0 && <span className="cf-quad__placeholder">Déposer ici</span>}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="cf-center">
              <div
                data-domain-zone="disorder"
                className="cf-disorder-zone cf-disorder-zone--p2"
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDropOnDomainZone('disorder')}
              >
                {(() => {
                  const disorderCards = SITUATIONS.filter(s => situationAssignments[s.id] === 'disorder')
                  return disorderCards.length === 0 ? (
                    <span className="cf-disorder-zone__label">⬧<br />Disorder</span>
                  ) : (
                    <div className="cf-disorder-zone__cards">
                      {disorderCards.map(s => (
                        <div
                          key={s.id}
                          data-situation={s.id}
                          className={'cf-sit-card cf-sit-card--tiny' + (phase2Result ? (phase2Result[s.id] ? ' cf-sit-card--correct' : ' cf-sit-card--wrong') : '')}
                          draggable
                          onDragStart={() => handleDragStartSituation(s.id)}
                        >
                          {s.text.length > 28 ? s.text.slice(0, 28) + '…' : s.text}
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>

          <div className="cf-pool" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPool2}>
            <p className="scrum-palette__title">Situations à classer</p>
            <div className="cf-pool__cards">
              {pool2.map(s => (
                <div
                  key={s.id}
                  data-situation={s.id}
                  className="cf-sit-card"
                  draggable
                  onDragStart={() => handleDragStartSituation(s.id)}
                >
                  {s.text}
                </div>
              ))}
              {pool2.length === 0 && (
                <span className="scrum-palette__empty">Toutes les situations ont été classées</span>
              )}
            </div>
          </div>

          {phase2Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase2Score === 15 ? 'badge--green' : 'badge--orange'}`}>
                {phase2Score} / 15 correct
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
          <p className="cf-phase3-intro">
            Sélectionnez des situations et définissez votre posture de décision pour chacune.
          </p>

          <div className="cf-phase3-list">
            {SITUATIONS.map(s => {
              const assignedDomain = (situationAssignments[s.id] ?? s.domain) as CynefinDomain
              const isSelected = selectedSituations.has(s.id)
              const entry = decisionPosture[s.id]
              const r3 = phase3Result?.[s.id]

              return (
                <div key={s.id} className={`cf-phase3-item cf-phase3-item--${assignedDomain}${isSelected ? ' cf-phase3-item--selected' : ''}`}>
                  <div className="cf-phase3-item__header">
                    <input
                      type="checkbox"
                      data-situation-checkbox={s.id}
                      checked={isSelected}
                      onChange={() => toggleSituation(s.id)}
                    />
                    <span className={`cf-domain-badge cf-domain-badge--${assignedDomain}`}>
                      {DOMAIN_META[assignedDomain].label}
                    </span>
                    <span className="cf-phase3-item__text">{s.text}</span>
                  </div>

                  {isSelected && (
                    <div className="cf-phase3-item__fields">
                      <div className="cf-field-row">
                        <label className="cf-field-label">Posture :</label>
                        <input
                          data-posture={s.id}
                          type="text"
                          className="at-phrase-input"
                          placeholder={`Ex : ${DOMAIN_META[assignedDomain].suggestedPosture}…`}
                          value={entry?.posture ?? ''}
                          onChange={e => updatePosture(s.id, 'posture', e.target.value)}
                        />
                      </div>
                      <div className="cf-field-row">
                        <label className="cf-field-label">Première action :</label>
                        <input
                          data-first-action={s.id}
                          type="text"
                          className="at-phrase-input"
                          placeholder="Première action concrète…"
                          value={entry?.firstAction ?? ''}
                          onChange={e => updatePosture(s.id, 'firstAction', e.target.value)}
                        />
                      </div>
                      {r3 && (
                        <div className="at-indicators">
                          <span className={`at-indicator ${r3.postureOk ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                            {r3.postureOk ? '✓' : '✗'} Cohérence posture / domaine
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {phase3Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${finalBadgeGreen ? 'badge--green' : 'badge--orange'}`}>
                {finalBadgeGreen ? 'Cynefin maîtrisé !' : 'Cynefin à améliorer'}
              </span>
            </div>
          )}

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={verifyPhase3} disabled={!phase3AllFilled}>
              Vérifier mon plan
            </button>
            {phase3Result && (
              <button className="btn btn--secondary" onClick={resetPhase3}>Réessayer phase 3</button>
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
