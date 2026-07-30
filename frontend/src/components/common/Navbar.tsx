import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { logout } from '@/store/slices/authSlice'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { Menu, LogOut, Home } from 'lucide-react'
import { StudioMark } from '@/components/studio/StudioMark'

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)

  const handleLogout = () => {
    dispatch(logout())
    setTimeout(() => {
      window.location.href = '/login'
    }, 100)
  }

  return (
    <nav className="bg-cream/95 backdrop-blur-sm shadow-sm border-b border-ink/10 sticky top-0 z-50">
      <div className="h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 hover:bg-ink/5 rounded-lg transition-colors"
            title="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <h1 className="flex items-center gap-2 font-extrabold text-lg whitespace-nowrap tracking-tight">
            <StudioMark size={20} />
            RECRUITMENT SUITE
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {token && (
            <>
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-ink/5 rounded-lg transition-colors text-ink-500"
                title="Go to dashboard"
              >
                <Home size={20} />
              </button>
              <div className="h-8 w-px bg-ink/10" />
              <div className="text-right hidden sm:block">
                <p className="font-medium text-ink text-sm">{user?.name || 'Account'}</p>
                <p className="text-xs text-ink-400 capitalize">{user?.role || 'Signed in'}</p>
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
