import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { logout } from '@/store/slices/authSlice'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { Menu, LogOut, Home } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    setTimeout(() => {
      window.location.href = '/login'
    }, 100)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-700">
            Recruitment Suite
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                title="Go to dashboard"
              >
                <Home size={20} />
              </button>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-right">
                <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                title="Sign out"
              >
                <LogOut size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
