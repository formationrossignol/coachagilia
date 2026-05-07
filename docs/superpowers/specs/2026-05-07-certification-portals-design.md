# Certification Portals — Design Spec

**Date:** 2026-05-07  
**Status:** Approved

## Context

The app currently has a single `QuizSelector` screen offering 3 PSM-1-focused exams (80/40/80 questions). The certification section feels limited because it targets only one certification and provides no topic-based practice, resources, or per-cert progression.

The goal is to replace this with a multi-certification hub covering PSM, PSPO, PMI-ACP, and SAFe — each with dedicated exams, topic practice, resources, and progression tracking integrated into the existing gamification system.

The app is used in two contexts: autonomous learners preparing for certification, and facilitators projecting the app during training sessions. Both benefit from richer certification content.

## Architecture

### Data layer

New directory: `src/data/certifications/`

```
certifications/
  types.ts          — CertificationId, CertTopic, CertResource, CertDefinition
  index.ts          — getCertification(id), getAllCertifications()
  psm/
    definition.ts   — metadata: title, levels (PSM I/II/III), themes, thresholds
    exams.ts        — questions tagged by topic (extends QuizQuestion with topic field)
    resources.ts    — CertResource[] (fiches, flashcards, key points)
  pspo/             — same structure
  pmi-acp/          — same structure
  safe/             — same structure
```

**Type extensions:**

```ts
// Extends existing QuizQuestion — backward compatible
interface CertQuestion extends QuizQuestion {
  topic: string          // e.g. 'scrum-events', 'scaling'
  certificationId: CertificationId
}

type CertificationId = 'psm' | 'pspo' | 'pmi-acp' | 'safe'

interface CertTopic {
  slug: string
  label: string
  questionCount: number
}

interface CertResource {
  id: string
  title: string
  type: 'summary' | 'flashcards' | 'tips'
  content: string   // markdown
}

interface CertDefinition {
  id: CertificationId
  name: string
  shortName: string
  issuer: string          // 'Scrum.org', 'PMI', 'Scaled Agile'
  levels: string[]        // ['PSM I', 'PSM II', 'PSM III']
  color: string           // CSS color token
  topics: CertTopic[]
  resources: CertResource[]
}
```

**Migration:** existing `exam-1/2/3` questions are migrated to `psm/exams.ts`, each tagged with a topic. No breaking change — existing `QuizExam` format is preserved; new fields are additive.

### Routes

| Path | Component | Notes |
|------|-----------|-------|
| `/quiz` | `CertificationHub` | Replaces `QuizSelector` |
| `/quiz/:certId` | `CertificationPortal` | e.g. `/quiz/psm` |
| `/quiz/:certId/exam/:examId` | `QuizScreen` | Reused as-is |
| `/quiz/:certId/topic/:slug` | `TopicPracticeScreen` | New |

Old routes `/quiz/exam-1`, `/quiz/exam-2`, `/quiz/exam-3` redirect to `/quiz/psm` for backward compatibility.

### Components

**`CertificationHub`** (replaces `QuizSelector`)
- 4 certification cards in a responsive grid
- Each card: color-coded by cert, shows exam count, topic count, and per-cert progress bar
- Links to `/quiz/:certId`

**`CertificationPortal`**
- Header: cert name, issuer, levels badge
- 4 tabs: Examens | Thèmes | Ressources | Progression
- **Examens tab:** list of available exams (full / quick / random) with last score and start button
- **Thèmes tab:** grid of topic chips, each linking to `/quiz/:certId/topic/:slug`
- **Ressources tab:** cards per resource (summary, flashcards, tips)
- **Progression tab:** per-cert XP, skill radar, completed exams, best scores

**`TopicPracticeScreen`**
- Subset of `QuizScreen` filtered to a single topic
- Key difference: immediate feedback after each answer (not deferred to results)
- Shows explanation or Scrum principle on wrong answers
- No timer (practice mode)

### Reused as-is
- `QuizScreen` — all existing exam logic unchanged
- `QuizResults` — unchanged
- `quizStore` — unchanged; `startQuiz` receives `examId` as before

## Gamification integration

**Badges (4 new):**
- `psm-certified` — score ≥ 85% on at least one full PSM exam
- `pspo-certified` — score ≥ 85% on at least one full PSPO exam
- `pmi-acp-certified` — score ≥ 85% on at least one full PMI-ACP exam
- `safe-certified` — score ≥ 85% on at least one full SAFe exam

**Learning paths (4 new, one per cert):**
Each path follows: topic practice → quick exam → full exam

**Skill area mapping:**
| Certification | Skill areas |
|--------------|-------------|
| PSM | `facilitation`, `scrum_knowledge` |
| PSPO | `product_discovery`, `prioritization` |
| PMI-ACP | `delivery_excellence`, `flow` |
| SAFe | `organization_design`, `change_management` |

XP awards follow existing rules (`QUIZ_COMPLETED` event with `score` payload).

## Content strategy

- **PSM:** migrate existing 200 questions from `exam-1/2/3` → tag by topic
- **PSPO, PMI-ACP, SAFe:** new question banks to create (target: 80+ questions per cert minimum, structured by topic)
- Resources (fiches, flashcards) are markdown files — can be authored incrementally

## Error handling

- Unknown `certId` in URL → redirect to `/quiz`
- Unknown `examId` within a cert → redirect to `/quiz/:certId`
- Unknown topic slug → redirect to `/quiz/:certId`

## Testing

- Unit: `getCertification(id)` returns correct definition; topic filtering returns correct subset
- Component: `CertificationHub` renders 4 cards; `CertificationPortal` tab switching; `TopicPracticeScreen` shows immediate feedback
- Existing `QuizScreen` and `quizStore` tests are unaffected
