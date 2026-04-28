import type { ClassificationDataset } from '../types'

export const cynefinFrameworkDataset: ClassificationDataset = {
  zones: [
    { id: 'clear',       label: 'Clear (Obvious)', description: 'Relation cause-effet évidente, best practices applicables' },
    { id: 'complicated', label: 'Complicated',     description: "L'expertise permet d'analyser et de recommander" },
    { id: 'complex',     label: 'Complex',         description: "L'émergence domine, expérimentation nécessaire" },
    { id: 'chaotic',     label: 'Chaotic',         description: 'Urgence absolue, action immédiate requise' },
    { id: 'disorder',    label: 'Disorder',        description: 'Domaine non identifié, diagnostic nécessaire' },
  ],
  cards: [
    { id: 'cl1', text: 'Une procédure standard de déploiement doit être appliquée sans variation.',                                               expectedZone: 'clear' },
    { id: 'cl2', text: 'Le respect de la Definition of Done suit une règle claire connue de tous.',                                               expectedZone: 'clear' },
    { id: 'cl3', text: 'Une checklist de release validée doit être exécutée.',                                                                    expectedZone: 'clear' },
    { id: 'co1', text: "Une architecture technique complexe nécessite l'avis d'un expert senior.",                                                expectedZone: 'complicated' },
    { id: 'co2', text: 'Une analyse de performance demande une investigation approfondie.',                                                        expectedZone: 'complicated' },
    { id: 'co3', text: 'Le choix entre deux solutions cloud nécessite une expertise technique.',                                                   expectedZone: 'complicated' },
    { id: 'cx1', text: 'Une nouvelle organisation produit doit être testée sans certitude sur le meilleur modèle.',                               expectedZone: 'complex' },
    { id: 'cx2', text: "L'équipe veut améliorer la collaboration mais les causes sont multiples et mouvantes.",                                   expectedZone: 'complex' },
    { id: 'cx3', text: "Une transformation agile est lancée dans un environnement politique instable.",                                           expectedZone: 'complex' },
    { id: 'ch1', text: 'Une production critique tombe pendant une démonstration client majeure.',                                                 expectedZone: 'chaotic' },
    { id: 'ch2', text: 'Une faille de sécurité impose une réaction immédiate.',                                                                   expectedZone: 'chaotic' },
    { id: 'ch3', text: 'Une crise majeure bloque totalement la livraison.',                                                                       expectedZone: 'chaotic' },
    { id: 'd1',  text: "L'équipe sait qu'un problème existe mais ne comprend pas encore sa nature.",                                              expectedZone: 'disorder' },
    { id: 'd2',  text: "Plusieurs signaux faibles apparaissent sans qu'on sache s'il s'agit d'un problème process, humain ou technique.",         expectedZone: 'disorder' },
    { id: 'd3',  text: 'Un conflit récurrent persiste sans diagnostic clair.',                                                                    expectedZone: 'disorder' },
  ],
}
