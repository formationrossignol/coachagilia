import type { ClassificationDataset } from '../types'

export const radicalCandorDataset: ClassificationDataset = {
  zones: [
    { id: 'radical-candor',           label: 'Radical Candor',           description: 'Feedback clair, spécifique, utile et humain.' },
    { id: 'ruinous-empathy',          label: 'Ruinous Empathy',          description: 'Évitement du feedback difficile par peur de blesser.' },
    { id: 'obnoxious-aggression',     label: 'Obnoxious Aggression',     description: 'Feedback direct mais dur, humiliant ou peu respectueux.' },
    { id: 'manipulative-insincerity', label: 'Manipulative Insincerity', description: 'Feedback évité, indirect, politique ou non sincère.' },
    { id: 'towards-radical-candor',   label: 'Vers Radical Candor',      description: "Reformulation d'un feedback faible, brutal ou ambigu en feedback clair et aidant." },
  ],
  cards: [
    { id: 's1',  text: 'Un développeur livre régulièrement du code non conforme à la Definition of Done.',                                                          expectedZone: 'radical-candor' },
    { id: 's2',  text: 'Le Scrum Master monopolise souvent la parole en rétrospective.',                                                                            expectedZone: 'radical-candor' },
    { id: 's3',  text: 'Le Product Owner arrive souvent en Sprint Planning avec des User Stories insuffisamment préparées.',                                         expectedZone: 'radical-candor' },
    { id: 's4',  text: 'Un membre perturbe régulièrement les Daily Scrums, mais le Scrum Master ne dit rien pour ne pas le vexer.',                                 expectedZone: 'ruinous-empathy' },
    { id: 's5',  text: "Le PO sait qu'une User Story est mal rédigée, mais la laisse passer pour ne pas mettre le Business Analyst en difficulté.",                 expectedZone: 'ruinous-empathy' },
    { id: 's6',  text: "Un manager donne un feedback très vague : \"C'est bien, continue\", alors que la prestation n'est pas au niveau attendu.",                   expectedZone: 'ruinous-empathy' },
    { id: 's7',  text: "Un lead technique dit en réunion : \"Cette solution est mauvaise, tu n'as clairement pas réfléchi.\"",                                       expectedZone: 'obnoxious-aggression' },
    { id: 's8',  text: "Un Scrum Master humilie un membre devant l'équipe parce qu'il n'a pas terminé sa tâche.",                                                   expectedZone: 'obnoxious-aggression' },
    { id: 's9',  text: 'Un manager corrige publiquement une erreur avec un ton sarcastique.',                                                                        expectedZone: 'obnoxious-aggression' },
    { id: 's10', text: 'Un collègue dit en face que tout va bien, puis critique fortement la personne en dehors de la réunion.',                                     expectedZone: 'manipulative-insincerity' },
    { id: 's11', text: 'Un manager évite un feedback difficile pour préserver son image de "manager sympa".',                                                        expectedZone: 'manipulative-insincerity' },
    { id: 's12', text: 'Un membre valide une décision en réunion, puis cherche discrètement à la saboter.',                                                         expectedZone: 'manipulative-insincerity' },
    { id: 's13', text: "Au lieu de dire \"Tu n'es pas assez rigoureux\", le Scrum Master reformule en observation précise.",                                         expectedZone: 'towards-radical-candor' },
    { id: 's14', text: "Au lieu d'éviter un feedback sur une facilitation confuse, un pair propose une aide concrète.",                                              expectedZone: 'towards-radical-candor' },
    { id: 's15', text: 'Au lieu de critiquer un développeur en public, le lead technique choisit un feedback direct en privé.',                                     expectedZone: 'towards-radical-candor' },
  ],
}
