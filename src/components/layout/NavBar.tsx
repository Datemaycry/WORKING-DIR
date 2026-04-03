import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Bibliothèque', icon: '📚' },
  { to: '/settings', label: 'Paramètres', icon: '⚙️' },
] as const

export default function NavBar() {
  return (
    <nav
      style={{ height: 'var(--navbar-height)' }}
      className="flex shrink-0 bg-[var(--color-surface)] border-t border-[var(--color-border)]"
    >
      {NAV_ITEMS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-0.5 text-xs transition-colors
             duration-[var(--duration-fast)]
             ${isActive
               ? 'text-[var(--color-accent)]'
               : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
             }`
          }
        >
          <span className="text-xl leading-none">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
