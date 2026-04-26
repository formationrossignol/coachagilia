import type { ClassificationDataset } from '../types'

export const trizDataset: ClassificationDataset = {
  zones: [
    { id: 'communication', label: 'Communication',       description: 'Échanges, écoute, feedback' },
    { id: 'organization',  label: 'Organisation',        description: 'Réunions, rôles, priorités' },
    { id: 'quality',       label: 'Qualité',             description: 'Standards, tests, dette technique' },
    { id: 'collaboration', label: 'Collaboration',       description: "Travail d'équipe, entraide, décisions" },
    { id: 'leadership',    label: 'Leadership / posture', description: 'Décisions, conflits, remise en question' },
  ],
  cards: [
    { id: 'b1',  text: 'Ne jamais écouter les autres',                         expectedZone: 'communication' },
    { id: 'b2',  text: 'Couper la parole en permanence',                       expectedZone: 'communication' },
    { id: 'b3',  text: 'Ignorer les feedbacks',                                expectedZone: 'communication' },
    { id: 'b4',  text: 'Ne jamais préparer les réunions',                      expectedZone: 'organization' },
    { id: 'b5',  text: 'Changer les priorités constamment',                    expectedZone: 'organization' },
    { id: 'b6',  text: 'Ne pas clarifier les rôles',                           expectedZone: 'organization' },
    { id: 'b7',  text: 'Ignorer la Definition of Done',                        expectedZone: 'quality' },
    { id: 'b8',  text: 'Livrer du code non testé',                             expectedZone: 'quality' },
    { id: 'b9',  text: 'Accumuler volontairement de la dette technique',       expectedZone: 'quality' },
    { id: 'b10', text: 'Travailler en silo',                                   expectedZone: 'collaboration' },
    { id: 'b11', text: 'Refuser toute aide',                                   expectedZone: 'collaboration' },
    { id: 'b12', text: 'Critiquer sans proposer de solution',                  expectedZone: 'collaboration' },
    { id: 'b13', text: 'Imposer toutes les décisions',                         expectedZone: 'leadership' },
    { id: 'b14', text: 'Éviter les conflits importants',                       expectedZone: 'leadership' },
    { id: 'b15', text: 'Ne jamais remettre en question les pratiques',         expectedZone: 'leadership' },
  ],
}
