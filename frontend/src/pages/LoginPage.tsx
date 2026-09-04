import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useAppDispatch } from '@/hooks/useRedux'
import { setToken, setUser } from '@/store/slices/authSlice'
import { toast } from 'react-toastify'
import { Wordmark } from '@/components/studio/StudioMark'
import { SplitHeading } from '@/components/studio/SplitHeading'

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
      // TODO: Replace with actual login API call — mock auth for now.
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
        toast.success('Signed in')
        navigate('/')
      } else {
        toast.error('Enter an email and a password')
      }
    } catch {
      toast.error('Sign in failed. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      {/* Header */}
      <header className="border-b border-ink/15">
        <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <button onClick={() => navigate('/')}>
            <Wordmark />
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-label text-ink-400 hover:text-ink transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Statement */}
          <div className="hidden lg:block">
            <p className="rule-eyebrow mb-8">Workspace access</p>
            <SplitHeading
              as="h1"
              animateOnMount
              lines={['Pick up where', { text: 'the chain left off.', italic: true }]}
              className="text-[clamp(2.25rem,4vw,3.25rem)] font-extrabold tracking-tight leading-[1.0] mb-8"
            />
            <div className="border-t border-ink/15">
              {[
                ['Analyze', 'CV, LinkedIn and a job description in one pass'],
                ['Evaluations', 'Every scored candidate, with its evidence trail'],
                ['Reports', 'Print-ready, EN-US or PT-BR'],
              ].map(([title, body], i) => (
                <div key={title} className="py-4 border-b border-ink/15 flex gap-5">
                  <span className="font-mono text-[11px] tracking-label text-ink-300 pt-1 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-label text-ink mb-1">
                      {title}
                    </p>
                    <p className="text-sm text-ink-500">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto studio-card p-8 md:p-10"
          >
            <p className="rule-eyebrow mb-6">Sign in</p>
            <h2 className="text-2xl font-extrabold tracking-tight mb-8">
              Log in to continue
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="field-label">
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
              </div>

              <div>
                <label htmlFor="password" className="field-label">
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
              </div>

              <button type="submit" disabled={isLoading} className="btn-studio-primary w-full">
                {isLoading ? 'Signing in…' : 'Log in'}
                {!isLoading && <ArrowRight size={17} />}
              </button>
            </form>

            <div className="mt-8 pt-6 rule flex items-center justify-between gap-4">
              <p className="font-mono text-[11px] uppercase tracking-label text-ink-400">
                Demo · any credentials
              </p>
              <button
                onClick={() => navigate('/')}
                className="font-mono text-[11px] uppercase tracking-label text-ink-500 hover:text-rust-600 transition-colors"
              >
                What is this? →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
