# Ateliers Vague 1 — Design Document

**Date :** 2026-04-17
**Statut :** Approuvé

---

## Vision

Ajouter 5 ateliers interactifs à la section Ateliers du Scrum Master Simulator : Delegation Poker, Moving Motivators, Anti-patterns Scrum, Biais cognitifs décisionnels, et Kudo Cards. Chaque atelier embarque une couche pédagogique intégrée (pas d'intro séparée) sous forme de feedback contextuel, cartes-concept dépliables et récapitulatif final. Priorité maximale sur la qualité des interactions et des données.

---

## Décisions produit

| Dimension | Choix |
|-----------|-------|
| Architecture | 3 moteurs réutilisables (ScenarioQuiz, CardRanking, ConsensusSim) |
| Pédagogie | Inline uniquement — feedback immédiat + carte concept dépliable |
| Pool de données | 60–100 scénarios par atelier, TypeScript hardcodé |
| Progression | `localStorage` clé `'scrum-ateliers-progress'` — pas de backend |
| Nouvelles libs | Aucune |
| Session de jeu | 10–15 questions tirées aléatoirement du pool |

---

## Architecture

### Structure de fichiers

```
src/
├── engines/
│   ├── ScenarioQuiz/
│   │   ├── index.tsx              # moteur scénario → options → feedback
│   │   └── ScenarioQuiz.test.tsx
│   ├── CardRanking/
│   │   ├── index.tsx              # drag-to-rank + impact organisationnel
│   │   └── CardRanking.test.tsx
│   └── ConsensusSim/
│       ├── index.tsx              # vote 3 profils + négociation consensus
│       └── ConsensusSim.test.tsx
├── components/
│   ├── AteliersHome/
│   │   └── index.tsx              # redesigné : catalogue filtrable + progression
│   ├── ConceptCard/
│   │   ├── index.tsx              # carte concept dépliable (partagée)
│   │   └── ConceptCard.test.tsx
│   ├── FeedbackPanel/
│   │   ├── index.tsx              # panneau latéral coulissant (partagé)
│   │   └── FeedbackPanel.test.tsx
│   ├── SessionSummary/
│   │   ├── index.tsx              # récapitulatif fin de session (partagé)
│   │   └── SessionSummary.test.tsx
│   └── ateliers/
│       ├── AntiPatternsAtelier/
│       │   └── index.tsx          # instancie ScenarioQuiz avec données antipatterns
│       ├── BiaisAtelier/
│       │   └── index.tsx          # instancie ScenarioQuiz avec données biais
│       ├── KudoAtelier/
│       │   └── index.tsx          # instancie ScenarioQuiz avec données kudo
│       ├── DelegationAtelier/
│       │   └── index.tsx          # instancie ConsensusSim avec données delegation
│       └── MovingMotivatorsAtelier/
│           └── index.tsx          # instancie CardRanking avec données motivators
├── data/
│   └── ateliers/
│       ├── antipatterns/
│       │   ├── scenarios.ts       # 80 scénarios
│       │   └── concepts.ts        # 15 anti-patterns Scrum définis
│       ├── biais/
│       │   ├── scenarios.ts       # 80 scénarios de décision
│       │   └── concepts.ts        # 25 biais cognitifs définis
│       ├── delegation/
│       │   ├── situations.ts      # 70 situations professionnelles
│       │   └── profiles.ts        # 3 profils fictifs avec comportements
│       ├── motivators/
│       │   ├── cards.ts           # 10 cartes Moving Motivators (fixes)
│       │   └── scenarios.ts       # 60 scénarios de changement organisationnel
│       └── kudo/
│           ├── scenarios.ts       # 70 situations de reconnaissance
│           └── types.ts           # 12 types de Kudo Cards avec nuances
└── hooks/
    └── useAtelierProgress.ts      # lecture/écriture localStorage progression
```

### Routes ajoutées dans App.tsx

| Route | Composant |
|-------|-----------|
| `/ateliers` | `AteliersHome` (redesigné) |
| `/ateliers/scrum-guide` | `ScrumGuideAtelier` (existant) |
| `/ateliers/antipatterns` | `AntiPatternsAtelier` |
| `/ateliers/biais-cognitifs` | `BiaisAtelier` |
| `/ateliers/delegation-poker` | `DelegationAtelier` |
| `/ateliers/moving-motivators` | `MovingMotivatorsAtelier` |
| `/ateliers/kudo-cards` | `KudoAtelier` |

---

## Modèles de données

### ScenarioQuiz — types partagés

```typescript
interface ScenarioOption {
  id: string
  label: string
  icon: string              // emoji ou lettre A/B/C/D
}

interface Scenario {
  id: string
  situation: string         // texte narratif 3–5 lignes, ton professionnel réaliste
  options: ScenarioOption[] // toujours 4 choix
  correctId: string
  conceptKey: string        // lie à un Concept
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
}

interface Concept {
  id: string
  name: string
  shortDef: string          // 1 phrase — affichée dans le feedback immédiat
  fullDef: string           // définition complète dans la carte dépliable
  symptoms: string[]        // signaux reconnaissables (3–5 items)
  remedy: string            // comment corriger ou répondre
  confusedWith: string[]    // concepts proches, sources de confusion
}

interface ScenarioQuizProps {
  atelierTitle: string
  scenarios: Scenario[]
  concepts: Record<string, Concept>
  sessionSize?: number      // défaut : 12 questions par session
  onSessionEnd: (result: SessionResult) => void
}
```

### ConsensusSim — types

```typescript
type DelegationLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7

interface DelegationLevelDef {
  level: DelegationLevel
  name: string              // ex: "Décider" (niveau 7)
  description: string
}

interface ProfileVote {
  profile: 'dev' | 'po' | 'manager'
  level: DelegationLevel
  rationale: string         // argument affiché lors de la révélation
}

interface DelegationSituation {
  id: string
  situation: string         // question de délégation, contexte narratif
  profileVotes: ProfileVote[]
  consensusLevel: DelegationLevel
  consensusExplanation: string
  tags: string[]
}

interface ConsensusSituation extends DelegationSituation {}
```

### CardRanking — types

```typescript
interface MotivatorCard {
  id: string
  name: string              // ex: "Autonomie"
  description: string       // définition courte
  icon: string              // emoji représentatif
  m30Category: string       // catégorie Management 3.0
}

interface ChangeScenario {
  id: string
  situation: string         // ex: "Votre équipe passe en full remote"
  impacts: Record<string, 'positive' | 'negative' | 'neutral'>  // motivatorId → impact
  impactExplanations: Record<string, string>   // motivatorId → explication de l'impact
  tags: string[]
}
```

### Progression (localStorage)

```typescript
interface AtelierProgress {
  atelierSlug: string
  sessionsPlayed: number
  averageScore: number
  conceptStats: Record<string, { correct: number; total: number }>
  lastPlayedAt: number      // Date.now()
}

// Clé localStorage : 'scrum-ateliers-progress'
// Valeur : AtelierProgress[]
```

---

## Moteur ScenarioQuiz

### Flux UX

1. **Question active** : carte scénario centrale (texte narratif) + 4 options en grille 2×2
2. **Validation** : clic ou touche 1–4 → animation flip de la carte
3. **Feedback immédiat** : panneau coulissant depuis la droite
   - Correct/Incorrect avec couleur
   - Explication courte (shortDef du concept, 2–3 phrases)
   - Bouton "En savoir plus" → ouvre la ConceptCard dépliable
4. **Navigation** : bouton "Question suivante" → question suivante tirée au sort
5. **Barre latérale** : progression par concept (vert/rouge/gris selon les réponses)
6. **Fin de session** : SessionSummary — score global + tableau concepts maîtrisés vs à retravailler + bouton "Rejouer les erreurs"

### Raccourcis clavier
- `1` `2` `3` `4` — sélectionner une option
- `Enter` — valider / passer à la suivante
- `?` — afficher/masquer la ConceptCard

---

## Moteur ConsensusSim (Delegation Poker)

### Flux UX

1. **Situation affichée** avec contexte narratif complet
2. **Choix de l'apprenant** : 7 cartes animées (niveaux 1–7), chacune avec son nom et une description au survol
3. **Révélation progressive** des 3 profils fictifs un par un (animation), chacun avec son niveau choisi et son argument
4. **Zone de négociation** : l'apprenant peut confirmer ou réviser son vote
5. **Résolution** : niveau consensus affiché, explication complète, lien vers la définition du niveau

### Profils fictifs
- **Léa (Dev Senior)** : pragmatique, focus exécution, tend vers plus d'autonomie équipe
- **Marc (Product Owner)** : orienté valeur, sensible aux risques produit, variable selon le contexte
- **Sophie (Manager)** : prudente, tend vers la délégation structurée, arguments sur la gouvernance

Les votes sont hardcodés par situation dans `situations.ts` — pas d'IA generative.

---

## Moteur CardRanking (Moving Motivators)

### Flux UX

**Phase 1 — Classement personnel**
- 10 cartes disposées en ligne horizontale, drag & drop pour les réordonner
- Instruction : "Classez ces motivateurs du plus important (gauche) au moins important (droite) pour vous"
- Pas de bonne/mauvaise réponse — c'est une réflexion personnelle

**Phase 2 — Impact d'un changement**
- Un scénario organisationnel apparaît (ex : "Votre équipe passe en full remote")
- Pour chaque carte, l'apprenant clique ↑ (impact positif sur sa motivation) ou ↓ (impact négatif) ou laisse neutre
- Validation → comparaison avec le pattern de référence
- Feedback par carte : explication de l'impact attendu selon Management 3.0

**Récapitulatif**
- Graphique horizontal : alignement apprenant vs référence
- Points de divergence commentés (pas jugés — "intéressant que vous voyez X ainsi…")

---

## AteliersHome redesigné

### Catalogue filtrable

```
Filtres : [Tous] [Management 3.0] [Scrum] [Décision] [Coaching]
```

Chaque carte d'atelier affiche :
- Titre + badge niveau (Débutant / Intermédiaire / Avancé)
- Badge catégorie (Management 3.0, Scrum, etc.)
- Nombre de concepts couverts (ex: "15 anti-patterns")
- Barre de progression personnelle si déjà joué (score moyen)
- Durée estimée (~10 min)
- Bouton "Démarrer" / "Continuer" selon l'état

### Hook `useAtelierProgress`

```typescript
function useAtelierProgress(slug: string): {
  progress: AtelierProgress | null
  saveResult: (result: SessionResult) => void
}
```

---

## FeedbackPanel (composant partagé)

- Panneau latéral droit, coulissant (CSS transition `transform: translateX`)
- Hauteur : 100% de la zone de jeu
- Contenu :
  - Icône correct ✓ / incorrect ✗ (grande, colorée)
  - Nom du concept identifié (badge)
  - Explication courte (shortDef)
  - Bouton "En savoir plus" → ConceptCard dépliable en dessous
  - Bouton "Question suivante"

## ConceptCard (composant partagé)

- Carte dépliable avec animation `max-height`
- Sections : Définition complète | Symptômes | Remède | À ne pas confondre avec

## SessionSummary (composant partagé)

- Score global X/Y avec pourcentage
- Tableau : concept | correct | total | taux
- Tri automatique : concepts les plus faibles en premier
- Actions : "Rejouer les erreurs" | "Nouvelle session" | "Retour aux ateliers"

---

## Hors périmètre Vague 1

- Vague 2 : Cynefin, Stakeholder Mapping, Empathy Map, Shu-Ha-Ri, GROW
- Vague 3 : Liberating Structures, Double Diamond, Theory of Constraints, Solutions Focus, Radical Candor
- Mode multijoueur synchrone (Delegation Poker réel)
- Export PDF du récapitulatif
- Système de badges/gamification globale
