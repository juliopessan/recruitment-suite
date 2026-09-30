import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { logout } from '@/store/slices/authSlice'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { PanelLeft, LogOut } from 'lucide-react'
import { Wordmark } from '@/components/studio/StudioMark'
import { ThemeToggle } from '@/components/studio/ThemeToggle'

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
    <nav className="bg-paper/95 backdrop-blur-sm border-b border-ink/15 sticky top-0 z-50">
      <div className="h-16 px-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="icon-btn -ml-3"
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <PanelLeft size={18} aria-hidden="true" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="min-w-0 min-h-target inline-flex items-center"
            aria-label="Recruitment Suite — dashboard"
          >
            <Wordmark size={22} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {token && (
            <>
              <div className="h-7 w-px bg-ink/15 mx-1" />
              <div className="text-right hidden sm:block mr-1">
                <p className="font-mono text-[11px] uppercase tracking-label text-ink truncate max-w-[180px]">
                  {user?.name || 'Account'}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-label text-ink-soft">
                  {user?.role || 'Signed in'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="icon-btn"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={18} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
