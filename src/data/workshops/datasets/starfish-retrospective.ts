import type { ClassificationDataset } from '../types'

export const starfishRetrospectiveDataset: ClassificationDataset = {
  zones: [
    { id: 'more-of', label: 'More of', description: 'Ce qui fonctionne déjà et devrait être fait davantage.' },
    { id: 'less-of', label: 'Less of', description: 'Ce qui peut rester utile, mais doit être réduit ou allégé.' },
    { id: 'start',   label: 'Start',   description: "Ce que l'équipe devrait commencer à tester ou mettre en place." },
    { id: 'stop',    label: 'Stop',    description: "Ce qui nuit clairement à l'équipe et devrait être arrêté." },
    { id: 'keep',    label: 'Keep',    description: 'Ce qui fonctionne bien et doit être conservé.' },
  ],
  cards: [
    { id: 's1',  text: "Les ateliers de refinement avec exemples concrets ont fortement amélioré la compréhension des User Stories.", expectedZone: 'more-of' },
    { id: 's2',  text: "Les binômes ponctuels ont permis de résoudre plus vite les sujets techniques difficiles.",                  expectedZone: 'more-of' },
    { id: 's3',  text: "Les échanges informels avec les utilisateurs ont apporté des retours très utiles.",                          expectedZone: 'more-of' },
    { id: 's4',  text: "Les réunions d'alignement sont parfois utiles, mais elles deviennent trop nombreuses.",                     expectedZone: 'less-of' },
    { id: 's5',  text: "Les discussions techniques sont nécessaires, mais elles prennent souvent toute la rétrospective.",           expectedZone: 'less-of' },
    { id: 's6',  text: "Les ajustements de priorité sont parfois justifiés, mais leur fréquence perturbe le Sprint.",               expectedZone: 'less-of' },
    { id: 's7',  text: "L'équipe découvre trop tard certaines dépendances avec d'autres équipes.",                                  expectedZone: 'start' },
    { id: 's8',  text: "Les critères d'acceptation sont souvent clarifiés seulement après le démarrage du développement.",          expectedZone: 'start' },
    { id: 's9',  text: "Les actions de rétrospective sont oubliées après quelques jours.",                                          expectedZone: 'start' },
    { id: 's10', text: "L'équipe commence régulièrement de nouvelles tâches alors que plusieurs items sont presque terminés.",       expectedZone: 'stop' },
    { id: 's11', text: "Des anomalies connues sont ignorées pour afficher artificiellement une story comme terminée.",               expectedZone: 'stop' },
    { id: 's12', text: "Les décisions prises en réunion sont remises en cause hors réunion sans transparence.",                     expectedZone: 'stop' },
    { id: 's13', text: "La Sprint Review est courte, concrète et centrée sur les retours utilisateurs.",                            expectedZone: 'keep' },
    { id: 's14', text: "Le Daily Scrum reste focalisé sur l'objectif de Sprint plutôt que sur un reporting individuel.",             expectedZone: 'keep' },
    { id: 's15', text: "L'équipe prend le temps de célébrer les apprentissages importants, même quand tout n'a pas fonctionné.",     expectedZone: 'keep' },
  ],
}
