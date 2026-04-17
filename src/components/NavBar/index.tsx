import { useLocation, Link } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/simulation', label: 'Simulation' },
  { to: '/quiz', label: 'Quiz PSM-1' },
  { to: '/ateliers', label: 'Ateliers' },
] as const

export function NavBar() {
  const { pathname } = useLocation()
  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">
        Scrum Master Sim
      </Link>
      <ul className="navbar__links">
        {NAV_LINKS.map(({ to, label }) => {
          const isActive = pathname.startsWith(to)
          return (
            <li key={to}>
              <Link
                to={to}
                className={'navbar__link' + (isActive ? ' navbar__link--active' : '')}
                aria-current={isActive ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
