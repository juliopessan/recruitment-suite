import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Brain,
  Zap,
  Target,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Users,
  Sparkles,
} from 'lucide-react'
import { Page, StaggerItem, LiftCard, AnimatedNumber, scoreColor } from '@/components/motion'

export default function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Brain,
      title: 'Multi-Agent Evaluation',
      description:
        'Six specialized AI agents analyze profile fit, technical skills, culture alignment, references, and people analytics in parallel.',
    },
    {
      icon: Zap,
      title: 'Instant Analysis',
      description:
        'Upload a CV or provide LinkedIn profile, paste the job description, and get objective scoring in seconds — not hours.',
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

  const stats = [
    { label: 'Agents Working in Parallel', value: 6 },
    { label: 'Seconds to Evaluate', value: 12, suffix: 's' },
    { label: 'Candidate Profile Elements', value: 10, suffix: '+' },
  ]

  const workflow = [
    {
      step: 1,
      title: 'Upload CV or LinkedIn',
      description: 'Paste a CV (PDF, DOCX, TXT) or provide a LinkedIn URL for profile enrichment via Exa',
      icon: Users,
    },
    {
      step: 2,
      title: 'Paste Job Description',
      description: 'Enter your job posting — skills, years of experience, and seniority are extracted automatically',
      icon: Target,
    },
    {
      step: 3,
      title: 'AI Evaluates',
      description:
        'Six agents analyze profile, skills, culture fit, and provide comprehensive scoring and next steps',
      icon: Brain,
    },
    {
      step: 4,
      title: 'Get Insights',
      description:
        'Review detailed evaluation with strengths, gaps, critical flags, and an onboarding roadmap for the hire',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <Page className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-4 py-2 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Sparkles size={16} className="text-primary-400" />
            <span className="text-sm font-medium text-primary-300">Next-Generation Recruitment</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-300 via-primary-400 to-primary-500">
            Hire Better, Faster, Smarter
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            AI-powered candidate evaluation platform that eliminates bias, accelerates hiring, and identifies top talent
            objectively. Process candidates in seconds instead of days.
          </p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.button
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-4 px-8 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              Start Evaluating
              <ArrowRight size={20} />
            </motion.button>
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="border border-gray-500 hover:border-primary-400 text-white font-bold py-4 px-8 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              Learn How It Works
              <ArrowRight size={20} />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {stats.map((stat, i) => (
            <StaggerItem key={i}>
              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-8 text-center hover:border-primary-500/50 transition-all">
                <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix || ''} />
                </div>
                <p className="text-gray-400 font-medium">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </motion.div>
      </Page>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <Page>
            <StaggerItem>
              <h2 className="text-4xl font-bold mb-4 text-center">How It Works</h2>
              <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                Four simple steps to transform your candidate evaluation process
              </p>
            </StaggerItem>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {workflow.map((item, i) => {
                const IconComp = item.icon
                return (
                  <StaggerItem key={i}>
                    <LiftCard className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-8 h-full relative">
                      <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center font-bold text-white">
                        {item.step}
                      </div>
                      <IconComp size={32} className="text-primary-400 mb-4" />
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    </LiftCard>
                  </StaggerItem>
                )
              })}
            </motion.div>
          </Page>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <Page>
            <StaggerItem>
              <h2 className="text-4xl font-bold mb-4 text-center">Powerful Features</h2>
              <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                Every tool you need to build a world-class recruitment process
              </p>
            </StaggerItem>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => {
                const IconComp = feature.icon
                return (
                  <StaggerItem key={i}>
                    <LiftCard className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-8 h-full">
                      <div className="bg-primary-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <IconComp size={24} className="text-primary-400" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </LiftCard>
                  </StaggerItem>
                )
              })}
            </motion.div>
          </Page>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <Page>
            <StaggerItem>
              <h2 className="text-4xl font-bold mb-4 text-center">Why Teams Love Recruitment Suite</h2>
              <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                Built for modern recruitment teams that demand speed, objectivity, and insights
              </p>
            </StaggerItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                {
                  title: '⚡ Speed Up Hiring',
                  items: [
                    'Evaluate candidates in under 60 seconds',
                    'Reduce time-to-hire by 70%',
                    'Process batch evaluations instantly',
                  ],
                },
                {
                  title: '🎯 Make Better Decisions',
                  items: [
                    'Remove unconscious bias from screening',
                    'Objective skill-to-job-fit scoring',
                    'Data-backed recommendation engine',
                  ],
                },
                {
                  title: '📊 Gain Insights',
                  items: [
                    'Understand talent pool quality',
                    'Track hiring metrics and trends',
                    'Build predictive hiring models',
                  ],
                },
                {
                  title: '👥 Better Onboarding',
                  items: [
                    'Get personalized onboarding plans',
                    'Identify skill gaps early',
                    'Strategic skill development roadmaps',
                  ],
                },
              ].map((benefit, i) => (
                <StaggerItem key={i}>
                  <LiftCard className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-8">
                    <h3 className="text-2xl font-bold mb-6">{benefit.title}</h3>
                    <ul className="space-y-4">
                      {benefit.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <CheckCircle size={20} className="text-primary-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </LiftCard>
                </StaggerItem>
              ))}
            </div>
          </Page>
        </div>
      </section>

      {/* Example Evaluation */}
      <section className="py-20 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <Page>
            <StaggerItem>
              <h2 className="text-4xl font-bold mb-4 text-center">What You Get</h2>
              <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                Each evaluation includes detailed insights and actionable recommendations
              </p>
            </StaggerItem>

            <StaggerItem>
              <LiftCard className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-bold mb-8">Evaluation Scores</h3>
                    <div className="space-y-6">
                      {[
                        { label: 'Profile Fit', score: 88 },
                        { label: 'Technical Skills', score: 92 },
                        { label: 'Cultural Alignment', score: 85 },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{item.label}</span>
                            <span className="text-primary-400 font-bold">{item.score}/100</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${scoreColor(item.score)}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${item.score}%` }}
                              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-8">Key Insights</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-green-400 mb-2">✓ Key Strengths</p>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• 12+ years of relevant experience</li>
                          <li>• Expert in required tech stack</li>
                          <li>• Strong track record of leadership</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-yellow-400 mb-2">→ Addressable Gaps</p>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• Limited experience with cloud infrastructure</li>
                          <li>• Could strengthen management certification</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary-400 mb-2">🚀 Recommendation</p>
                        <p className="text-sm text-gray-300 font-semibold">GO — Strong fit for the role</p>
                      </div>
                    </div>
                  </div>
                </div>
              </LiftCard>
            </StaggerItem>
          </Page>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-gray-700">
        <div className="max-w-4xl mx-auto px-4">
          <Page>
            <StaggerItem>
              <div className="bg-gradient-to-r from-primary-500/20 via-primary-600/20 to-primary-700/20 border border-primary-500/50 rounded-2xl p-12 text-center">
                <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Hiring?</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Start evaluating candidates objectively and build your world-class team faster.
                </p>
                <motion.button
                  onClick={() => navigate('/login')}
                  whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-4 px-10 rounded-lg flex items-center justify-center gap-2 mx-auto transition-all"
                >
                  Launch Platform
                  <ArrowRight size={20} />
                </motion.button>
              </div>
            </StaggerItem>
          </Page>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 Recruitment Suite. Built for teams that hire smarter.</p>
        </div>
      </footer>
    </div>
  )
}
