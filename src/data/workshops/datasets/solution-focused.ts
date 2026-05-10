import type { ClassificationDataset } from '../types'

export const solutionFocusedDataset: ClassificationDataset = {
  zones: [
    { id: 'miracle',   label: 'Question miracle',      description: 'Décrit un futur souhaité de manière concrète et observable.' },
    { id: 'scale',     label: "Question d'échelle",     description: 'Situe la progression actuelle et fait émerger un prochain cran réaliste.' },
    { id: 'exception', label: "Question d'exception",   description: 'Repère les moments où le problème est moins présent ou déjà partiellement résolu.' },
    { id: 'resource',  label: 'Question de ressources', description: 'Identifie les forces, appuis, compétences et leviers disponibles.' },
  ],
  cards: [
    { id: 'q1',  text: "Si demain matin le problème était résolu, qu'est-ce que tu remarquerais en premier ?",                  expectedZone: 'miracle' },
    { id: 'q2',  text: "Qu'est-ce qui serait différent dans l'équipe si cette tension avait disparu ?",                         expectedZone: 'miracle' },
    { id: 'q3',  text: "À quoi verrait-on concrètement que le Sprint se passe mieux ?",                                         expectedZone: 'miracle' },
    { id: 'q4',  text: "Sur une échelle de 1 à 10, où en est l'équipe aujourd'hui sur ce sujet ?",                              expectedZone: 'scale' },
    { id: 'q5',  text: "Qu'est-ce qui ferait passer l'équipe de 4 à 5 ?",                                                       expectedZone: 'scale' },
    { id: 'q6',  text: "Qu'est-ce qui explique que vous n'êtes pas à 2, mais déjà à 4 ?",                                       expectedZone: 'scale' },
    { id: 'q7',  text: "Quand ce problème est-il moins présent dans l'équipe ?",                                                 expectedZone: 'exception' },
    { id: 'q8',  text: "Y a-t-il eu un Sprint récent où cela s'est mieux passé ? Qu'est-ce qui était différent ?",              expectedZone: 'exception' },
    { id: 'q9',  text: "Dans quelles situations l'équipe arrive-t-elle déjà à fonctionner malgré cette difficulté ?",            expectedZone: 'exception' },
    { id: 'q10', text: "Sur quelles forces de l'équipe pouvez-vous vous appuyer ?",                                              expectedZone: 'resource' },
    { id: 'q11', text: "Qui ou quoi pourrait vous aider à avancer d'un cran ?",                                                  expectedZone: 'resource' },
    { id: 'q12', text: "Qu'avez-vous déjà réussi dans le passé qui pourrait vous servir ici ?",                                  expectedZone: 'resource' },
  ],
}
