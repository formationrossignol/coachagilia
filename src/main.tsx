import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './components/gamification/gamification.css'

// Init theme before React renders — prevents flash of wrong theme
const stored = localStorage.getItem('scrum-sim-theme')
document.documentElement.setAttribute('data-theme', stored ?? 'dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
