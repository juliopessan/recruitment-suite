import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppDispatch } from '@/hooks/useRedux'
import { setToken, setUser } from '@/store/slices/authSlice'
import { toast } from 'react-toastify'

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
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-600">
      {/* Ambient animated blobs */}
      <motion.div
        aria-hidden
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 24, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-secondary-300/20 blur-3xl"
        animate={{ x: [0, -32, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        className="card w-full max-w-md relative z-10 backdrop-blur"
      >
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center mb-8"
        >
          Recruitment Suite
        </motion.h1>
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
            className="btn-primary w-full"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Demo: Use any email and password
        </p>
      </motion.div>
    </div>
  )
}
