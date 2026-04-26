import type { ClassificationDataset } from '../types'

export const conflictDataset: ClassificationDataset = {
  zones: [
    { id: 'competition',    label: 'Compétition',    description: 'Assertif, non coopératif — imposer sa position' },
    { id: 'collaboration',  label: 'Collaboration',  description: "Assertif et coopératif — trouver une solution gagnant-gagnant" },
    { id: 'compromise',     label: 'Compromis',      description: "Modérément assertif et coopératif — trouver un terrain d'entente" },
    { id: 'avoidance',      label: 'Évitement',      description: 'Non assertif, non coopératif — ne pas traiter le conflit' },
    { id: 'accommodation',  label: 'Accommodation',  description: "Non assertif, coopératif — céder à l'autre" },
  ],
  cards: [
    { id: 's1',  text: "Un membre pousse une solution non conforme à la DoD — le SM tranche pour protéger la qualité.",           expectedZone: 'competition' },
    { id: 's2',  text: "Une livraison est bloquée par un désaccord de dernière minute — une décision rapide s'impose.",            expectedZone: 'competition' },
    { id: 's3',  text: "Un développeur refuse systématiquement les revues de code — le SM pose une limite ferme.",                 expectedZone: 'competition' },
    { id: 's4',  text: "Deux développeurs ont des visions opposées sur l'architecture — le SM facilite une co-conception.",       expectedZone: 'collaboration' },
    { id: 's5',  text: "Une tension récurrente dégrade l'atmosphère — le SM organise un dialogue structuré.",                     expectedZone: 'collaboration' },
    { id: 's6',  text: "L'équipe ne s'accorde pas sur la Definition of Done — le SM anime un atelier.",                          expectedZone: 'collaboration' },
    { id: 's7',  text: "Le PO et l'équipe ne s'accordent pas sur deux US de même valeur — on négocie un ordre acceptable.",      expectedZone: 'compromise' },
    { id: 's8',  text: "L'équipe est divisée sur la durée du Sprint — on convient d'un essai réévalué en rétro.",                expectedZone: 'compromise' },
    { id: 's9',  text: "Les ressources ne permettent pas de tout traiter — on réduit le périmètre de manière équilibrée.",       expectedZone: 'compromise' },
    { id: 's10', text: "Une légère irritation sur un outil, sans impact — le SM laisse passer.",                                  expectedZone: 'avoidance' },
    { id: 's11', text: "Une friction ponctuelle en fin de Sprint surchargé — le SM note pour la rétro.",                         expectedZone: 'avoidance' },
    { id: 's12', text: "Un désaccord mineur sur le format des notes de standup — le SM ne prend pas position.",                  expectedZone: 'avoidance' },
    { id: 's13', text: "Un senior propose une approche différente avec une expertise reconnue — le SM cède et soutient.",        expectedZone: 'accommodation' },
    { id: 's14', text: "Un stakeholder demande un ajustement raisonnable en Sprint Review — le SM accepte.",                     expectedZone: 'accommodation' },
    { id: 's15', text: "Un membre demande de changer l'heure du Daily pour des raisons personnelles — le SM accommode.",        expectedZone: 'accommodation' },
  ],
}
