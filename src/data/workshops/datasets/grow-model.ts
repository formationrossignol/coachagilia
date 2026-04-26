import type { ClassificationDataset } from '../types'

export const growDataset: ClassificationDataset = {
  zones: [
    { id: 'goal',    label: 'Goal',    description: "Clarifier l'objectif" },
    { id: 'reality', label: 'Reality', description: 'Explorer la situation actuelle' },
    { id: 'options', label: 'Options', description: 'Identifier les possibilités' },
    { id: 'will',    label: 'Will',    description: "Définir l'engagement" },
  ],
  cards: [
    { id: 'g1', text: "Quel est l'objectif que tu veux atteindre ?",               expectedZone: 'goal' },
    { id: 'g2', text: 'À quoi ressemblerait un résultat réussi ?',                  expectedZone: 'goal' },
    { id: 'r1', text: "Où en es-tu aujourd'hui ?",                                 expectedZone: 'reality' },
    { id: 'r2', text: "Qu'as-tu déjà essayé ?",                                   expectedZone: 'reality' },
    { id: 'o1', text: 'Quelles options vois-tu ?',                                  expectedZone: 'options' },
    { id: 'o2', text: "Que pourrais-tu essayer d'autre ?",                         expectedZone: 'options' },
    { id: 'w1', text: 'Quelle est ta prochaine action concrète ?',                  expectedZone: 'will' },
    { id: 'w2', text: 'Quand vas-tu le faire ?',                                    expectedZone: 'will' },
  ],
}
