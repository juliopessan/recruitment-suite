import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Briefcase, CheckCircle, TrendingUp } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchCandidates } from '@/store/slices/candidatesSlice'
import { fetchJobs } from '@/store/slices/jobsSlice'
import { fetchEvaluations } from '@/store/slices/evaluationsSlice'
import { Page, StaggerItem, LiftCard, AnimatedNumber } from '@/components/motion'
import { PageHeader } from '@/components/studio/PageHeader'

const statCards = [
  {
    label: 'Total Candidates',
    icon: <Users size={22} />,
    accent: 'border-ink text-ink',
  },
  {
    label: 'Total Jobs',
    icon: <Briefcase size={22} />,
    accent: 'border-ink text-ink',
  },
  {
    label: 'Evaluations',
    icon: <CheckCircle size={22} />,
    accent: 'border-ink text-ink',
  },
  {
    label: 'GO Rate',
    icon: <TrendingUp size={22} />,
    accent: 'border-primary-500 text-primary-600',
  },
]

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const candidates = useAppSelector((state) => state.candidates.items)
  const jobs = useAppSelector((state) => state.jobs.items)
  const evaluations = useAppSelector((state) => state.evaluations.items)

  useEffect(() => {
    dispatch(fetchCandidates({ skip: 0, limit: 5 }))
    dispatch(fetchJobs({ skip: 0, limit: 5 }))
    dispatch(fetchEvaluations({}))
  }, [dispatch])

  const goCount = evaluations.filter((e) => e.recommendation_status === 'GO').length
  const goRate = evaluations.length > 0 ? Math.round((goCount / evaluations.length) * 100) : 0
  const statValues = [
    { value: candidates.length, suffix: '' },
    { value: jobs.length, suffix: '' },
    { value: evaluations.length, suffix: '' },
    { value: goRate, suffix: '%' },
  ]

  return (
    <Page className="space-y-8">
      <PageHeader
        eyebrow="OVERVIEW"
        title={['Dashboard']}
        subtitle="Where your hiring pipeline stands right now."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const borderClass = card.accent.split(' ').find((c) => c.startsWith('border-'))
          const textClass = card.accent.split(' ').find((c) => c.startsWith('text-'))
          return (
            <LiftCard key={card.label} className={`studio-card border-l-4 p-6 ${borderClass}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink-500">{card.label}</p>
                <span className={textClass}>{card.icon}</span>
              </div>
              <AnimatedNumber
                value={statValues[i].value}
                suffix={statValues[i].suffix}
                className="text-3xl font-extrabold text-ink"
              />
            </LiftCard>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StaggerItem className="studio-card p-6">
          <h3 className="mb-4 font-bold">Recent Candidates</h3>
          <div className="space-y-1">
            {candidates.length > 0 ? (
              candidates.map((candidate, i) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(22, 20, 15, 0.04)' }}
                  className="flex justify-between items-center p-2.5 rounded-lg"
                >
                  <span className="font-medium">{candidate.name}</span>
                  <span className="text-sm text-ink-400">{candidate.email}</span>
                </motion.div>
              ))
            ) : (
              <p className="text-ink-400">No candidates yet</p>
            )}
          </div>
        </StaggerItem>

        <StaggerItem className="studio-card p-6">
          <h3 className="mb-4 font-bold">Recent Jobs</h3>
          <div className="space-y-1">
            {jobs.length > 0 ? (
              jobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(22, 20, 15, 0.04)' }}
                  className="flex justify-between items-center p-2.5 rounded-lg"
                >
                  <span className="font-medium">{job.title}</span>
                  <span className="text-sm text-ink-400">{job.company}</span>
                </motion.div>
              ))
            ) : (
              <p className="text-ink-400">No jobs yet</p>
            )}
          </div>
        </StaggerItem>
      </div>
    </Page>
  )
}
