import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { logout } from '@/store/slices/authSlice'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { PanelLeft, LogOut } from 'lucide-react'
import { Wordmark } from '@/components/studio/StudioMark'

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
            className="p-2 -ml-2 text-ink-400 hover:text-ink hover:bg-ink/[0.05] transition-colors"
            title="Toggle sidebar"
          >
            <PanelLeft size={18} />
          </button>
          <button onClick={() => navigate('/')} className="min-w-0" title="Dashboard">
            <Wordmark size={22} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {token && (
            <>
              <div className="text-right hidden sm:block">
                <p className="font-mono text-[11px] uppercase tracking-label text-ink truncate max-w-[180px]">
                  {user?.name || 'Account'}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-label text-ink-400">
                  {user?.role || 'Signed in'}
                </p>
              </div>
              <div className="h-7 w-px bg-ink/15" />
              <button
                onClick={handleLogout}
                className="p-2 text-ink-400 hover:text-rust-600 hover:bg-rust-50 transition-colors"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
