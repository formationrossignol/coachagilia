import type { ClassificationDataset } from '../types'

export const sailboatRetrospectiveDataset: ClassificationDataset = {
  zones: [
    { id: 'wind',   label: 'Vent',            description: "Ce qui pousse l'équipe vers l'avant : forces, pratiques utiles, facteurs d'accélération." },
    { id: 'anchor', label: 'Ancre',           description: "Ce qui ralentit l'équipe aujourd'hui : blocages, irritants, dépendances ou lourdeurs." },
    { id: 'rocks',  label: 'Récif / rochers', description: "Ce qui pourrait mettre l'équipe en difficulté : risques, menaces ou obstacles à venir." },
    { id: 'island', label: 'Île',             description: "La destination : objectif, résultat attendu ou amélioration visée." },
    { id: 'sun',    label: 'Soleil',          description: "Ce qui donne de l'énergie : motivation, satisfaction, fierté ou signaux positifs." },
  ],
  cards: [
    { id: 's1',  text: "Depuis deux Sprints, l'équipe découpe mieux les User Stories et termine plus régulièrement ce qu'elle démarre.",     expectedZone: 'wind' },
    { id: 's2',  text: "Le Product Owner est plus disponible pendant le Sprint, ce qui réduit les temps d'attente.",                        expectedZone: 'wind' },
    { id: 's3',  text: "Les développeurs commencent à s'entraider spontanément sur les sujets complexes.",                                  expectedZone: 'wind' },
    { id: 's4',  text: "L'équipe perd beaucoup de temps à attendre des validations externes.",                                               expectedZone: 'anchor' },
    { id: 's5',  text: "Les changements de priorité en cours de Sprint créent de la confusion.",                                             expectedZone: 'anchor' },
    { id: 's6',  text: "Les environnements de test sont instables et ralentissent les validations.",                                         expectedZone: 'anchor' },
    { id: 's7',  text: "Une mise en production importante approche, mais la stratégie de rollback n'est pas claire.",                        expectedZone: 'rocks' },
    { id: 's8',  text: "Un expert clé part en congés pendant une période critique.",                                                         expectedZone: 'rocks' },
    { id: 's9',  text: "Une dette technique connue pourrait rendre la prochaine évolution très coûteuse.",                                   expectedZone: 'rocks' },
    { id: 's10', text: "L'équipe veut que le prochain Sprint permette de livrer une version utilisable par un groupe pilote.",                expectedZone: 'island' },
    { id: 's11', text: "Le Product Owner souhaite réduire le temps de traitement d'une demande client de 5 jours à 2 jours.",                expectedZone: 'island' },
    { id: 's12', text: "L'équipe se donne comme objectif de stabiliser le parcours d'inscription avant la prochaine démonstration.",         expectedZone: 'island' },
    { id: 's13', text: "L'équipe se sent plus confiante depuis que les démonstrations se passent mieux.",                                    expectedZone: 'sun' },
    { id: 's14', text: "Un retour utilisateur positif a renforcé la motivation de l'équipe.",                                                expectedZone: 'sun' },
    { id: 's15', text: "La résolution collective d'un incident a créé un vrai sentiment de fierté.",                                         expectedZone: 'sun' },
  ],
}
