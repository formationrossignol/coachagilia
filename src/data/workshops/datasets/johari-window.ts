import type { ClassificationDataset } from '../types'

export const johariWindowDataset: ClassificationDataset = {
  zones: [
    { id: 'open',    label: 'Zone ouverte',  description: 'Ce que je connais de moi et que les autres connaissent aussi.' },
    { id: 'blind',   label: 'Zone aveugle',  description: 'Ce que les autres perçoivent de moi, mais que je ne vois pas clairement.' },
    { id: 'hidden',  label: 'Zone cachée',   description: 'Ce que je connais de moi, mais que je ne partage pas avec les autres.' },
    { id: 'unknown', label: 'Zone inconnue', description: "Ce qui n'est encore connu ni de moi, ni des autres." },
  ],
  cards: [
    { id: 'z1',  text: "Je sais que je suis à l'aise pour faciliter les rétrospectives, et l'équipe me le reconnaît.",            expectedZone: 'open' },
    { id: 'z2',  text: "Je connais mon rôle dans l'équipe et les autres savent sur quoi ils peuvent me solliciter.",               expectedZone: 'open' },
    { id: 'z3',  text: "Je dis clairement que j'ai besoin de temps pour préparer les ateliers, et l'équipe en tient compte.",     expectedZone: 'open' },
    { id: 'z4',  text: "L'équipe me trouve parfois trop direct en réunion, mais je ne m'en rends pas compte.",                    expectedZone: 'blind' },
    { id: 'z5',  text: "Les autres voient que je coupe souvent la parole, alors que je pense simplement accélérer la discussion.", expectedZone: 'blind' },
    { id: 'z6',  text: "Je crois être disponible, mais plusieurs personnes hésitent à venir me voir.",                            expectedZone: 'blind' },
    { id: 'z7',  text: "Je suis inquiet sur ma capacité à tenir mon rôle, mais je ne l'ai pas exprimé.",                         expectedZone: 'hidden' },
    { id: 'z8',  text: "Je sais que je ne comprends pas bien un sujet technique, mais je fais comme si tout allait bien.",        expectedZone: 'hidden' },
    { id: 'z9',  text: "Je suis frustré par certaines décisions, mais je garde cela pour moi.",                                   expectedZone: 'hidden' },
    { id: 'z10', text: "Je n'ai jamais été confronté à une crise projet majeure, donc je ne sais pas encore comment je réagirais.", expectedZone: 'unknown' },
    { id: 'z11', text: "L'équipe ne sait pas encore quelles compétences pourraient émerger si je prenais un nouveau rôle.",       expectedZone: 'unknown' },
    { id: 'z12', text: "Personne ne sait encore comment je me comporterais dans une situation de forte pression client.",          expectedZone: 'unknown' },
  ],
}
