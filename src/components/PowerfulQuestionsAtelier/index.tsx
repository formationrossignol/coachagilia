import { useState } from 'react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type QuestionCategory = 'closed' | 'leading' | 'powerful'
type CoachingIntent = 'clarify' | 'explore' | 'empower' | 'decide' | 'act'

const QUESTION_CATEGORIES: { id: QuestionCategory; label: string; description: string }[] = [
  { id: 'closed',   label: 'Question fermée',  description: "Réponse courte, souvent oui/non, peu d'exploration." },
  { id: 'leading',  label: 'Question orientée', description: 'La question contient déjà une hypothèse ou pousse vers une réponse.' },
  { id: 'powerful', label: 'Powerful Question', description: "Question ouverte qui clarifie, responsabilise ou ouvre l'action." },
]

const COACHING_INTENTS: { id: CoachingIntent; label: string; description: string }[] = [
  { id: 'clarify', label: 'Clarifier',         description: 'Comprendre le vrai problème avant de chercher une solution.' },
  { id: 'explore', label: 'Explorer',           description: 'Ouvrir les options, les angles morts et les alternatives.' },
  { id: 'empower', label: 'Responsabiliser',    description: "Aider la personne ou l'équipe à retrouver du pouvoir d'action." },
  { id: 'decide',  label: 'Décider',            description: 'Aider à choisir, prioriser ou arbitrer.' },
  { id: 'act',     label: "Passer à l'action",  description: 'Transformer la réflexion en prochaine étape concrète.' },
]

type Question = { id: string; text: string; correctCategory: QuestionCategory }

const QUESTIONS: Question[] = [
  { id: 'q1',  text: 'Est-ce que tu as compris ce qui est attendu ?',                                          correctCategory: 'closed' },
  { id: 'q2',  text: 'Tu penses pouvoir finir cette User Story avant vendredi ?',                              correctCategory: 'closed' },
  { id: 'q3',  text: 'Est-ce que le problème vient du Product Owner ?',                                        correctCategory: 'closed' },
  { id: 'q4',  text: "Vous êtes d'accord avec cette solution ?",                                               correctCategory: 'closed' },
  { id: 'q5',  text: "Tu ne crois pas qu'il faudrait plutôt réduire le périmètre ?",                          correctCategory: 'leading' },
  { id: 'q6',  text: "Pourquoi vous n'avez pas anticipé cette dépendance ?",                                   correctCategory: 'leading' },
  { id: 'q7',  text: "Tu ne penses pas que le Daily est trop long parce que l'équipe manque de discipline ?",  correctCategory: 'leading' },
  { id: 'q8',  text: 'Est-ce que la bonne solution ne serait pas de reprendre le backlog à zéro ?',            correctCategory: 'leading' },
  { id: 'q9',  text: "Qu'est-ce qui te manque pour avancer sereinement ?",                                     correctCategory: 'powerful' },
  { id: 'q10', text: "Qu'est-ce qui rend cette décision difficile pour l'équipe ?",                            correctCategory: 'powerful' },
  { id: 'q11', text: 'Quelle option créerait le plus de valeur avec le moins de risque ?',                     correctCategory: 'powerful' },
  { id: 'q12', text: "Qu'est-ce que l'équipe pourrait expérimenter dès le prochain Sprint ?",                  correctCategory: 'powerful' },
]

type Situation = { id: string; situation: string; question: string; correctIntent: CoachingIntent }

const SITUATIONS: Situation[] = [
  { id: 's1',  situation: "Le Daily Scrum dure 35 minutes et personne ne sait vraiment pourquoi il déborde.",          question: 'Qu'est-ce qui se joue réellement pendant ce Daily ?',                                    correctIntent: 'clarify' },
  { id: 's2',  situation: 'Une User Story revient plusieurs fois en Sprint Planning sans être prise.',                  question: "Qu'est-ce qui n'est pas encore clair dans cette User Story ?",                          correctIntent: 'clarify' },
  { id: 's3',  situation: 'L'équipe dit "on manque de temps", mais sans identifier précisément la cause.',              question: 'Quand vous dites manquer de temps, de quoi manquez-vous exactement ?',                   correctIntent: 'clarify' },
  { id: 's4',  situation: 'Deux développeurs défendent deux approches techniques opposées.',                             question: "Quelles options n'avons-nous pas encore explorées ?",                                    correctIntent: 'explore' },
  { id: 's5',  situation: "Le Product Owner veut absolument livrer vite, mais l'équipe alerte sur la qualité.",         question: 'Quelles seraient les conséquences de chaque option à court et moyen terme ?',           correctIntent: 'explore' },
  { id: 's6',  situation: 'L'équipe répète toujours la même solution en rétrospective sans résultat durable.',          question: "Qu'est-ce que vous n'avez pas encore essayé ?",                                           correctIntent: 'explore' },
  { id: 's7',  situation: "Un membre de l'équipe attend systématiquement que le Scrum Master règle les blocages.",      question: "Quelle serait ta première action possible avant de demander de l'aide ?",                 correctIntent: 'empower' },
  { id: 's8',  situation: "L'équipe accuse régulièrement les parties prenantes de ses difficultés.",                    question: "Sur quoi l'équipe a-t-elle réellement du pouvoir d'action ?",                           correctIntent: 'empower' },
  { id: 's9',  situation: "Un développeur se plaint d'une décision sans proposer d'alternative.",                       question: 'Qu'est-ce que tu proposerais comme option acceptable ?',                                correctIntent: 'empower' },
  { id: 's10', situation: "L'équipe hésite entre réduire le périmètre ou décaler la livraison.",                        question: 'Quel choix protège le mieux la valeur et la qualité ?',                                 correctIntent: 'decide' },
  { id: 's11', situation: 'Le Product Owner ne sait pas quelle User Story prioriser entre deux demandes importantes.',  question: "Quel item crée le plus d'impact pour l'utilisateur maintenant ?",                        correctIntent: 'decide' },
  { id: 's12', situation: "L'équipe débat longuement sans réussir à trancher.",                                          question: 'De quelle information avons-nous besoin pour décider ?',                                correctIntent: 'decide' },
  { id: 's13', situation: "La rétrospective produit beaucoup d'idées, mais aucune action concrète.",                    question: 'Quelle action simple pouvons-nous tester dès cette semaine ?',                           correctIntent: 'act' },
  { id: 's14', situation: "Un conflit latent est identifié mais personne ne sait comment l'aborder.",                  question: 'Quelle première conversation utile pourrait être engagée ?',                             correctIntent: 'act' },
  { id: 's15', situation: "L'équipe veut améliorer son Definition of Done mais le sujet paraît trop vaste.",            question: 'Quel petit changement concret pouvons-nous intégrer au prochain Sprint ?',              correctIntent: 'act' },
]

export function PowerfulQuestionsAtelier() {
  const { markComplete } = useWorkshopCompletion('powerful-questions')
  const [phase, setPhase] = useState<1 | 2>(1)

  const [questionZones, setQuestionZones] = useState<Record<QuestionCategory, string[]>>({
    closed: [], leading: [], powerful: [],
  })
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)

  const [situationZones, setSituationZones] = useState<Record<CoachingIntent, string[]>>({
    clarify: [], explore: [], empower: [], decide: [], act: [],
  })
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  const [dragging, setDragging] = useState<
    | { type: 'question'; id: string; fromCategory?: QuestionCategory }
    | { type: 'situation'; id: string; fromIntent?: CoachingIntent }
    | null
  >(null)

  const isDirty = phase > 1 || Object.values(questionZones).some(arr => arr.length > 0)
  const { showModal, confirm, cancel } = useExitGuard(isDirty)

  const placedQuestionIds = new Set(Object.values(questionZones).flat())
  const paletteQuestions = QUESTIONS.filter(q => !placedQuestionIds.has(q.id))
  const phase1AllPlaced = paletteQuestions.length === 0

  function handleQuestionDragStart(id: string, fromCategory?: QuestionCategory) {
    setDragging({ type: 'question', id, fromCategory })
    setPhase1Result(null)
  }

  function handleDropOnQuestionColumn(category: QuestionCategory) {
    if (!dragging || dragging.type !== 'question') return
    setQuestionZones(prev => {
      const next = { ...prev }
      if (dragging.fromCategory) {
        next[dragging.fromCategory] = next[dragging.fromCategory].filter(id => id !== dragging.id)
      }
      if (!next[category].includes(dragging.id)) next[category] = [...next[category], dragging.id]
      return next
    })
    setDragging(null)
  }

  function handleDropOnQuestionPalette() {
    if (!dragging || dragging.type !== 'question' || !dragging.fromCategory) { setDragging(null); return }
    setQuestionZones(prev => ({
      ...prev,
      [dragging.fromCategory!]: prev[dragging.fromCategory!].filter(id => id !== dragging.id),
    }))
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const q of QUESTIONS) {
      const cat = (Object.entries(questionZones) as [QuestionCategory, string[]][])
        .find(([, ids]) => ids.includes(q.id))?.[0]
      result[q.id] = cat === q.correctCategory
    }
    setPhase1Result(result)
  }

  function handleResetPhase1() {
    setQuestionZones({ closed: [], leading: [], powerful: [] })
    setPhase1Result(null)
  }

  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : null
  const phase1Perfect = phase1Score === 12

  const placedSituationIds = new Set(Object.values(situationZones).flat())
  const poolSituations = SITUATIONS.filter(s => !placedSituationIds.has(s.id))
  const phase2AllPlaced = poolSituations.length === 0

  function handleSituationDragStart(id: string, fromIntent?: CoachingIntent) {
    setDragging({ type: 'situation', id, fromIntent })
    setPhase2Result(null)
  }

  function handleDropOnIntentColumn(intent: CoachingIntent) {
    if (!dragging || dragging.type !== 'situation') return
    setSituationZones(prev => {
      const next = { ...prev }
      if (dragging.fromIntent) {
        next[dragging.fromIntent] = next[dragging.fromIntent].filter(id => id !== dragging.id)
      }
      if (!next[intent].includes(dragging.id)) next[intent] = [...next[intent], dragging.id]
      return next
    })
    setDragging(null)
  }

  function handleDropOnSituationPool() {
    if (!dragging || dragging.type !== 'situation' || !dragging.fromIntent) { setDragging(null); return }
    setSituationZones(prev => ({
      ...prev,
      [dragging.fromIntent!]: prev[dragging.fromIntent!].filter(id => id !== dragging.id),
    }))
    setDragging(null)
  }

  function handleVerifyPhase2() {
    markComplete()
    const result: Record<string, boolean> = {}
    for (const s of SITUATIONS) {
      const intent = (Object.entries(situationZones) as [CoachingIntent, string[]][])
        .find(([, ids]) => ids.includes(s.id))?.[0]
      result[s.id] = intent === s.correctIntent
    }
    setPhase2Result(result)
  }

  function handleResetPhase2() {
    setSituationZones({ clarify: [], explore: [], empower: [], decide: [], act: [] })
    setPhase2Result(null)
  }

  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  return (
    <>
      <div className="atelier-page">
        <WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'powerful-questions')!} />
        <header className="atelier-header">
          <h1 className="atelier-title">Powerful Questions</h1>
          <p className="atelier-subtitle">
            {phase === 1
              ? "Phase 1 / 2 — Classez les 12 questions dans la bonne catégorie."
              : "Phase 2 / 2 — Associez chaque situation à l'intention de coaching appropriée."}
          </p>
        </header>

        {phase === 1 && (
          <>
            <div className="tki-columns">
              {QUESTION_CATEGORIES.map(cat => (
                <div
                  key={cat.id}
                  data-category={cat.id}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnQuestionColumn(cat.id)}
                >
                  <h3 className="tki-column__title">{cat.label}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{cat.description}</p>
                  <div className="tki-column__cards">
                    {questionZones[cat.id].map(qid => {
                      const q = QUESTIONS.find(x => x.id === qid)!
                      const resultClass = phase1Result !== null
                        ? phase1Result[q.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                        : ''
                      return (
                        <div
                          key={q.id}
                          data-question={q.id}
                          className={`tki-situation-card${resultClass}`}
                          draggable
                          onDragStart={() => handleQuestionDragStart(q.id, cat.id)}
                        >
                          {q.text}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {phase1Result && (
              <div className="scrum-score-banner">
                <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                  {phase1Score} / 12 correct{phase1Perfect ? ' — Parfait !' : ''}
                </span>
                {phase1Perfect && (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Tu sais reconnaître les principaux pièges : fermer trop vite, orienter la réponse ou chercher à résoudre à la place de l'autre.
                  </p>
                )}
              </div>
            )}

            <div
              className="tki-pool"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropOnQuestionPalette}
            >
              <p className="scrum-palette__title">Questions à classer</p>
              <div className="tki-pool__cards">
                {paletteQuestions.map(q => (
                  <div
                    key={q.id}
                    data-question={q.id}
                    className="tki-situation-card"
                    draggable
                    onDragStart={() => handleQuestionDragStart(q.id)}
                  >
                    {q.text}
                  </div>
                ))}
                {paletteQuestions.length === 0 && (
                  <span className="scrum-palette__empty">Toutes les questions ont été classées</span>
                )}
              </div>
            </div>

            <div className="scrum-actions">
              <button className="btn btn--primary" onClick={handleVerifyPhase1} disabled={!phase1AllPlaced}>
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
              {COACHING_INTENTS.map(intent => (
                <div
                  key={intent.id}
                  data-intent={intent.id}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnIntentColumn(intent.id)}
                >
                  <h3 className="tki-column__title">{intent.label}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{intent.description}</p>
                  <div className="tki-column__cards">
                    {situationZones[intent.id].map(sid => {
                      const s = SITUATIONS.find(x => x.id === sid)!
                      const resultClass = phase2Result !== null
                        ? phase2Result[s.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                        : ''
                      return (
                        <div
                          key={s.id}
                          data-situation={s.id}
                          className={`tki-situation-card${resultClass}`}
                          draggable
                          onDragStart={() => handleSituationDragStart(s.id, intent.id)}
                        >
                          <strong>{s.situation}</strong>
                          <br />
                          <em style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>→ {s.question}</em>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {phase2Result && (
              <div className="scrum-score-banner">
                <span className={`badge ${phase2Score === 15 ? 'badge--green' : 'badge--orange'}`}>
                  {phase2Score} / 15 correct{phase2Score === 15 ? ' — Maîtrisé !' : ''}
                </span>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {phase2Score === 15
                    ? "Tu sais adapter la question à l'intention : clarifier, explorer, responsabiliser, décider ou faire émerger une action."
                    : "À consolider : certaines questions sont pertinentes, mais l'intention de coaching doit être mieux distinguée."}
                </p>
              </div>
            )}

            <div
              className="tki-pool"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropOnSituationPool}
            >
              <p className="scrum-palette__title">Situations à classer</p>
              <div className="tki-pool__cards">
                {poolSituations.map(s => (
                  <div
                    key={s.id}
                    data-situation={s.id}
                    className="tki-situation-card"
                    draggable
                    onDragStart={() => handleSituationDragStart(s.id)}
                  >
                    <strong>{s.situation}</strong>
                    <br />
                    <em style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>→ {s.question}</em>
                  </div>
                ))}
                {poolSituations.length === 0 && (
                  <span className="scrum-palette__empty">Toutes les situations ont été classées</span>
                )}
              </div>
            </div>

            <div className="scrum-actions">
              <button className="btn btn--primary" onClick={handleVerifyPhase2} disabled={!phase2AllPlaced}>
                Vérifier
              </button>
              {phase2Result && (
                <button className="btn btn--secondary" onClick={handleResetPhase2}>Réessayer phase 2</button>
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
