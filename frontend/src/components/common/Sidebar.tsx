import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  Sparkles,
  Users,
  Briefcase,
  CheckCircle,
  Settings,
  HelpCircle,
} from 'lucide-react'

interface NavItem {
  to: string
  icon: React.ReactNode
  label: string
}

const navItems: NavItem[] = [
  { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
  { to: '/analyze', icon: <Sparkles size={20} />, label: 'Analyze' },
  { to: '/candidates', icon: <Users size={20} />, label: 'Candidates' },
  { to: '/jobs', icon: <Briefcase size={20} />, label: 'Jobs' },
  { to: '/evaluations', icon: <CheckCircle size={20} />, label: 'Evaluations' },
]

function isActive(pathname: string, to: string): boolean {
  return to === '/' ? pathname === '/' : pathname.startsWith(to)
}

export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const active = isActive(pathname, item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                active ? 'text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-lg bg-primary-50 border border-primary-100"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{item.icon}</span>
              <span className="relative z-10 font-medium">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200 space-y-1">
        <NavLink
          to="/settings"
          className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
            pathname === '/settings'
              ? 'text-primary-600'
              : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
          }`}
        >
          {pathname === '/settings' && (
            <motion.span
              layoutId="sidebar-active-pill"
              className="absolute inset-0 rounded-lg bg-primary-50 border border-primary-100"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <span className="relative z-10"><Settings size={20} /></span>
          <span className="relative z-10 font-medium">Settings</span>
        </NavLink>
        <a
          href="https://github.com/juliopessan/recruitment-suite"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors"
        >
          <HelpCircle size={20} />
          <span className="font-medium">Help</span>
        </a>
      </div>
    </aside>
  )
}
