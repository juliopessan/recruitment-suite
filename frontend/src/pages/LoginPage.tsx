import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppDispatch } from '@/hooks/useRedux'
import { setToken, setUser } from '@/store/slices/authSlice'
import { toast } from 'react-toastify'
import { StudioMark } from '@/components/studio/StudioMark'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Replace with actual login API call
      // For now, using mock auth
      if (email && password) {
        const mockToken = 'mock_token_' + Date.now()
        dispatch(setToken(mockToken))
        dispatch(
          setUser({
            id: '1',
            email,
            name: email.split('@')[0],
            role: 'recruiter',
          })
        )
        toast.success('Logged in successfully')
        navigate('/')
      } else {
        toast.error('Please enter email and password')
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden surface-studio flex flex-col">
      {/* Header */}
      <header className="border-b border-ink/10 px-6 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 font-extrabold text-lg tracking-tight"
        >
          <StudioMark />
          RECRUITMENT SUITE
        </motion.div>
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm text-ink-500 hover:text-ink font-medium"
        >
          ← Back
        </motion.button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          className="w-full max-w-md bg-white rounded-xl shadow-lg border border-ink/10 p-8"
        >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center mb-8"
        >
          <p className="eyebrow mb-2">WELCOME BACK</p>
          <h2 className="text-2xl font-extrabold tracking-tight">Log in to continue</h2>
          <p className="text-sm text-ink-500 mt-1">Access Recruitment Suite Studio</p>
        </motion.div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="btn-studio-primary w-full justify-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-ink-500 mt-6">
          Demo: Use any email and password
        </p>

        <div className="text-center mt-8 pt-6 border-t border-ink/10">
          <p className="text-sm text-ink-500 mb-3">New to Recruitment Suite?</p>
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-primary-600 font-medium hover:text-primary-700 text-sm"
          >
            Learn more about our platform →
          </motion.button>
        </div>
      </motion.div>
      </div>
    </div>
  )
}
