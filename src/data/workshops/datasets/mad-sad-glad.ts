import type { ClassificationDataset } from '../types'

export const madSadGladDataset: ClassificationDataset = {
  zones: [
    { id: 'mad',  label: 'Mad',  description: 'Colère, irritation, injustice, tension ou frustration forte.' },
    { id: 'sad',  label: 'Sad',  description: "Déception, regret, perte d'énergie, tristesse ou démotivation." },
    { id: 'glad', label: 'Glad', description: 'Satisfaction, fierté, gratitude, confiance ou motivation.' },
  ],
  cards: [
    { id: 's1',  text: "Une User Story est ajoutée en urgence au milieu du Sprint sans discussion avec l'équipe.",                                        expectedZone: 'mad' },
    { id: 's2',  text: "L'équipe reçoit un reproche sur une livraison bloquée par une dépendance qu'elle avait signalée depuis deux semaines.",          expectedZone: 'mad' },
    { id: 's3',  text: "Une décision technique est imposée en dehors de l'équipe, sans explication claire.",                                              expectedZone: 'mad' },
    { id: 's4',  text: "Plusieurs interruptions externes empêchent l'équipe de terminer les items engagés.",                                              expectedZone: 'mad' },
    { id: 's5',  text: "Un membre de l'équipe coupe régulièrement la parole pendant les échanges.",                                                       expectedZone: 'mad' },
    { id: 's6',  text: "L'équipe n'a pas réussi à atteindre le Sprint Goal malgré un effort important.",                                                 expectedZone: 'sad' },
    { id: 's7',  text: "Un nouveau membre est resté isolé pendant le Sprint, faute d'accompagnement suffisant.",                                          expectedZone: 'sad' },
    { id: 's8',  text: "La Sprint Review attire peu de participants et génère peu de retours.",                                                             expectedZone: 'sad' },
    { id: 's9',  text: "Une amélioration décidée en rétrospective précédente n'a pas été suivie.",                                                        expectedZone: 'sad' },
    { id: 's10', text: "L'équipe constate que la dette technique augmente encore, sans temps dédié pour la traiter.",                                     expectedZone: 'sad' },
    { id: 's11', text: "Le Product Owner a clarifié rapidement plusieurs ambiguïtés pendant le Sprint.",                                                   expectedZone: 'glad' },
    { id: 's12', text: "Deux développeurs ont spontanément travaillé ensemble pour débloquer une anomalie complexe.",                                      expectedZone: 'glad' },
    { id: 's13', text: "La démonstration a reçu un retour utilisateur très positif.",                                                                      expectedZone: 'glad' },
    { id: 's14', text: "L'équipe a osé réduire le périmètre pour préserver la qualité.",                                                                  expectedZone: 'glad' },
    { id: 's15', text: "Un incident a été traité collectivement, sans recherche de coupable.",                                                             expectedZone: 'glad' },
  ],
}
