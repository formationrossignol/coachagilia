import type { ClassificationDataset } from '../types'

export const powerfulQuestionsDataset: ClassificationDataset = {
  zones: [
    { id: 'closed',   label: 'Question fermée',  description: "Réponse courte, souvent oui/non, peu d'exploration." },
    { id: 'leading',  label: 'Question orientée', description: 'La question contient déjà une hypothèse ou pousse vers une réponse.' },
    { id: 'powerful', label: 'Powerful Question', description: "Question ouverte qui clarifie, responsabilise ou ouvre l'action." },
  ],
  cards: [
    { id: 'q1',  text: 'Est-ce que tu as compris ce qui est attendu ?',                                         expectedZone: 'closed' },
    { id: 'q2',  text: 'Tu penses pouvoir finir cette User Story avant vendredi ?',                             expectedZone: 'closed' },
    { id: 'q3',  text: 'Est-ce que le problème vient du Product Owner ?',                                       expectedZone: 'closed' },
    { id: 'q4',  text: "Vous êtes d'accord avec cette solution ?",                                              expectedZone: 'closed' },
    { id: 'q5',  text: "Tu ne crois pas qu'il faudrait plutôt réduire le périmètre ?",                         expectedZone: 'leading' },
    { id: 'q6',  text: "Pourquoi vous n'avez pas anticipé cette dépendance ?",                                  expectedZone: 'leading' },
    { id: 'q7',  text: "Tu ne penses pas que le Daily est trop long parce que l'équipe manque de discipline ?", expectedZone: 'leading' },
    { id: 'q8',  text: 'Est-ce que la bonne solution ne serait pas de reprendre le backlog à zéro ?',           expectedZone: 'leading' },
    { id: 'q9',  text: 'Qu\'est-ce qui te manque pour avancer sereinement ?',                              expectedZone: 'powerful' },
    { id: 'q10', text: "Qu'est-ce qui rend cette décision difficile pour l'équipe ?",                           expectedZone: 'powerful' },
    { id: 'q11', text: 'Quelle option créerait le plus de valeur avec le moins de risque ?',                    expectedZone: 'powerful' },
    { id: 'q12', text: "Qu'est-ce que l'équipe pourrait expérimenter dès le prochain Sprint ?",                 expectedZone: 'powerful' },
  ],
}
