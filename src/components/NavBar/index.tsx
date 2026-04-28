import { useLocation, Link } from 'react-router-dom'
import { Zap, FileCheck, BookOpen, Sun, Moon, Layers } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const NAV_LINKS = [
  { to: '/simulation', label: 'Simulation', Icon: Zap },
  { to: '/quiz', label: 'Quiz PSM-1', Icon: FileCheck },
  { to: '/ateliers', label: 'Ateliers', Icon: BookOpen },
] as const

export function NavBar() {
  const { pathname } = useLocation()
  const { theme, toggle } = useTheme()

  return (
    <nav className="navbar" aria-label="Main">
      <Link to="/" className="navbar__brand" aria-label="Scrum Master Sim">
        <Layers size={18} strokeWidth={2} aria-hidden="true" className="navbar__brand-icon" />
        <span>Scrum Master Sim</span>
      </Link>

      <ul className="navbar__links">
        {NAV_LINKS.map(({ to, label, Icon }) => {
          const isActive = pathname === to || pathname.startsWith(to + '/')
          return (
            <li key={to}>
              <Link
                to={to}
                className={'navbar__link' + (isActive ? ' navbar__link--active' : '')}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={14} strokeWidth={2} aria-hidden="true" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>

      <button
        className="navbar__theme-toggle"
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      >
        {theme === 'dark'
          ? <Sun size={16} strokeWidth={2} />
          : <Moon size={16} strokeWidth={2} />}
      </button>
    </nav>
  )
}
