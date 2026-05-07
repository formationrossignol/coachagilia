import type { CertQuestion } from '../types'

export const safeQuestions: CertQuestion[] = [
  {
    id: 'safe-q1', certificationId: 'safe', topic: 'art',
    text: 'What is an Agile Release Train (ART)?',
    options: [
      { letter: 'A', text: 'A single Scrum team scaled up to 50 people' },
      { letter: 'B', text: 'A long-lived team of Agile teams (50-125 people) that delivers value on a common mission' },
      { letter: 'C', text: 'A quarterly release process managed by the PMO' },
      { letter: 'D', text: 'A tool for tracking releases' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q2', certificationId: 'safe', topic: 'pi-planning',
    text: 'What is the primary purpose of PI Planning?',
    options: [
      { letter: 'A', text: "To review the previous quarter's results" },
      { letter: 'B', text: 'To align all teams on the ART to a shared mission and plan the next Program Increment' },
      { letter: 'C', text: 'To update the portfolio backlog' },
      { letter: 'D', text: 'To assign work to individual developers' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q3', certificationId: 'safe', topic: 'rte',
    text: 'What is the role of the Release Train Engineer (RTE)?',
    options: [
      { letter: 'A', text: 'Manage the budget for the ART' },
      { letter: 'B', text: 'Serve as the chief Scrum Master for the ART, facilitating ART events and escalating impediments' },
      { letter: 'C', text: 'Write the program vision and roadmap' },
      { letter: 'D', text: 'Approve all user stories before implementation' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q4', certificationId: 'safe', topic: 'lean-agile',
    text: 'Which SAFe principle states that economic decisions should drive the delivery sequence?',
    options: [
      { letter: 'A', text: 'Apply systems thinking' },
      { letter: 'B', text: 'Take an economic view' },
      { letter: 'C', text: 'Assume variability; preserve options' },
      { letter: 'D', text: 'Build incrementally with fast, integrated learning cycles' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q5', certificationId: 'safe', topic: 'pi-planning',
    text: "During PI Planning, how are risks managed?",
    options: [
      { letter: 'A', text: 'Risks are added to the program backlog for later resolution' },
      { letter: 'B', text: "Risks are ROAM'd: Resolved, Owned, Accepted, or Mitigated" },
      { letter: 'C', text: 'Risks are escalated to the portfolio level' },
      { letter: 'D', text: 'Risks are ignored if they are low probability' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q6', certificationId: 'safe', topic: 'art',
    text: 'How long is a typical Program Increment (PI)?',
    options: [
      { letter: 'A', text: '2 weeks' },
      { letter: 'B', text: '1 month' },
      { letter: 'C', text: '8-12 weeks, typically containing 4-6 Iterations' },
      { letter: 'D', text: '6 months' },
    ],
    correctAnswer: ['C'], isMultiple: false,
  },
  {
    id: 'safe-q7', certificationId: 'safe', topic: 'portfolio',
    text: 'What is the purpose of the SAFe Portfolio level?',
    options: [
      { letter: 'A', text: 'To manage individual team sprints' },
      { letter: 'B', text: 'To align strategy, funding, and Lean governance across multiple ARTs' },
      { letter: 'C', text: 'To track individual developer performance' },
      { letter: 'D', text: 'To write features for the program backlog' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q8', certificationId: 'safe', topic: 'lean-agile',
    text: 'What are the two pillars of the SAFe House of Lean?',
    options: [
      { letter: 'A', text: 'Speed and quality' },
      { letter: 'B', text: 'Respect for people and culture · Continuous improvement (Kaizen)' },
      { letter: 'C', text: 'Velocity and predictability' },
      { letter: 'D', text: 'Customer focus and innovation' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q9', certificationId: 'safe', topic: 'art',
    text: 'What is the System Demo in SAFe?',
    options: [
      { letter: 'A', text: 'A demo for the portfolio leadership only' },
      { letter: 'B', text: 'An integrated demonstration of all team increments at the end of each Iteration' },
      { letter: 'C', text: 'A final release demo at the end of the PI' },
      { letter: 'D', text: 'A tool demonstration for new teams' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q10', certificationId: 'safe', topic: 'pi-planning',
    text: 'Which two outputs are produced by PI Planning? (Choose 2)',
    options: [
      { letter: 'A', text: 'Program Board showing team dependencies and milestones' },
      { letter: 'B', text: 'Individual developer task assignments' },
      { letter: 'C', text: 'Team PI Objectives with business value' },
      { letter: 'D', text: 'A fixed scope contract for the PI' },
    ],
    correctAnswer: ['A', 'C'], isMultiple: true,
  },
  {
    id: 'safe-q11', certificationId: 'safe', topic: 'lean-agile',
    text: 'What does "batch size reduction" mean in SAFe Lean thinking?',
    options: [
      { letter: 'A', text: 'Reducing the number of team members per team' },
      { letter: 'B', text: 'Delivering smaller increments of work more frequently to reduce risk and improve flow' },
      { letter: 'C', text: 'Limiting the size of the program backlog' },
      { letter: 'D', text: 'Reducing the number of features per release' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q12', certificationId: 'safe', topic: 'portfolio',
    text: 'What is an Epic in SAFe Portfolio?',
    options: [
      { letter: 'A', text: 'A large user story that spans multiple sprints' },
      { letter: 'B', text: 'A significant initiative requiring a Lean Business Case before implementation' },
      { letter: 'C', text: 'A collection of features for one team' },
      { letter: 'D', text: 'A PI Planning objective' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
]
