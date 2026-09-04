import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutGrid, Play, Users, Briefcase, ClipboardCheck, Settings, ExternalLink } from 'lucide-react'

interface NavItem {
  to: string
  num: string
  icon: React.ReactNode
  label: string
}

const navItems: NavItem[] = [
  { to: '/', num: '00', icon: <LayoutGrid size={16} />, label: 'Dashboard' },
  { to: '/analyze', num: '01', icon: <Play size={16} />, label: 'Analyze' },
  { to: '/candidates', num: '02', icon: <Users size={16} />, label: 'Candidates' },
  { to: '/jobs', num: '03', icon: <Briefcase size={16} />, label: 'Jobs' },
  { to: '/evaluations', num: '04', icon: <ClipboardCheck size={16} />, label: 'Evaluations' },
]

function isActive(pathname: string, to: string): boolean {
  return to === '/' ? pathname === '/' : pathname.startsWith(to)
}

/** Row shared by the numbered nav and the footer links. */
function Row({
  active,
  num,
  icon,
  label,
}: {
  active: boolean
  num?: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <>
      {active && (
        <motion.span
          layoutId="sidebar-active-block"
          className="absolute inset-0 bg-ink"
          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
        />
      )}
      <span
        className={`relative z-10 font-mono text-[10px] tracking-label w-5 shrink-0 ${
          active ? 'text-paper/50' : 'text-ink-300'
        }`}
      >
        {num}
      </span>
      <span className={`relative z-10 shrink-0 ${active ? 'text-paper' : 'text-ink-400'}`}>
        {icon}
      </span>
      <span
        className={`relative z-10 font-mono text-[11px] uppercase tracking-label truncate ${
          active ? 'text-paper' : 'text-ink-500 group-hover:text-ink'
        }`}
      >
        {label}
      </span>
    </>
  )
}

export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="w-64 bg-paper border-r border-ink/15 flex flex-col h-screen">
      <div className="px-5 pt-6 pb-4">
        <p className="rule-eyebrow">Workspace</p>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(pathname, item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="group relative flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-ink/[0.04]"
            >
              <Row active={active} num={item.num} icon={item.icon} label={item.label} />
            </NavLink>
          )
        })}
      </nav>

      <div className="px-3 py-4 mx-3 mb-2 border-t border-ink/15 space-y-0.5">
        <NavLink
          to="/settings"
          className="group relative flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-ink/[0.04]"
        >
          <Row
            active={pathname === '/settings'}
            num="—"
            icon={<Settings size={16} />}
            label="Settings"
          />
        </NavLink>
        <a
          href="https://github.com/juliopessan/recruitment-suite"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-ink/[0.04]"
        >
          <Row active={false} num="—" icon={<ExternalLink size={16} />} label="Source" />
        </a>
      </div>
    </aside>
  )
}
