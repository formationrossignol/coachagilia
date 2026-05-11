import type { ClassificationDataset } from '../types'

export const sixHatsDataset: ClassificationDataset = {
  zones: [
    { id: 'white',  label: 'Chapeau blanc',  description: 'Données, faits, informations disponibles, informations manquantes.' },
    { id: 'red',    label: 'Chapeau rouge',  description: 'Émotions, intuitions, ressentis, signaux faibles.' },
    { id: 'black',  label: 'Chapeau noir',   description: 'Risques, limites, objections, points de vigilance.' },
    { id: 'yellow', label: 'Chapeau jaune',  description: "Bénéfices, valeur, opportunités, raisons d'y croire." },
    { id: 'green',  label: 'Chapeau vert',   description: 'Créativité, alternatives, options nouvelles, hypothèses.' },
    { id: 'blue',   label: 'Chapeau bleu',   description: 'Animation, méthode, séquence, synthèse, décision et prochaines étapes.' },
  ],
  cards: [
    { id: 'c1',  text: 'Nous avons 12 anomalies ouvertes sur cette release.',                                   expectedZone: 'white' },
    { id: 'c2',  text: "Il nous manque les chiffres d'usage de la dernière version.",                            expectedZone: 'white' },
    { id: 'c3',  text: "J'ai un mauvais pressentiment sur cette livraison.",                                     expectedZone: 'red' },
    { id: 'c4',  text: "Je sens que l'équipe est fatiguée et moins confiante.",                                  expectedZone: 'red' },
    { id: 'c5',  text: "Cette solution risque d'augmenter la dette technique.",                                  expectedZone: 'black' },
    { id: 'c6',  text: "Si cette dépendance n'est pas levée, le Sprint Goal sera compromis.",                    expectedZone: 'black' },
    { id: 'c7',  text: 'Cette option pourrait réduire fortement le délai de traitement utilisateur.',            expectedZone: 'yellow' },
    { id: 'c8',  text: 'Ce choix peut améliorer la lisibilité du parcours client.',                             expectedZone: 'yellow' },
    { id: 'c9',  text: 'Et si on testait une version simplifiée en feature flag ?',                             expectedZone: 'green' },
    { id: 'c10', text: "On pourrait imaginer trois alternatives au lieu d'opposer seulement deux options.",      expectedZone: 'green' },
    { id: 'c11', text: "Commençons par les faits, puis passons aux risques et aux options.",                     expectedZone: 'blue' },
    { id: 'c12', text: "Je reformule la décision et les prochaines étapes avant de clôturer.",                  expectedZone: 'blue' },
  ],
}
