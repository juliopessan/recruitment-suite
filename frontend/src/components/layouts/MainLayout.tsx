import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '../common/Navbar'
import Sidebar from '../common/Sidebar'
import { useAppSelector } from '@/hooks/useRedux'

export default function MainLayout() {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen)
  const location = useLocation()

  return (
    <div className="flex h-screen bg-gray-50">
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="overflow-hidden"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={location.pathname}>
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
