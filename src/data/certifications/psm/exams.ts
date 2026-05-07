import type { CertQuestion } from '../types'
import { questions as exam1 } from '../../quizzes/exam-1'
import { questions as exam2 } from '../../quizzes/exam-2'
import { questions as exam3 } from '../../quizzes/exam-3'

const topicMap: Record<string, string> = {
  // exam-1
  'e1-q1': 'scaling',          // "multiple teams working together on the same product"
  'e1-q2': 'done-quality',     // "non-functional requirements"
  'e1-q3': 'scrum-team',       // "responsibilities of testers in a Development Team"
  'e1-q4': 'scrum-artifacts',  // "Who owns the Sprint Backlog"
  'e1-q5': 'scrum-artifacts',  // burndown / release backlog
  'e1-q6': 'scrum-team',       // "responsible for tracking the remaining work"
  'e1-q7': 'scrum-team',       // "recommended size for a Development Team"
  'e1-q8': 'scaling',          // "multiple Scrum Teams work from the same Product Backlog"
  'e1-q9': 'scrum-artifacts',  // "product increment must be released"
  'e1-q10': 'scrum-team',      // "responsible for engaging the stakeholders" (Product Owner)
  'e1-q11': 'scrum-events',    // "three questions answered at the Daily Scrum"
  'e1-q12': 'scrum-team',      // "Cross-functional teams"
  'e1-q13': 'done-quality',    // "definition of Done"
  'e1-q14': 'done-quality',    // "improve their definition of Done"
  'e1-q15': 'scrum-events',    // "Sprint Review" + stakeholders meeting
  'e1-q16': 'coaching',        // "list of open impediments" + Scrum Master resolving
  'e1-q17': 'done-quality',    // "definition of Done"
  'e1-q18': 'scrum-events',    // "When is a Sprint cancelled" (Product Owner)
  'e1-q19': 'scrum-events',    // "main reason for the Scrum Master to be at the Daily Scrum"
  'e1-q20': 'scrum-artifacts', // "What is included in the Sprint Backlog"
  'e1-q21': 'scrum-theory',    // "Development Team's progress unpredictable"
  'e1-q22': 'scrum-team',      // "Product Owner" responsibility when CEO asks
  'e1-q23': 'done-quality',    // "definition of Done"
  'e1-q24': 'scrum-team',      // "competencies and skills" / Development Team
  'e1-q25': 'scrum-events',    // "factors for establishing Sprint length" (timebox)
  'e1-q26': 'scrum-events',    // "time required after a Sprint"
  'e1-q27': 'scrum-events',    // "Sprint Planning meeting" overload
  'e1-q28': 'scrum-team',      // "Who creates a Product Backlog item's estimate"
  'e1-q29': 'coaching',        // "facilitating Development Team decisions and removing impediments"
  'e1-q30': 'scrum-events',    // "topics covered in Sprint Planning"
  'e1-q31': 'scrum-events',    // "output from Sprint Planning" / Sprint Goal
  'e1-q32': 'scrum-team',      // "Development Team membership change"
  'e1-q33': 'scrum-team',      // "Product Owner and the Development Team" over-committed
  'e1-q34': 'scrum-team',      // "self-organizing Development Team"
  'e1-q35': 'scrum-team',      // "phrase best describes a Product Owner"
  'e1-q36': 'scrum-events',    // "topics discussed in Sprint Review"
  'e1-q37': 'done-quality',    // "security concerns" + definition of Done
  'e1-q38': 'scrum-events',    // "Daily Scrum" frequency concerns
  'e1-q39': 'scrum-artifacts', // "Product Backlog is ordered by"
  'e1-q40': 'scrum-events',    // "Development Team cancel a Sprint"
  'e1-q41': 'coaching',        // Scrum Master teaches coordination / "facilitate"
  'e1-q42': 'coaching',        // Scrum Master + "Definition of Done" / infrastructure coaching
  'e1-q43': 'coaching',        // Scrum Master "Allow the Development Team to self-manage"
  'e1-q44': 'scrum-events',    // "Sprint Goal is a result of Sprint Planning"
  'e1-q45': 'scaling',         // "divide a group of 100 people into multiple Development Teams"
  'e1-q46': 'scrum-theory',    // "benefits of self-organization"
  'e1-q47': 'scrum-theory',    // "Scrum is a methodology"
  'e1-q48': 'scrum-artifacts', // "new work added to the Sprint Backlog during a Sprint"
  'e1-q49': 'scrum-team',      // "removing the team member" / responsibility
  'e1-q50': 'scrum-events',    // "Sprint Retrospective should be held"
  'e1-q51': 'scrum-events',    // "feedback loops in Scrum" (Daily Scrum, Sprint Review, Sprint Retrospective)
  'e1-q52': 'scrum-artifacts', // "Product Owner must release each Increment"
  'e1-q53': 'done-quality',    // "deliver at end of Sprint" / done increment
  'e1-q54': 'scrum-team',      // "Product Owner role" responsibilities
  'e1-q55': 'scrum-events',    // "required by Scrum" → Sprint Retrospective
  'e1-q56': 'scrum-events',    // "properties of the Daily Scrum"
  'e1-q57': 'scrum-events',    // "second Sprint start"
  'e1-q58': 'scrum-team',      // "collaborate with the Product Owner"
  'e1-q59': 'scrum-team',      // "Who is on the Scrum Team"
  'e1-q60': 'scrum-artifacts', // "which best describes the Product Backlog"
  'e1-q61': 'scrum-team',      // "Product Owner's responsibility"
  'e1-q62': 'done-quality',    // "Product Backlog item considered complete" / no work remaining
  'e1-q63': 'scrum-artifacts', // "Sprint Backlog item ownership" / Development Team
  'e1-q64': 'scaling',         // "divide 100 people into multiple Development Teams"
  'e1-q65': 'coaching',        // Scrum Master handling status report request / "facilitate"
  'e1-q66': 'done-quality',    // "non-functional requirements" / every Increment
  'e1-q67': 'scaling',         // "forming into multiple Scrum Teams"
  'e1-q68': 'scrum-events',    // "time boxed events in Scrum"
  'e1-q69': 'scrum-team',      // "roles on a Scrum Team"
  'e1-q70': 'coaching',        // Scrum Master "facilitate direct collaboration"
  'e1-q71': 'scrum-events',    // "Sprint Retrospective" Scrum Master responsible
  'e1-q72': 'scrum-team',      // "Scrum Master responsible" / process
  'e1-q73': 'scrum-team',      // "who determines how work is performed" / Development Team
  'e1-q74': 'scaling',         // "two Scrum Teams added" / productivity impact
  'e1-q75': 'scrum-events',    // "length of the Sprint" (timebox)
  'e1-q76': 'scrum-artifacts', // "Sprint Burndown charts"
  'e1-q77': 'scrum-team',      // "role called Project Manager" in Scrum
  'e1-q78': 'scrum-events',    // "Daily Scrum outcomes"
  'e1-q79': 'scaling',         // "six new Scrum Teams" / one Product Backlog
  'e1-q80': 'scrum-events',    // "Development Team do during first Sprint"

  // exam-2
  'e2-q1': 'scrum-team',       // "responsible for managing the progress of work during a Sprint"
  'e2-q2': 'scrum-events',     // "maximum length of the Sprint Review" (timebox)
  'e2-q3': 'scrum-events',     // "length of a Sprint should be" (timebox)
  'e2-q4': 'scrum-team',       // "no role called project manager"
  'e2-q5': 'scrum-events',     // "Sprint abnormally terminated" / Sprint Goal obsolete
  'e2-q6': 'scrum-artifacts',  // "Product Backlog is ordered by"
  'e2-q7': 'scrum-team',       // "Product Owner" knows most about progress
  'e2-q8': 'scrum-theory',     // "organization adopts Scrum" / terminology change
  'e2-q9': 'scrum-team',       // CEO item + "Product Owner" responsibility
  'e2-q10': 'scrum-events',    // "time-box for Daily Scrum" (timebox)
  'e2-q11': 'scrum-events',    // "when does the next Sprint begin"
  'e2-q12': 'coaching',        // "Scrum Master keeps Development Team at highest productivity" / removing impediments / facilitating
  'e2-q13': 'scaling',         // "multiple teams work together on same product" / Product Backlog
  'e2-q14': 'scrum-theory',    // "purpose of a Sprint is to produce done increment"
  'e2-q15': 'scrum-theory',    // "empirical process control"
  'e2-q16': 'scrum-team',      // "Product Owner's responsibility" / optimizing value
  'e2-q17': 'scrum-events',    // "Daily Scrum held at same time and place"
  'e2-q18': 'scrum-events',    // "time-box for Sprint Planning meeting" (timebox)
  'e2-q19': 'scrum-team',      // "roles on a Scrum Team"
  'e2-q20': 'scrum-team',      // "Development Team membership should change"
  'e2-q21': 'scrum-events',    // "Scrum Master at Daily Scrum"
  'e2-q22': 'scrum-events',    // "required to attend the Daily Scrum"
  'e2-q23': 'scrum-artifacts', // "final say on order of Product Backlog"
  'e2-q24': 'scrum-artifacts', // "product increment released to production"
  'e2-q25': 'done-quality',    // "many Development Teams" + "definition of done" combined
  'e2-q26': 'scrum-events',    // "when is a Sprint over" (timebox)
  'e2-q27': 'scrum-team',      // "Product Owner and Development Team" review Sprint work
  'e2-q28': 'scrum-team',      // "Who is on the Scrum Team"
  'e2-q29': 'scrum-artifacts', // "Sprint Backlog Items ownership"
  'e2-q30': 'scrum-team',      // "Development Team should have all the skills" / cross-functional
  'e2-q31': 'scrum-events',    // "Development Team during the first Sprint"
  'e2-q32': 'scrum-team',      // "recommended size for Development Team"
  'e2-q33': 'scrum-theory',    // "role of Management in Scrum"
  'e2-q34': 'scrum-artifacts', // "Sprint Backlog changes during Sprint"
  'e2-q35': 'done-quality',    // "how much work must Development Team do" / definition of done
  'e2-q36': 'scrum-events',    // "Sprint Review" description
  'e2-q37': 'scrum-theory',    // "best describes Scrum"
  'e2-q38': 'scrum-events',    // "what does it mean to say an event has a time-box" (timebox)
  'e2-q39': 'scrum-theory',    // "three pillars of empirical process control"
  'e2-q40': 'scrum-events',    // "Daily Scrum Scrum Master role" / timebox

  // exam-3
  'e3-q1': 'scaling',          // "many Scrum Teams working on same product" / increments integrated
  'e3-q2': 'scrum-events',     // "topics discussed in Sprint Review"
  'e3-q3': 'scrum-artifacts',  // burndown chart / product backlog
  'e3-q4': 'done-quality',     // "security concerns" + "definition of Done"
  'e3-q5': 'scrum-artifacts',  // "Product Backlog is ordered by"
  'e3-q6': 'scrum-events',     // "Sprint Backlog defined during Sprint Planning"
  'e3-q7': 'scrum-events',     // "time required after Sprint"
  'e3-q8': 'scrum-events',     // "when does next Sprint begin"
  'e3-q9': 'scrum-team',       // "estimates made by Development Team"
  'e3-q10': 'scrum-team',      // "Product Owner knows most about progress"
  'e3-q11': 'scrum-team',      // "responsible for clearly expressing Product Backlog Items" (Product Owner)
  'e3-q12': 'scaling',         // "divide 100 people into multiple Development Teams"
  'e3-q13': 'scrum-events',    // "Sprint Retrospective" / Product Owner responsibility
  'e3-q14': 'coaching',        // Scrum Master "facilitating productive and useful retrospectives"
  'e3-q15': 'scrum-team',      // "responsible for managing progress during Sprint" / Development Team
  'e3-q16': 'scrum-events',    // "between end of Sprint and start of next Sprint" / Sprints
  'e3-q17': 'scrum-team',      // "responsibilities of self-organizing Development Team"
  'e3-q18': 'scrum-theory',    // "ways Scrum promotes self-organization"
  'e3-q19': 'scaling',         // "multiple Scrum Teams work from same Product Backlog"
  'e3-q20': 'scrum-events',    // "topics covered in Sprint Planning"
  'e3-q21': 'coaching',        // "Scrum Master role during Sprint" / "Remove impediments" + "facilitate"
  'e3-q22': 'scrum-team',      // "true about the Product Owner role"
  'e3-q23': 'scrum-team',      // "Product Owner and Development Team" / over-committed
  'e3-q24': 'scrum-artifacts', // "Product Owner must release each increment"
  'e3-q25': 'scrum-team',      // "cross-functional" Development Team
  'e3-q26': 'scrum-events',    // "length of the Sprint" (timebox)
  'e3-q27': 'done-quality',    // "implementation of Product Backlog item considered complete" / no work remaining
  'e3-q28': 'scrum-events',    // "feedback loops in Scrum" (Daily Scrum, Sprint Review, Sprint Retrospective)
  'e3-q29': 'scrum-events',    // "second Sprint start"
  'e3-q30': 'scrum-team',      // "cross-functional teams"
  'e3-q31': 'coaching',        // Scrum Master + "Daily Scrum" / coach on importance / "facilitate"
  'e3-q32': 'scrum-events',    // "required by Scrum" → Sprint Retrospective
  'e3-q33': 'scaling',         // "multiple teams work on same product" / Product Backlog
  'e3-q34': 'coaching',        // "list of open impediments" Scrum Master
  'e3-q35': 'done-quality',    // "improve their definition of Done"
  'e3-q36': 'scrum-events',    // "Development Team cancel a Sprint"
  'e3-q37': 'scrum-team',      // "who determines how work is performed" / Development Team
  'e3-q38': 'done-quality',    // "definition of Done" / what done means
  'e3-q39': 'coaching',        // Scrum Master "facilitate direct collaboration"
  'e3-q40': 'scrum-events',    // "time boxed events in Scrum"
  'e3-q41': 'scrum-events',    // "properties of the Daily Scrum"
  'e3-q42': 'scrum-theory',    // "Scrum is a methodology"
  'e3-q43': 'scrum-team',      // "roles on a Scrum Team"
  'e3-q44': 'scrum-team',      // "responsible for engaging the stakeholders" (Product Owner)
  'e3-q45': 'scrum-events',    // "when is a Sprint over" (timebox)
  'e3-q46': 'done-quality',    // "transparency of an Increment" / definition of Done
  'e3-q47': 'scrum-team',      // CEO item + "Product Owner" responsibility
  'e3-q48': 'done-quality',    // "how much work" / definition of Done
  'e3-q49': 'coaching',        // "Scrum Master keeps team at highest productivity" / "removing impediments" / "facilitate"
  'e3-q50': 'scrum-team',      // "responsibilities of testers in a Development Team"
  'e3-q51': 'scrum-team',      // "collaborate with the Product Owner"
  'e3-q52': 'scrum-team',      // "creating Development Teams consistent with Scrum values" / self-organize
  'e3-q53': 'scrum-events',    // "Sprint Planning meeting" overload
  'e3-q54': 'scrum-team',      // "self-organizing Development Team"
  'e3-q55': 'coaching',        // Scrum Master helps Product Owner with backlog ordering
  'e3-q56': 'scrum-events',    // "Product Owner present at Daily Scrum"
  'e3-q57': 'scrum-artifacts', // "Product Increment released to production"
  'e3-q58': 'scrum-artifacts', // "best describes the Product Backlog"
  'e3-q59': 'scrum-events',    // "Sprint Retrospective should be held"
  'e3-q60': 'scrum-theory',    // "best describes Scrum"
  'e3-q61': 'scrum-events',    // "time-box for Daily Scrum" (timebox)
  'e3-q62': 'scrum-events',    // "Development Team during first Sprint"
  'e3-q63': 'scrum-team',      // "true about the Scrum Master role"
  'e3-q64': 'scrum-artifacts', // "Who owns the Sprint Backlog"
  'e3-q65': 'scrum-team',      // "Product Owner determines how many items Development Team selects"
  'e3-q66': 'coaching',        // "Scrum Master keeps team at highest productivity" / "removing impediments" / "facilitate"
  'e3-q67': 'scrum-artifacts', // "Sprint Burndown Charts"
  'e3-q68': 'done-quality',    // "definition of Done" purpose
  'e3-q69': 'scrum-artifacts', // "who determines when to update Sprint Backlog"
  'e3-q70': 'scaling',         // "six new Scrum Teams" / one Product Backlog
  'e3-q71': 'scrum-team',      // "Development Team membership change"
  'e3-q72': 'scrum-theory',    // "Sprint 0" (does not exist)
  'e3-q73': 'scrum-team',      // "Development Team responsible for"
  'e3-q74': 'scrum-events',    // "Daily Scrum" Scrum Master role / timebox
  'e3-q75': 'scrum-artifacts', // "Sprint Backlog item ownership"
  'e3-q76': 'scrum-events',    // "Sprint abnormally terminated"
  'e3-q77': 'done-quality',    // "change definition of Done" / Sprint Retrospective
  'e3-q78': 'scrum-events',    // "output from Sprint Planning" / Sprint Goal
  'e3-q79': 'scrum-events',    // "Sprint Retrospective" Scrum Master responsible
  'e3-q80': 'coaching',        // Scrum Master "ask person to share issue with team" / facilitate
}

function tag(q: (typeof exam1)[0]): CertQuestion {
  return { ...q, certificationId: 'psm', topic: topicMap[q.id] ?? 'scrum-theory' }
}

export const psmQuestions: CertQuestion[] = [
  ...exam1.map(tag),
  ...exam2.map(tag),
  ...exam3.map(tag),
]
