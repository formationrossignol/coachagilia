import type { ClassificationDataset } from '../types'

export const ishikawaDataset: ClassificationDataset = {
  zones: [
    { id: 'people',      label: 'People',      description: 'Compétences, comportements, communication' },
    { id: 'process',     label: 'Process',     description: 'Méthodes, procédures, flux de travail' },
    { id: 'tools',       label: 'Tools',       description: 'Outils, technologies, infrastructure' },
    { id: 'product',     label: 'Product',     description: 'Exigences, périmètre, définition' },
    { id: 'environment', label: 'Environment', description: 'Contexte externe, contraintes, dépendances' },
    { id: 'management',  label: 'Management',  description: 'Décisions, priorités, organisation' },
  ],
  cards: [
    { id: 'c1',  text: 'Manque de communication entre développeurs',                            expectedZone: 'people' },
    { id: 'c2',  text: 'Développeurs peu familiers avec le domaine métier',                     expectedZone: 'people' },
    { id: 'c3',  text: 'Absence de rituel de partage des connaissances',                        expectedZone: 'people' },
    { id: 'c4',  text: 'Processus de refinement insuffisant',                                   expectedZone: 'process' },
    { id: 'c5',  text: "Absence de critères d'acceptation systématiques",                       expectedZone: 'process' },
    { id: 'c6',  text: 'Revues de code trop rares',                                             expectedZone: 'process' },
    { id: 'c7',  text: 'Outils de build instables',                                             expectedZone: 'tools' },
    { id: 'c8',  text: 'Environnements de test non représentatifs de la prod',                  expectedZone: 'tools' },
    { id: 'c9',  text: 'Absence de monitoring en production',                                   expectedZone: 'tools' },
    { id: 'c10', text: 'User Stories mal définies',                                             expectedZone: 'product' },
    { id: 'c11', text: 'Périmètre changeant en cours de Sprint',                                expectedZone: 'product' },
    { id: 'c12', text: 'Critères de succès non définis',                                        expectedZone: 'product' },
    { id: 'c13', text: 'Dépendances externes bloquantes',                                       expectedZone: 'environment' },
    { id: 'c14', text: 'Contraintes réglementaires non anticipées',                             expectedZone: 'environment' },
    { id: 'c15', text: 'Environnement de travail bruyant et source de distraction',             expectedZone: 'environment' },
    { id: 'c16', text: 'Priorités changeant constamment',                                       expectedZone: 'management' },
    { id: 'c17', text: "Absence de Product Owner disponible",                                   expectedZone: 'management' },
    { id: 'c18', text: 'Pression sur les délais sans ajustement du périmètre',                  expectedZone: 'management' },
  ],
}
