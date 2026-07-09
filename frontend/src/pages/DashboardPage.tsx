import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Briefcase, CheckCircle, TrendingUp } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchCandidates } from '@/store/slices/candidatesSlice'
import { fetchJobs } from '@/store/slices/jobsSlice'
import { fetchEvaluations } from '@/store/slices/evaluationsSlice'
import { Page, StaggerItem, LiftCard, AnimatedNumber } from '@/components/motion'

const statCards = [
  {
    label: 'Total Candidates',
    icon: <Users size={22} />,
    accent: 'from-blue-50 to-blue-100 border-blue-500 text-blue-600',
  },
  {
    label: 'Total Jobs',
    icon: <Briefcase size={22} />,
    accent: 'from-green-50 to-green-100 border-green-500 text-green-600',
  },
  {
    label: 'Evaluations',
    icon: <CheckCircle size={22} />,
    accent: 'from-purple-50 to-purple-100 border-purple-500 text-purple-600',
  },
  {
    label: 'GO Rate',
    icon: <TrendingUp size={22} />,
    accent: 'from-orange-50 to-orange-100 border-orange-500 text-orange-600',
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
      <StaggerItem>
        <h1>Dashboard</h1>
        <p className="text-gray-600">Welcome to the Recruitment Suite</p>
      </StaggerItem>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <LiftCard
            key={card.label}
            className={`card bg-gradient-to-br border-l-4 ${card.accent.replace(/text-\S+/, '')}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">{card.label}</p>
              <span className={card.accent.split(' ').find((c) => c.startsWith('text-'))}>{card.icon}</span>
            </div>
            <AnimatedNumber
              value={statValues[i].value}
              suffix={statValues[i].suffix}
              className="text-3xl font-bold text-gray-900"
            />
          </LiftCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StaggerItem className="card">
          <h3 className="mb-4">Recent Candidates</h3>
          <div className="space-y-1">
            {candidates.length > 0 ? (
              candidates.map((candidate, i) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(249, 250, 251, 1)' }}
                  className="flex justify-between items-center p-2.5 rounded-lg"
                >
                  <span className="font-medium">{candidate.name}</span>
                  <span className="text-sm text-gray-500">{candidate.email}</span>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No candidates yet</p>
            )}
          </div>
        </StaggerItem>

        <StaggerItem className="card">
          <h3 className="mb-4">Recent Jobs</h3>
          <div className="space-y-1">
            {jobs.length > 0 ? (
              jobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(249, 250, 251, 1)' }}
                  className="flex justify-between items-center p-2.5 rounded-lg"
                >
                  <span className="font-medium">{job.title}</span>
                  <span className="text-sm text-gray-500">{job.company}</span>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No jobs yet</p>
            )}
          </div>
        </StaggerItem>
      </div>
    </Page>
  )
}
