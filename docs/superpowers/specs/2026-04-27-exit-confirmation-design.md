# Exit Confirmation — Design Spec

**Date :** 2026-04-27  
**Feature :** Confirmation modale avant de quitter un atelier ou un scénario en cours

---

## Contexte

Le quiz PSM-1 dispose déjà d'une confirmation de sortie via `useBlocker` (react-router-dom) et une modale `.modal*`. Les ateliers et les scénarios de simulation n'ont aucune protection. Un utilisateur peut naviguer ailleurs et perdre sa progression sans avertissement.

---

## Approche retenue

Deux artefacts partagés réutilisables :

1. **`src/hooks/useExitGuard.ts`** — encapsule `useBlocker` + état `showModal`
2. **`src/components/ui/ConfirmLeaveModal.tsx`** — modale partagée avec les classes CSS existantes `.modal*`

Chaque consommateur (atelier, simulation, quiz) calcule `isDirty: boolean` depuis son propre état local et passe ce flag au hook. Aucune logique métier dans les artefacts partagés.

---

## Hook — `useExitGuard`

**Fichier :** `src/hooks/useExitGuard.ts`

```ts
import { useEffect, useState } from 'react'
import { useBlocker } from 'react-router-dom'

export function useExitGuard(isDirty: boolean) {
  const [showModal, setShowModal] = useState(false)

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  )

  useEffect(() => {
    if (blocker.state === 'blocked') setShowModal(true)
  }, [blocker.state])

  function confirm() {
    setShowModal(false)
    if (blocker.state === 'blocked') blocker.proceed()
  }

  function cancel() {
    setShowModal(false)
    if (blocker.state === 'blocked') blocker.reset()
  }

  return { showModal, confirm, cancel }
}
```

**Contrat :** le hook ne connaît ni le titre ni le corps de la modale — ceux-ci appartiennent au consommateur.

---

## Composant — `ConfirmLeaveModal`

**Fichier :** `src/components/ui/ConfirmLeaveModal.tsx`

```tsx
interface ConfirmLeaveModalProps {
  title: string
  body: string
  cancelLabel: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}
```

Rendu avec les classes CSS existantes : `.modal-overlay`, `.modal`, `.modal__close`, `.modal__icon`, `.modal__icon--warning`, `.modal__title`, `.modal__body`, `.modal__actions`. Icône `<X>` de lucide-react dans `.modal__icon--warning` (même pattern que QuizScreen).

Aucune nouvelle classe CSS requise.

---

## Condition `isDirty` par composant

| Composant | Condition |
|---|---|
| `ScrumGuideAtelier` | `Object.values(zones).some(Boolean)` |
| `ConflictAtelier` | `phase > 1 \|\| Object.values(diagramZones).some(Boolean)` |
| `DelegationPokerAtelier` | `phase > 1 \|\| Object.values(slots).some(Boolean)` |
| `GrowModelAtelier` | `phase > 1 \|\| Object.values(slots).some(Boolean)` |
| `StakeholderMappingAtelier` | `phase > 1 \|\| Object.values(matrixZones).some(Boolean)` |
| `AskTellAtelier` | `phase > 1 \|\| Object.values(stanceZones).some(Boolean)` |
| `MovingMotivatorsAtelier` | `phase > 1 \|\| ranking.some(m => m !== null)` |
| `IshikawaAtelier` | `phase > 1 \|\| Object.keys(branchAssignments).length > 0` |
| `TroikaConsultingAtelier` | `phase > 1 \|\| ranking.some(s => s !== null)` |
| `SBIAtelier` | `phase > 1 \|\| ranking.some(b => b !== null)` |
| `TRIZAtelier` | `phase > 1 \|\| antiGoal.trim().length > 0` |
| `SimulationScreen` | `status === 'running'` |
| `QuizScreen` | `status === 'in_progress'` (refactorisé pour utiliser le hook) |

---

## Textes des modales

| Contexte | `title` | `body` | `cancelLabel` | `confirmLabel` |
|---|---|---|---|---|
| Atelier | Quitter l'atelier ? | Votre progression sera perdue. | Continuer | Quitter quand même |
| Simulation | Quitter le scénario ? | Votre progression sera perdue. | Continuer | Quitter quand même |
| Quiz (refactor) | Quitter le quiz ? | Vous avez répondu à **N** question(s) sur X. Quitter maintenant effacera votre progression. | Continuer le quiz | Quitter quand même |

Le corps du quiz conserve son message dynamique existant — le refactor n'en change pas le contenu.

---

## Fichiers créés / modifiés

| Fichier | Action |
|---|---|
| `src/hooks/useExitGuard.ts` | Créer |
| `src/components/ui/ConfirmLeaveModal.tsx` | Créer |
| `src/components/ScrumGuideAtelier/index.tsx` | Modifier — ajouter `isDirty` + hook + modale |
| `src/components/ConflictAtelier/index.tsx` | Modifier |
| `src/components/DelegationPokerAtelier/index.tsx` | Modifier |
| `src/components/GrowModelAtelier/index.tsx` | Modifier |
| `src/components/StakeholderMappingAtelier/index.tsx` | Modifier |
| `src/components/AskTellAtelier/index.tsx` | Modifier |
| `src/components/MovingMotivatorsAtelier/index.tsx` | Modifier |
| `src/components/IshikawaAtelier/index.tsx` | Modifier |
| `src/components/TroikaConsultingAtelier/index.tsx` | Modifier |
| `src/components/SBIAtelier/index.tsx` | Modifier |
| `src/components/TRIZAtelier/index.tsx` | Modifier |
| `src/components/SimulationScreen/index.tsx` | Modifier |
| `src/components/QuizScreen/index.tsx` | Refactoriser — supprimer ~20 lignes dupliquées, utiliser le hook |

Aucune modification de `src/index.css` (toutes les classes `.modal*` existent déjà).

---

## Tests

- `useExitGuard` : tester avec `MemoryRouter` que `showModal` passe à `true` quand `isDirty=true` et navigation bloquée ; `false` quand `isDirty=false`
- `ConfirmLeaveModal` : tester le rendu des props et les callbacks `onConfirm` / `onCancel`
- Tests par atelier : non requis (l'intégration est triviale — 3 lignes par fichier)
- Tests existants (`QuizScreen.test.tsx`, `ScrumGuideAtelier.test.tsx`) ne doivent pas régresser

---

## Critères de succès

- La modale s'affiche pour tout atelier dès la première interaction (drop, clic, saisie)
- La modale s'affiche pour SimulationScreen quand `status === 'running'`
- "Continuer" / "Continuer le quiz" annule la navigation, reprend l'activité
- "Quitter quand même" laisse la navigation se poursuivre
- Le quiz continue de fonctionner exactement comme avant (comportement visible inchangé)
- Les tests Vitest passent sans régression
