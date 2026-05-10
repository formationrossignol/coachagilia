import { useState } from 'react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type QuestionFamily = 'miracle' | 'scale' | 'exception' | 'resource'
type CoachingIntent = 'future' | 'progress' | 'exception' | 'resource' | 'small-step'

const QUESTION_FAMILIES: { id: QuestionFamily; label: string; description: string }[] = [
  { id: 'miracle',   label: 'Question miracle',      description: 'Décrit un futur souhaité de manière concrète et observable.' },
  { id: 'scale',     label: "Question d'échelle",     description: 'Situe la progression actuelle et fait émerger un prochain cran réaliste.' },
  { id: 'exception', label: "Question d'exception",   description: 'Repère les moments où le problème est moins présent ou déjà partiellement résolu.' },
  { id: 'resource',  label: 'Question de ressources', description: 'Identifie les forces, appuis, compétences et leviers disponibles.' },
]

const COACHING_INTENTS: { id: CoachingIntent; label: string; description: string }[] = [
  { id: 'future',     label: 'Futur souhaité', description: "Rendre visible ce que l'on veut voir apparaître à la place du problème." },
  { id: 'progress',   label: 'Progression',    description: "Mesurer où l'équipe en est et rendre visibles les progrès déjà réalisés." },
  { id: 'exception',  label: 'Exceptions',     description: 'Identifier les moments où la difficulté est moins forte ou mieux gérée.' },
  { id: 'resource',   label: 'Ressources',     description: 'Mobiliser les forces, compétences et soutiens déjà disponibles.' },
  { id: 'small-step', label: 'Petit pas',      description: 'Transformer la réflexion en action simple, réaliste et observable.' },
]

type Question = { id: string; text: string; correctFamily: QuestionFamily }

const QUESTIONS: Question[] = [
  { id: 'q1',  text: "Si demain matin le problème était résolu, qu'est-ce que tu remarquerais en premier ?",                  correctFamily: 'miracle' },
  { id: 'q2',  text: "Qu'est-ce qui serait différent dans l'équipe si cette tension avait disparu ?",                         correctFamily: 'miracle' },
  { id: 'q3',  text: "À quoi verrait-on concrètement que le Sprint se passe mieux ?",                                         correctFamily: 'miracle' },
  { id: 'q4',  text: "Sur une échelle de 1 à 10, où en est l'équipe aujourd'hui sur ce sujet ?",                              correctFamily: 'scale' },
  { id: 'q5',  text: "Qu'est-ce qui ferait passer l'équipe de 4 à 5 ?",                                                       correctFamily: 'scale' },
  { id: 'q6',  text: "Qu'est-ce qui explique que vous n'êtes pas à 2, mais déjà à 4 ?",                                       correctFamily: 'scale' },
  { id: 'q7',  text: "Quand ce problème est-il moins présent dans l'équipe ?",                                                 correctFamily: 'exception' },
  { id: 'q8',  text: "Y a-t-il eu un Sprint récent où cela s'est mieux passé ? Qu'est-ce qui était différent ?",              correctFamily: 'exception' },
  { id: 'q9',  text: "Dans quelles situations l'équipe arrive-t-elle déjà à fonctionner malgré cette difficulté ?",            correctFamily: 'exception' },
  { id: 'q10', text: "Sur quelles forces de l'équipe pouvez-vous vous appuyer ?",                                              correctFamily: 'resource' },
  { id: 'q11', text: "Qui ou quoi pourrait vous aider à avancer d'un cran ?",                                                  correctFamily: 'resource' },
  { id: 'q12', text: "Qu'avez-vous déjà réussi dans le passé qui pourrait vous servir ici ?",                                  correctFamily: 'resource' },
]

type Situation = { id: string; situation: string; question: string; correctIntent: CoachingIntent }

const SITUATIONS: Situation[] = [
  { id: 's1',  situation: "L'équipe dit que \"la collaboration ne fonctionne pas\", mais reste très vague.",                                        question: "Si la collaboration fonctionnait vraiment mieux, qu'est-ce qu'on observerait concrètement dans vos échanges ?", correctIntent: 'future' },
  { id: 's2',  situation: "Le Product Owner veut une équipe \"plus autonome\", sans préciser ce que cela signifie.",                                 question: "À quoi verrait-on que l'équipe est devenue plus autonome ?",                                                     correctIntent: 'future' },
  { id: 's3',  situation: "La rétrospective commence par \"on veut moins de stress\", mais personne ne décrit le résultat attendu.",                  question: "Si le prochain Sprint était plus serein, qu'est-ce qui serait différent dès les premiers jours ?",              correctIntent: 'future' },
  { id: 's4',  situation: "L'équipe pense être très mauvaise sur la qualité, mais certains indicateurs sont déjà meilleurs qu'avant.",               question: "Sur une échelle de 1 à 10, où placeriez-vous votre niveau de qualité aujourd'hui ?",                            correctIntent: 'progress' },
  { id: 's5',  situation: "Le Daily Scrum a déjà été raccourci, mais l'équipe trouve encore qu'il n'est pas efficace.",                              question: "Qu'est-ce qui montre que vous avez déjà progressé, même légèrement ?",                                          correctIntent: 'progress' },
  { id: 's6',  situation: "Le Scrum Master veut aider l'équipe à sortir d'un jugement global du type \"rien ne marche\".",                           question: "Si 10 représente une situation idéale, où êtes-vous aujourd'hui, et pourquoi pas plus bas ?",                  correctIntent: 'progress' },
  { id: 's7',  situation: "L'équipe affirme que les dépendances bloquent toujours le Sprint.",                                                        question: "Y a-t-il eu un moment où une dépendance a été gérée plus facilement ? Qu'est-ce qui avait aidé ?",               correctIntent: 'exception' },
  { id: 's8',  situation: "Deux membres disent qu'ils n'arrivent jamais à travailler ensemble.",                                                       question: "Quand votre collaboration a-t-elle été un peu plus fluide, même brièvement ?",                                  correctIntent: 'exception' },
  { id: 's9',  situation: "Le Product Owner dit que les parties prenantes changent tout le temps d'avis.",                                            question: "Dans quelles situations les parties prenantes ont-elles réussi à stabiliser une décision ?",                    correctIntent: 'exception' },
  { id: 's10', situation: "L'équipe doute de sa capacité à améliorer son Definition of Done.",                                                        question: "Quelles compétences de l'équipe peuvent vous aider à renforcer votre Definition of Done ?",                      correctIntent: 'resource' },
  { id: 's11', situation: "Un nouveau Scrum Master rejoint une équipe qui a perdu confiance.",                                                         question: "Qu'est-ce que cette équipe a déjà réussi malgré les difficultés ?",                                              correctIntent: 'resource' },
  { id: 's12', situation: "Le Sprint Planning est difficile, mais l'équipe a une bonne connaissance fonctionnelle du produit.",                       question: "Sur quelle connaissance ou expérience pouvez-vous vous appuyer pour mieux préparer le prochain Sprint ?",         correctIntent: 'resource' },
  { id: 's13', situation: "La rétrospective fait émerger un sujet très vaste : \"améliorer la communication\".",                                      question: "Quel petit changement observable pourriez-vous tester dès cette semaine ?",                                        correctIntent: 'small-step' },
  { id: 's14', situation: "L'équipe veut réduire les interruptions, mais le problème semble trop large.",                                             question: "Quel serait le plus petit signe de progrès que vous pourriez provoquer dès demain ?",                              correctIntent: 'small-step' },
  { id: 's15', situation: "Un conflit avec une partie prenante semble trop complexe pour être résolu rapidement.",                                    question: "Quelle première conversation utile pourrait faire avancer la situation d'un cran ?",                              correctIntent: 'small-step' },
]

export function SolutionFocusedAtelier() {
  const { markComplete } = useWorkshopCompletion('solution-focused-coaching')
  const [phase, setPhase] = useState<1 | 2>(1)

  const [questionZones, setQuestionZones] = useState<Record<QuestionFamily, string[]>>({
    miracle: [], scale: [], exception: [], resource: [],
  })
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)

  const [situationZones, setSituationZones] = useState<Record<CoachingIntent, string[]>>({
    future: [], progress: [], exception: [], resource: [], 'small-step': [],
  })
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  const [dragging, setDragging] = useState<
    | { type: 'question'; id: string; fromFamily?: QuestionFamily }
    | { type: 'situation'; id: string; fromIntent?: CoachingIntent }
    | null
  >(null)

  const isDirty = phase > 1 || Object.values(questionZones).some(arr => arr.length > 0)
  const { showModal, confirm, cancel } = useExitGuard(isDirty)

  const placedQuestionIds = new Set(Object.values(questionZones).flat())
  const paletteQuestions = QUESTIONS.filter(q => !placedQuestionIds.has(q.id))
  const phase1AllPlaced = paletteQuestions.length === 0

  function handleQuestionDragStart(id: string, fromFamily?: QuestionFamily) {
    setDragging({ type: 'question', id, fromFamily })
    setPhase1Result(null)
  }

  function handleDropOnQuestionColumn(family: QuestionFamily) {
    if (!dragging || dragging.type !== 'question') return
    setQuestionZones(prev => {
      const next = { ...prev }
      if (dragging.fromFamily) {
        next[dragging.fromFamily] = next[dragging.fromFamily].filter(id => id !== dragging.id)
      }
      if (!next[family].includes(dragging.id)) next[family] = [...next[family], dragging.id]
      return next
    })
    setDragging(null)
  }

  function handleDropOnQuestionPalette() {
    if (!dragging || dragging.type !== 'question' || !dragging.fromFamily) { setDragging(null); return }
    setQuestionZones(prev => ({
      ...prev,
      [dragging.fromFamily!]: prev[dragging.fromFamily!].filter(id => id !== dragging.id),
    }))
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const q of QUESTIONS) {
      const family = (Object.entries(questionZones) as [QuestionFamily, string[]][])
        .find(([, ids]) => ids.includes(q.id))?.[0]
      result[q.id] = family === q.correctFamily
    }
    setPhase1Result(result)
  }

  function handleResetPhase1() {
    setQuestionZones({ miracle: [], scale: [], exception: [], resource: [] })
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
    setSituationZones({ future: [], progress: [], exception: [], resource: [], 'small-step': [] })
    setPhase2Result(null)
  }

  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  return (
    <>
      <div className="atelier-page">
        <WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'solution-focused-coaching')!} />
        <header className="atelier-header">
          <h1 className="atelier-title">Solution Focused Coaching</h1>
          <p className="atelier-subtitle">
            {phase === 1
              ? "Phase 1 / 2 — Classez les 12 questions dans la bonne famille Solution Focused."
              : "Phase 2 / 2 — Associez chaque situation à l'intention de coaching appropriée."}
          </p>
        </header>

        {phase === 1 && (
          <>
            <div className="tki-columns">
              {QUESTION_FAMILIES.map(fam => (
                <div
                  key={fam.id}
                  data-category={fam.id}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnQuestionColumn(fam.id)}
                >
                  <h3 className="tki-column__title">{fam.label}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{fam.description}</p>
                  <div className="tki-column__cards">
                    {questionZones[fam.id].map(qid => {
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
                          onDragStart={() => handleQuestionDragStart(q.id, fam.id)}
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
                    Tu sais reconnaître les grandes familles de questions Solution Focused : miracle, échelle, exception et ressources.
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
                    ? "Tu sais orienter une conversation vers les solutions, les ressources et le prochain pas utile."
                    : "À consolider : certaines questions sont proches, mais l'intention Solution Focused doit être mieux distinguée."}
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
