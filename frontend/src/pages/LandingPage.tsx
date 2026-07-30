import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { logout } from '@/store/slices/authSlice'
import {
  Brain,
  Zap,
  Target,
  Shield,
  Clock,
  TrendingUp,
  ArrowRight,
  Sparkles,
  LogOut,
} from 'lucide-react'
import { Page, Reveal, StaggerItem, LiftCard, AnimatedNumber, scoreColor } from '@/components/motion'
import { PipelineDiagram } from '@/components/studio/PipelineDiagram'
import { Marquee } from '@/components/studio/Marquee'
import { StudioMark } from '@/components/studio/StudioMark'
import { SplitHeading } from '@/components/studio/SplitHeading'

export default function LandingPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)

  const handleLogout = () => {
    dispatch(logout())
    window.location.reload()
  }

  const features = [
    {
      icon: Brain,
      title: 'Multi-Agent Evaluation',
      description:
        'Five specialized AI agents analyze profile fit, technical skills, culture alignment, references, and the final recommendation in parallel.',
    },
    {
      icon: Zap,
      title: 'Instant Analysis',
      description:
        'Upload a CV or provide a LinkedIn profile, paste the job description, and get objective scoring in seconds — not hours.',
    },
    {
      icon: Target,
      title: 'Objective Scoring',
      description:
        'Eliminate bias with AI-powered skill matching, experience assessment, and cultural fit analysis based on your job requirements.',
    },
    {
      icon: Shield,
      title: 'Evidence-Based Insights',
      description:
        'Each evaluation includes key strengths, addressable gaps, critical flags, and a personalized onboarding plan.',
    },
    {
      icon: Clock,
      title: 'Faster Hiring Cycles',
      description:
        'Reduce screening time from days to minutes. Process more candidates objectively and identify top fits instantly.',
    },
    {
      icon: TrendingUp,
      title: 'Data-Driven Decisions',
      description:
        'Track evaluation metrics, GO rates, and hiring outcomes to optimize your recruitment strategy over time.',
    },
  ]

  const pipelineSteps = [
    { num: '01', title: 'Profile Fit', sub: 'Pria' },
    { num: '02', title: 'Technical Skills', sub: 'Ada' },
    { num: '03', title: 'Culture Fit', sub: 'Cass' },
    { num: '04', title: 'References', sub: 'Remy' },
    { num: '05', title: 'Recommendation', sub: 'Nova' },
  ]

  return (
    <div className="min-h-screen surface-studio">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2.5 font-extrabold text-lg tracking-tight"
          >
            <StudioMark />
            RECRUITMENT SUITE
          </motion.div>
          <div className="flex items-center gap-4">
            {token ? (
              <>
                <span className="text-sm text-ink-500 hidden sm:inline">
                  Welcome, <span className="font-medium text-ink">{user?.name || 'back'}</span>
                </span>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-md border border-red-600 text-red-600 font-medium hover:bg-red-50 transition-all flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-md border border-ink text-ink font-semibold hover:bg-ink hover:text-cream transition-all"
              >
                Sign In
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Page className="max-w-6xl mx-auto px-4 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow mb-8">RECRUITMENT SUITE STUDIO</p>

            <SplitHeading
              as="h1"
              lines={['Candidates', 'in.', 'Decisions out.']}
              accentFrom={2}
              delay={0.1}
              className="text-6xl md:text-7xl font-extrabold leading-[0.95] mb-8 tracking-tight"
            />

            <p className="text-lg text-ink-500 mb-10 max-w-lg leading-relaxed">
              An AI-powered evaluation workspace that turns a CV and a job description into a profile
              assessment, a skills score, a culture-fit read and a hiring recommendation — then ships
              the whole analysis as one traceable report.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42 }}
            >
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="btn-studio-primary"
              >
                Explore the system
                <ArrowRight size={18} />
              </motion.button>
              <motion.a
                href="#how-it-works"
                whileHover={{ x: 2 }}
                className="btn-studio-secondary"
              >
                See the proof
                <ArrowRight size={16} className="rotate-90" />
              </motion.a>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-x-3 gap-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              {['FIVE CHAINED AGENTS', 'OBJECTIVE SCORING', 'EVIDENCE-BASED'].map((tag) => (
                <span key={tag} className="eyebrow text-ink-400 whitespace-nowrap">
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            id="how-it-works"
          >
            <PipelineDiagram
              input={{ label: 'INPUT', title: 'CV / LinkedIn', meta: 'PDF · DOCX · URL' }}
              steps={pipelineSteps}
              output={{ label: 'OUTPUT', title: 'One scorecard', meta: 'Hiring decision + evidence trail' }}
            />
          </motion.div>
        </div>
      </Page>

      <Marquee
        items={[
          'OBJECTIVE SCORING',
          'EVIDENCE-BASED',
          'FIVE CHAINED AGENTS',
          'BIAS-FREE SCREENING',
          'TRACEABLE REPORTS',
        ]}
      />

      {/* Stats Section */}
      <section className="py-24 border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Agents Working in Parallel', value: 5, suffix: '' },
                { label: 'Seconds to Evaluate', value: 12, suffix: 's' },
                { label: 'Candidate Profile Elements', value: 10, suffix: '+' },
              ].map((stat, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="studio-card p-8 text-center hover:border-primary-400 transition-colors"
                  >
                    <div className="text-4xl md:text-5xl font-extrabold text-primary-500 mb-2">
                      <AnimatedNumber value={stat.value} suffix={stat.suffix} countOnView />
                    </div>
                    <p className="text-ink-500 font-medium">{stat.label}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <StaggerItem className="mb-16">
              <p className="eyebrow mb-3">02 / UNDER THE HOOD</p>
              <SplitHeading
                lines={['Every tool you need to', 'hire with confidence.']}
                className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-[1.05]"
              />
              <p className="text-ink-500 max-w-2xl">
                Built for modern recruitment teams that demand speed, objectivity, and insights.
              </p>
            </StaggerItem>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => {
                const IconComp = feature.icon
                return (
                  <StaggerItem key={i}>
                    <LiftCard className="studio-card group p-8 h-full hover:border-primary-400 transition-colors">
                      <motion.div
                        whileHover={{ rotate: -6, scale: 1.08 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                        className="bg-primary-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      >
                        <IconComp size={22} className="text-primary-600" />
                      </motion.div>
                      <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                      <p className="text-ink-500 text-sm leading-relaxed">{feature.description}</p>
                    </LiftCard>
                  </StaggerItem>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Example Evaluation */}
      <section className="py-24 border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <StaggerItem className="mb-16">
              <p className="eyebrow mb-3">03 / VERIFIED RUN</p>
              <SplitHeading
                lines={['What you get']}
                className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-[1.05]"
              />
              <p className="text-ink-500 max-w-2xl">
                Each evaluation includes detailed insights and an actionable recommendation.
              </p>
            </StaggerItem>

            <StaggerItem>
              <LiftCard className="studio-card p-12 hover:shadow-lg transition-all">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-xl font-bold mb-8">Evaluation Scores</h3>
                    <div className="space-y-6">
                      {[
                        { label: 'Profile Fit', score: 88 },
                        { label: 'Technical Skills', score: 92 },
                        { label: 'Cultural Alignment', score: 85 },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{item.label}</span>
                            <span className="text-primary-600 font-bold">{item.score}/100</span>
                          </div>
                          <div className="h-2 bg-ink/10 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${scoreColor(item.score)}`}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.score}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-8">Key Insights</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-green-600 mb-2">✓ Key Strengths</p>
                        <ul className="text-sm text-ink-500 space-y-1">
                          <li>• 12+ years of relevant experience</li>
                          <li>• Expert in required tech stack</li>
                          <li>• Strong track record of leadership</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-yellow-600 mb-2">→ Addressable Gaps</p>
                        <ul className="text-sm text-ink-500 space-y-1">
                          <li>• Limited experience with cloud infrastructure</li>
                          <li>• Could strengthen management certification</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary-600 mb-2">🚀 Recommendation</p>
                        <p className="text-sm font-semibold">GO — Strong fit for the role</p>
                      </div>
                    </div>
                  </div>
                </div>
              </LiftCard>
            </StaggerItem>
          </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Reveal>
            <StaggerItem>
              <p className="eyebrow mb-4 justify-center flex items-center gap-2">
                <Sparkles size={14} className="text-primary-500" />
                THE NEXT WORKSPACE FOR HIRING DECISIONS
              </p>
              <SplitHeading
                lines={['Stop screening', 'manually.']}
                accentFrom={1}
                className="text-5xl md:text-6xl font-extrabold mb-10 tracking-tight leading-[1.02]"
              />
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="btn-studio-primary mx-auto"
              >
                Launch Platform
                <ArrowRight size={18} />
              </motion.button>
            </StaggerItem>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink/10 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-ink-400 text-sm">
          <p>© 2026 Recruitment Suite Studio.</p>
          <p className="eyebrow">BUILT FOR HIRING THAT HOLDS UP.</p>
        </div>
      </footer>
    </div>
  )
}
