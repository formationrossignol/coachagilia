import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { Home } from './components/Home'
import { ScenarioSelector } from './components/ScenarioSelector'
import { SimulationScreen } from './components/SimulationScreen'
import { Debrief } from './components/Debrief'
import { QuizSelector } from './components/QuizSelector'
import { QuizScreen } from './components/QuizScreen'
import { QuizResults } from './components/QuizResults'
import { AteliersHome } from './components/AteliersHome'
import { ScrumGuideAtelier } from './components/ScrumGuideAtelier'
import { ConflictAtelier } from './components/ConflictAtelier'
import { DelegationPokerAtelier } from './components/DelegationPokerAtelier'

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulation" element={<ScenarioSelector />} />
        <Route path="/simulation/:id" element={<SimulationScreen />} />
        <Route path="/debrief" element={<Debrief />} />
        <Route path="/quiz" element={<QuizSelector />} />
        <Route path="/quiz/:examId" element={<QuizScreen />} />
        <Route path="/quiz/:examId/results" element={<QuizResults />} />
        <Route path="/ateliers" element={<AteliersHome />} />
        <Route path="/ateliers/scrum-guide" element={<ScrumGuideAtelier />} />
        <Route path="/ateliers/conflits" element={<ConflictAtelier />} />
        <Route path="/ateliers/delegation-poker" element={<DelegationPokerAtelier />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
