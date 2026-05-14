# Graph Report - .  (2026-04-19)

## Corpus Check
- Corpus is ~29,538 words - fits in a single context window. You may not need a graph.

## Summary
- 163 nodes · 173 edges · 58 communities detected
- Extraction: 62% EXTRACTED · 36% INFERRED · 1% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App Routing & Navigation|App Routing & Navigation]]
- [[_COMMUNITY_Quiz Content & Engine|Quiz Content & Engine]]
- [[_COMMUNITY_Simulation State Types|Simulation State Types]]
- [[_COMMUNITY_Competency & Scoring Types|Competency & Scoring Types]]
- [[_COMMUNITY_UI Components & Selectors|UI Components & Selectors]]
- [[_COMMUNITY_Scrum Guide Drag & Drop|Scrum Guide Drag & Drop]]
- [[_COMMUNITY_Quiz Results Display|Quiz Results Display]]
- [[_COMMUNITY_App Entry Point|App Entry Point]]
- [[_COMMUNITY_Quiz Screen Interaction|Quiz Screen Interaction]]
- [[_COMMUNITY_Quiz Results Tests|Quiz Results Tests]]
- [[_COMMUNITY_Quiz Data Registry|Quiz Data Registry]]
- [[_COMMUNITY_Project Config|Project Config]]
- [[_COMMUNITY_Home Screen|Home Screen]]
- [[_COMMUNITY_NavBar Tests|NavBar Tests]]
- [[_COMMUNITY_Debrief Tests|Debrief Tests]]
- [[_COMMUNITY_Quiz Selector|Quiz Selector]]
- [[_COMMUNITY_Ateliers Home|Ateliers Home]]
- [[_COMMUNITY_Scenario Selection|Scenario Selection]]
- [[_COMMUNITY_Simulation Screen Tests|Simulation Screen Tests]]
- [[_COMMUNITY_Scenario Registry|Scenario Registry]]
- [[_COMMUNITY_Simulation Store|Simulation Store]]
- [[_COMMUNITY_Display State Config|Display State Config]]
- [[_COMMUNITY_Node 22|Node 22]]
- [[_COMMUNITY_Node 23|Node 23]]
- [[_COMMUNITY_Node 24|Node 24]]
- [[_COMMUNITY_Node 25|Node 25]]
- [[_COMMUNITY_Node 26|Node 26]]
- [[_COMMUNITY_Node 27|Node 27]]
- [[_COMMUNITY_Node 28|Node 28]]
- [[_COMMUNITY_Node 29|Node 29]]
- [[_COMMUNITY_Node 30|Node 30]]
- [[_COMMUNITY_Node 31|Node 31]]
- [[_COMMUNITY_Node 32|Node 32]]
- [[_COMMUNITY_Node 33|Node 33]]
- [[_COMMUNITY_Node 34|Node 34]]
- [[_COMMUNITY_Node 35|Node 35]]
- [[_COMMUNITY_Node 36|Node 36]]
- [[_COMMUNITY_Node 37|Node 37]]
- [[_COMMUNITY_Node 38|Node 38]]
- [[_COMMUNITY_Node 39|Node 39]]
- [[_COMMUNITY_Node 40|Node 40]]
- [[_COMMUNITY_Node 41|Node 41]]
- [[_COMMUNITY_Node 42|Node 42]]
- [[_COMMUNITY_Node 43|Node 43]]
- [[_COMMUNITY_Node 44|Node 44]]
- [[_COMMUNITY_Node 45|Node 45]]
- [[_COMMUNITY_Node 46|Node 46]]
- [[_COMMUNITY_Node 47|Node 47]]
- [[_COMMUNITY_Node 48|Node 48]]
- [[_COMMUNITY_Node 49|Node 49]]
- [[_COMMUNITY_Node 50|Node 50]]
- [[_COMMUNITY_Node 51|Node 51]]
- [[_COMMUNITY_Node 52|Node 52]]
- [[_COMMUNITY_Node 53|Node 53]]
- [[_COMMUNITY_Node 54|Node 54]]
- [[_COMMUNITY_Node 55|Node 55]]
- [[_COMMUNITY_Node 56|Node 56]]
- [[_COMMUNITY_Node 57|Node 57]]

## God Nodes (most connected - your core abstractions)
1. `useSimulationStore` - 16 edges
2. `computeDebrief()` - 11 edges
3. `App()` - 7 edges
4. `Debrief component` - 7 edges
5. `getExam` - 7 edges
6. `Scenario (interface)` - 7 edges
7. `computeCompetencyBounds()` - 6 edges
8. `applyChoice()` - 6 edges
9. `resolveNextScene()` - 6 edges
10. `Home component (landing page with 3 section cards)` - 6 edges

## Surprising Connections (you probably didn't know these)
- `README (React+TS+Vite template)` --references--> `ESLint Config`  [INFERRED]
  README.md → eslint.config.js
- `README (React+TS+Vite template)` --references--> `Vite Config`  [INFERRED]
  README.md → vite.config.ts
- `App Favicon (lightning-bolt shape, purple/violet gradient)` --conceptually_related_to--> `Scrum Master Sim — learning app concept`  [INFERRED]
  public/favicon.svg → src/components/Home/index.tsx
- `index.html Entry Point` --references--> `main (React entry, mounts App)`  [EXTRACTED]
  index.html → src/main.tsx
- `index.html Entry Point` --references--> `App Favicon (lightning-bolt shape, purple/violet gradient)`  [EXTRACTED]
  index.html → public/favicon.svg

## Hyperedges (group relationships)
- **App Routing Layer: App mounts NavBar + all route-bound page components** — app_app, navbar_navbar, home_home, debrief_debrief, quizresults_quizresults, ateliershome_ateliershome [EXTRACTED 1.00]
- **Simulation Feedback Loop: SimulationStore drives Debrief scoring and competency display** — store_simulationstore, debrief_debrief, concept_debrief_scoring [INFERRED 0.88]
- **Quiz Flow: quizStore drives QuizResults pass/fail scoring and question review** — store_quizstore, quizresults_quizresults, concept_psm1_quiz [INFERRED 0.87]
- **Quiz Data Flow: Types → Exam Data → Registry → UI** — quizzes_types_quizexam, exam1_questions, exam2_questions, exam3_questions, quizzes_index_exams, quizzes_index_getexam, quizscreen_quizscreen [INFERRED 0.88]
- **Simulation State Display Pipeline** — simulationscreen_simulationscreen, stateindicators_stateindicators, progressbar_progressbar [EXTRACTED 0.95]
- **Selector + Navigation Entry-Point Pattern** — quizselector_quizselector, scenarioselector_scenarioselector, scrumguideatelier_scrumguideatelier [INFERRED 0.78]
- **Simulation Execution Pipeline** — simulationstore_usesimulationstore, simulator_applychoice, scorer_computedebrief [EXTRACTED 1.00]
- **Scenario Data Contract (all scenarios share types)** — scenario_01_scenario01, scenario_02_scenario02, scenario_03_scenario03, engine_types_scenario [EXTRACTED 1.00]
- **Engine Test Coverage (simulator + scorer under shared test setup)** — test_setup_setup, simulatortest_applychoice_suite, scorertest_computedebrief_suite [INFERRED 0.80]

## Communities

### Community 0 - "App Routing & Navigation"
Cohesion: 0.18
Nodes (18): App(), AteliersHome component, AteliersHome tests, Ateliers (interactive drag-and-drop workshops), Debrief scoring system (global score + competency results), PSM-1 Certification Quiz feature, Scrum Master scenario simulation feature, Debrief component (+10 more)

### Community 1 - "Quiz Content & Engine"
Cohesion: 0.18
Nodes (18): exam-1 questions, exam-2 questions, exam-3 questions, quizData.test, formatTime, QuizScreen, QuizScreen.test, EXAM_CARDS (+10 more)

### Community 2 - "Simulation State Types"
Cohesion: 0.18
Nodes (16): Choice (interface), DebriefResult (interface), Scene (interface), SimulationStatus (type), QuizStatus (type), QuizStore (interface), useQuizStore, useQuizStore test suite (+8 more)

### Community 3 - "Competency & Scoring Types"
Cohesion: 0.29
Nodes (14): ChoiceRecord (interface), CompetencyId (type), CompetencyResult (interface), Scenario (interface), StateVariables (interface), scenario01 (Premier Sprint), scenario02 (La Daily qui tue), scenario03 (Dette ou démo) (+6 more)

### Community 4 - "UI Components & Selectors"
Cohesion: 0.18
Nodes (11): Badge(), ProgressBar, QuizSelector, QuizSelector.test, ScenarioCard, ScenarioSelector, ScenarioSelector.test, SimulationScreen (+3 more)

### Community 5 - "Scrum Guide Drag & Drop"
Cohesion: 0.33
Nodes (0): 

### Community 6 - "Quiz Results Display"
Cohesion: 0.5
Nodes (0): 

### Community 7 - "App Entry Point"
Cohesion: 0.5
Nodes (4): Scrum Master Sim — learning app concept, App Favicon (lightning-bolt shape, purple/violet gradient), index.html Entry Point, main (React entry, mounts App)

### Community 8 - "Quiz Screen Interaction"
Cohesion: 0.67
Nodes (0): 

### Community 9 - "Quiz Results Tests"
Cohesion: 0.67
Nodes (0): 

### Community 10 - "Quiz Data Registry"
Cohesion: 1.0
Nodes (2): getExam(), shuffle()

### Community 11 - "Project Config"
Cohesion: 1.0
Nodes (3): ESLint Config, README (React+TS+Vite template), Vite Config

### Community 12 - "Home Screen"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "NavBar Tests"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Debrief Tests"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Quiz Selector"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Ateliers Home"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Scenario Selection"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Simulation Screen Tests"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Scenario Registry"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Simulation Store"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Display State Config"
Cohesion: 1.0
Nodes (2): ProgressBarProps, VAR_CONFIG

### Community 22 - "Node 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Node 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Node 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Node 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Node 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Node 27"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Node 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Node 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Node 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Node 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Node 32"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Node 33"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Node 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Node 35"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Node 36"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Node 37"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Node 38"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Node 39"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Node 40"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Node 41"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Node 42"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Node 43"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Node 44"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Node 45"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Node 46"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Node 47"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Node 48"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Node 49"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Node 50"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Node 51"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "Node 52"
Cohesion: 1.0
Nodes (1): SVG Icon Sprite (bluesky, discord, documentation, github, social, x)

### Community 53 - "Node 53"
Cohesion: 1.0
Nodes (1): LEVEL_LABELS

### Community 54 - "Node 54"
Cohesion: 1.0
Nodes (1): COMPETENCY_LABELS

### Community 55 - "Node 55"
Cohesion: 1.0
Nodes (1): SCENE_TYPE_LABELS

### Community 56 - "Node 56"
Cohesion: 1.0
Nodes (1): BadgeProps

### Community 57 - "Node 57"
Cohesion: 1.0
Nodes (1): Character (interface)

## Ambiguous Edges - Review These
- `Badge()` → `ScrumGuideAtelier`  [AMBIGUOUS]
  src/components/ScrumGuideAtelier/index.tsx · relation: calls
- `getScenarioById` → `useSimulationStore`  [AMBIGUOUS]
  src/data/scenarios/index.ts · relation: conceptually_related_to

## Knowledge Gaps
- **25 isolated node(s):** `SVG Icon Sprite (bluesky, discord, documentation, github, social, x)`, `AteliersHome tests`, `Home tests`, `NavBar tests`, `ProgressBar UI component` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Home Screen`** (2 nodes): `Home()`, `index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `NavBar Tests`** (2 nodes): `renderWithRouter()`, `NavBar.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Debrief Tests`** (2 nodes): `playThrough()`, `Debrief.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Quiz Selector`** (2 nodes): `QuizSelector()`, `index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Ateliers Home`** (2 nodes): `AteliersHome()`, `index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Scenario Selection`** (2 nodes): `ScenarioCard()`, `index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Simulation Screen Tests`** (2 nodes): `renderSimulation()`, `SimulationScreen.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Scenario Registry`** (2 nodes): `getScenarioById()`, `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Simulation Store`** (2 nodes): `emptyScores()`, `simulationStore.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Display State Config`** (2 nodes): `ProgressBarProps`, `VAR_CONFIG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 22`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 23`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 24`** (1 nodes): `main.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 25`** (1 nodes): `setup.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 26`** (1 nodes): `ProgressBar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 27`** (1 nodes): `Home.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 28`** (1 nodes): `index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 29`** (1 nodes): `index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 30`** (1 nodes): `QuizScreen.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 31`** (1 nodes): `index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 32`** (1 nodes): `StateIndicators.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 33`** (1 nodes): `QuizSelector.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 34`** (1 nodes): `AteliersHome.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 35`** (1 nodes): `ScrumGuideAtelier.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 36`** (1 nodes): `ScenarioSelector.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 37`** (1 nodes): `index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 38`** (1 nodes): `scenario-03-debt-or-demo.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 39`** (1 nodes): `scenario-02-daily-dysfunction.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 40`** (1 nodes): `scenario-01-new-team.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 41`** (1 nodes): `exam-1.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 42`** (1 nodes): `types.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 43`** (1 nodes): `quizData.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 44`** (1 nodes): `exam-3.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 45`** (1 nodes): `exam-2.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 46`** (1 nodes): `types.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 47`** (1 nodes): `simulator.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 48`** (1 nodes): `scorer.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 49`** (1 nodes): `quizStore.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 50`** (1 nodes): `quizStore.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 51`** (1 nodes): `simulationStore.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 52`** (1 nodes): `SVG Icon Sprite (bluesky, discord, documentation, github, social, x)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 53`** (1 nodes): `LEVEL_LABELS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 54`** (1 nodes): `COMPETENCY_LABELS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 55`** (1 nodes): `SCENE_TYPE_LABELS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 56`** (1 nodes): `BadgeProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Node 57`** (1 nodes): `Character (interface)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Badge()` and `ScrumGuideAtelier`?**
  _Edge tagged AMBIGUOUS (relation: calls) - confidence is low._
- **What is the exact relationship between `getScenarioById` and `useSimulationStore`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `useSimulationStore` connect `Simulation State Types` to `Competency & Scoring Types`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `getExam` connect `Quiz Content & Engine` to `UI Components & Selectors`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `App()` connect `App Routing & Navigation` to `App Entry Point`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useSimulationStore` (e.g. with `SimulationStore (interface)` and `resolveNextScene()`) actually correct?**
  _`useSimulationStore` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `computeDebrief()` (e.g. with `useSimulationStore test suite` and `CompetencyResult (interface)`) actually correct?**
  _`computeDebrief()` has 2 INFERRED edges - model-reasoned connections that need verification._