import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ScenarioSelector } from './components/ScenarioSelector'
import { SimulationScreen } from './components/SimulationScreen'
import { Debrief } from './components/Debrief'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScenarioSelector />} />
        <Route path="/simulation/:id" element={<SimulationScreen />} />
        <Route path="/debrief" element={<Debrief />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
