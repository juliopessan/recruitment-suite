import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, User, Bell, Lock, Trash2 } from 'lucide-react'
import { Page, StaggerItem } from '@/components/motion'
import { logout } from '@/store/slices/authSlice'

export default function SettingsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const sections = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Profile', description: 'Manage your profile information' },
        { label: 'Email', description: `Current: ${user?.email || 'Not set'}` },
      ],
    },
    {
      title: 'Preferences',
      icon: Bell,
      items: [
        { label: 'Notifications', description: 'Control notification settings' },
        { label: 'Theme', description: 'Choose between light and dark mode' },
      ],
    },
    {
      title: 'Security',
      icon: Lock,
      items: [
        { label: 'Change Password', description: 'Update your password' },
        { label: 'Active Sessions', description: 'Manage your active sessions' },
      ],
    },
  ]

  return (
    <Page className="space-y-8">
      <StaggerItem>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
      </StaggerItem>

      {sections.map((section, idx) => {
        const IconComponent = section.icon
        return (
          <StaggerItem key={idx}>
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <IconComponent size={24} className="text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              </div>
              <div className="space-y-3">
                {section.items.map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 4 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-300 hover:shadow-sm transition-all"
                  >
                    <h3 className="font-medium text-gray-900">{item.label}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </StaggerItem>
        )
      })}

      <StaggerItem>
        <div className="border-t border-gray-200 pt-8 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Danger Zone</h2>
          </div>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-red-50 border-2 border-red-200 hover:border-red-400 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </motion.button>
        </div>
      </StaggerItem>
    </Page>
  )
}
