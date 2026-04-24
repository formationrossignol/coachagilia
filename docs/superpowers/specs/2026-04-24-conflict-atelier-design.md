# Atelier — Gestion des conflits (Thomas-Kilmann)

**Date :** 2026-04-24
**Durée estimée :** ~15 min
**Niveau :** Intermédiaire

---

## Objectif pédagogique

Ancrer le modèle Thomas-Kilmann (TKI) en deux étapes : d'abord positionner les 5 modes sur le diagramme Assertivité/Coopération, puis associer 15 situations de conflit Scrum au mode TKI approprié.

---

## Architecture

### Fichiers créés
- `src/components/ConflictAtelier/index.tsx` — composant principal de l'atelier

### Fichiers modifiés
- `src/components/AteliersHome/index.tsx` — ajout de l'entrée dans le tableau `ATELIERS`
- `src/App.tsx` — ajout de la route `/ateliers/conflits`

---

## Contenu

### Phase 1 — Diagramme TKI

5 zones disposées sur un repère à deux axes (Assertivité vertical, Coopération horizontal).

| Étiquette | Position |
|-----------|----------|
| Compétition | Haut gauche (fort assertif, peu coopératif) |
| Collaboration | Haut droite (fort assertif, fort coopératif) |
| Compromis | Centre |
| Évitement | Bas gauche (peu assertif, peu coopératif) |
| Accommodation | Bas droite (peu assertif, fort coopératif) |

### Phase 2 — 15 situations (3 par mode)

**Compétition**
1. Un membre de l'équipe pousse une solution technique non conforme à la DoD — le SM doit trancher pour protéger la qualité.
2. Une livraison est bloquée par un désaccord de dernière minute — une décision rapide s'impose.
3. Un développeur refuse systématiquement les revues de code — le SM pose une limite ferme.

**Collaboration**
4. Deux développeurs ont des visions opposées sur l'architecture d'une fonctionnalité clé — le SM facilite une session de co-conception.
5. Une tension récurrente entre deux membres dégrade l'atmosphère de l'équipe — le SM organise un dialogue structuré.
6. L'équipe ne s'accorde pas sur la définition du Done — le SM anime un atelier pour construire une vision commune.

**Compromis**
7. Le Product Owner et l'équipe ne s'accordent pas sur la priorité de deux User Stories de même valeur — on négocie un ordre acceptable pour les deux.
8. L'équipe est divisée sur la durée du prochain Sprint (1 ou 2 semaines) — on convient d'un essai de 2 semaines réévalué à la rétrospective.
9. Les ressources ne permettent pas de traiter tous les items prévus — on réduit le périmètre de manière équilibrée.

**Évitement**
10. Une légère irritation sur le choix d'un outil de communication, sans impact sur la livraison — le SM laisse passer.
11. Une friction ponctuelle entre deux membres en fin de Sprint surchargé — le SM note le sujet pour la rétrospective plutôt que d'intervenir immédiatement.
12. Un désaccord sur le format des standup notes, mineur et sans conséquence sur le travail — le SM ne prend pas position.

**Accommodation**
13. Un développeur senior propose une approche différente de celle prévue, avec une expertise reconnue — le SM cède et soutient sa proposition.
14. Un stakeholder important demande un ajustement raisonnable sur la présentation du Sprint Review — le SM accepte pour préserver la relation.
15. Un membre de l'équipe demande à changer l'heure du Daily Scrum pour des raisons personnelles légitimes — le SM accommode la demande.

---

## Interactions et feedback

### Phase 1
- Palette de 5 étiquettes glissables vers les zones du diagramme
- Bouton "Vérifier" activé quand les 5 zones sont remplies
- Si 5/5 : bandeau vert + bouton "Phase suivante" qui déverrouille la phase 2
- Si < 5/5 : zones incorrectes en rouge, correctes en vert, bouton "Réessayer"

### Phase 2
- 5 colonnes (une par mode), 15 cartes-situations à glisser dans la bonne colonne
- Bouton "Vérifier" activé quand les 15 situations sont placées
- Score X/15 affiché, zones incorrectes en rouge, correctes en vert
- Bouton "Réessayer phase 2" pour retenter sans repasser la phase 1

### Score final
- Badge vert si 15/15
- Badge orange si < 15/15
- Pas de score combiné phases 1+2 (phase 1 validée à 100% avant accès à la phase 2)

---

## État du composant

```ts
type Phase = 1 | 2

// Phase 1 : zones du diagramme TKI
type DiagramZones = Record<'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right', string>

// Phase 2 : situations assignées à un mode
type SituationZones = Record<string, string> // situationId → modeKey

state = {
  phase: Phase
  diagramZones: DiagramZones
  situationZones: SituationZones
  dragging: { label: string; fromZone?: string } | null
  verifyResult: Record<string, boolean> | null
}
```
