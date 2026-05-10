import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { GamificationToast } from './components/gamification/GamificationToast'
import { Home } from './components/Home'
import { ScenarioSelector } from './components/ScenarioSelector'
import { SimulationScreen } from './components/SimulationScreen'
import { Debrief } from './components/Debrief'
import { QuizScreen } from './components/QuizScreen'
import { QuizResults } from './components/QuizResults'
import { AteliersHome } from './components/AteliersHome'
import { WorkshopCategoryPage } from './components/WorkshopCategoryPage'
import { ScrumGuideAtelier } from './components/ScrumGuideAtelier'
import { ConflictAtelier } from './components/ConflictAtelier'
import { DelegationPokerAtelier } from './components/DelegationPokerAtelier'
import { GrowModelAtelier } from './components/GrowModelAtelier'
import { StakeholderMappingAtelier } from './components/StakeholderMappingAtelier'
import { AskTellAtelier } from './components/AskTellAtelier'
import { MovingMotivatorsAtelier } from './components/MovingMotivatorsAtelier'
import { IshikawaAtelier } from './components/IshikawaAtelier'
import { TroikaConsultingAtelier } from './components/TroikaConsultingAtelier'
import { SBIAtelier } from './components/SBIAtelier'
import { TRIZAtelier } from './components/TRIZAtelier'
import { CynefinFrameworkAtelier } from './components/CynefinFrameworkAtelier'
import { PowerfulQuestionsAtelier } from './components/PowerfulQuestionsAtelier'
import { SolutionFocusedAtelier } from './components/SolutionFocusedAtelier'
import { ProgressPage } from './pages/gamification/ProgressPage'
import { SkillsPage } from './pages/gamification/SkillsPage'
import { BadgesPage } from './pages/gamification/BadgesPage'
import { PathsPage } from './pages/gamification/PathsPage'
import { PathDetailPage } from './pages/gamification/PathDetailPage'
import { ChallengesPage } from './pages/gamification/ChallengesPage'
import { PortfolioPage } from './pages/gamification/PortfolioPage'

import { AdminPage } from './pages/AdminPage'
import { CertificationHub } from './components/CertificationHub'
import { CertificationPortal } from './components/CertificationPortal'
import { TopicPracticeScreen } from './components/TopicPracticeScreen'
function Layout() {
  return (
    <>
      <NavBar />
      <GamificationToast />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/simulation', element: <ScenarioSelector /> },
      { path: '/simulation/:id', element: <SimulationScreen /> },
      { path: '/debrief', element: <Debrief /> },
      { path: '/quiz', element: <Navigate to="/certifications" replace /> },
      { path: '/quiz/:examId', element: <QuizScreen /> },
      { path: '/quiz/:examId/results', element: <QuizResults /> },
      { path: '/certifications', element: <CertificationHub /> },
      { path: '/certifications/:certId', element: <CertificationPortal /> },
      { path: '/certifications/:certId/topic/:topicSlug', element: <TopicPracticeScreen /> },
      { path: '/ateliers', element: <AteliersHome /> },
      { path: '/ateliers/scrum-guide', element: <ScrumGuideAtelier /> },
      { path: '/ateliers/conflits', element: <ConflictAtelier /> },
      { path: '/ateliers/delegation-poker', element: <DelegationPokerAtelier /> },
      { path: '/ateliers/grow-model', element: <GrowModelAtelier /> },
      { path: '/ateliers/stakeholder-mapping', element: <StakeholderMappingAtelier /> },
      { path: '/ateliers/ask-vs-tell', element: <AskTellAtelier /> },
      { path: '/ateliers/moving-motivators', element: <MovingMotivatorsAtelier /> },
      { path: '/ateliers/ishikawa', element: <IshikawaAtelier /> },
      { path: '/ateliers/troika-consulting', element: <TroikaConsultingAtelier /> },
      { path: '/ateliers/sbi', element: <SBIAtelier /> },
      { path: '/ateliers/triz', element: <TRIZAtelier /> },
      { path: '/ateliers/cynefin-framework', element: <CynefinFrameworkAtelier /> },
      { path: '/ateliers/powerful-questions', element: <PowerfulQuestionsAtelier /> },
      { path: '/ateliers/solution-focused', element: <SolutionFocusedAtelier /> },
      { path: '/ateliers/categories/:slug', element: <WorkshopCategoryPage /> },
      { path: '/progress', element: <ProgressPage /> },
      { path: '/skills', element: <SkillsPage /> },
      { path: '/badges', element: <BadgesPage /> },
      { path: '/paths', element: <PathsPage /> },
      { path: '/paths/:slug', element: <PathDetailPage /> },
      { path: '/challenges', element: <ChallengesPage /> },
      { path: '/portfolio', element: <PortfolioPage /> },
      { path: '/admin', element: <AdminPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
