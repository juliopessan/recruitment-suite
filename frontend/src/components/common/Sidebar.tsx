import { Link } from 'react-router-dom'
import {
  Home,
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
  { to: '/candidates', icon: <Users size={20} />, label: 'Candidates' },
  { to: '/jobs', icon: <Briefcase size={20} />, label: 'Jobs' },
  { to: '/evaluations', icon: <CheckCircle size={20} />, label: 'Evaluations' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200 space-y-2">
        <button className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        <button className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <HelpCircle size={20} />
          <span className="font-medium">Help</span>
        </button>
      </div>
    </aside>
  )
}
