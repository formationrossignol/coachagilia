import type { CertResource } from '../types'

export const safeResources: CertResource[] = [
  {
    id: 'safe-summary',
    title: 'SAFe 6.0 — Big Picture',
    type: 'summary',
    content: `## SAFe en bref\n\n**Niveaux :** Team · Program (ART) · Large Solution · Portfolio\n\n**ART (Agile Release Train)** : 50-125 personnes, livrent en PI (Program Increment)\n\n**PI Planning** : cadence trimestrielle, toute l'ART planifie ensemble\n\n**Rôles clés :** Release Train Engineer (RTE), Product Manager, System Architect\n\n**Principes Lean-Agile :** Take an economic view · Apply systems thinking · Assume variability`,
  },
  {
    id: 'safe-flashcards',
    title: 'Flashcards — Rôles et cérémonies SAFe',
    type: 'flashcards',
    content: `**Q: Qu'est-ce qu'un PI ?** R: Program Increment — cadence de 8-12 semaines avec 4-6 Sprints\n\n**Q: Rôle du RTE ?** R: Chief Scrum Master de l'ART — facilite le PI Planning et supprime les obstacles\n\n**Q: Qu'est-ce que le System Demo ?** R: Démo intégrée de toutes les équipes à la fin de chaque Sprint\n\n**Q: IP Sprint ?** R: Innovation & Planning Sprint — dernier Sprint du PI, dédié à l'innovation et au PI Planning suivant`,
  },
  {
    id: 'safe-tips',
    title: "Points clés pour l'examen SAFe",
    type: 'tips',
    content: `## Pièges SAFe\n\n- Le **PI Planning** est un événement en présentiel (idéalement) — 2 jours\n- L'**ART** n'est pas un projet — c'est une équipe de long terme\n- Le **RTE** facilite mais ne manage pas les équipes\n- Les **ROAM** (Resolved, Owned, Accepted, Mitigated) gèrent les risques au PI Planning\n- SAFe ≠ simple Scrum à l'échelle — il y a des rôles et artefacts spécifiques`,
  },
]
