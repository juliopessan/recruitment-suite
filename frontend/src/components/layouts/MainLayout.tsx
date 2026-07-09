import { Outlet } from 'react-router-dom'
import Navbar from '../common/Navbar'
import Sidebar from '../common/Sidebar'
import { useAppSelector } from '@/hooks/useRedux'

export default function MainLayout() {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen)

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
