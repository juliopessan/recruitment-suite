import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchJobs } from '@/store/slices/jobsSlice'
import { Page } from '@/components/motion'
import { PageHeader } from '@/components/studio/PageHeader'
import { EmptyState } from '@/components/studio/EmptyState'

export default function JobsPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items: jobs, isLoading } = useAppSelector((state) => state.jobs)

  useEffect(() => {
    dispatch(fetchJobs({}))
  }, [dispatch])

  return (
    <Page>
      <PageHeader
        eyebrow="02 / OPEN ROLES"
        title={['Jobs']}
        subtitle="Every role you are hiring for, and what it requires."
        action={
          <motion.button
            onClick={() => navigate('/jobs/new')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="btn-studio-primary"
          >
            Add Job
          </motion.button>
        }
      />

      {isLoading ? (
        <div className="studio-card p-8 text-center text-ink-400">Loading…</div>
      ) : jobs.length > 0 ? (
        <div className="studio-card overflow-x-auto">
          <table className="studio-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Required Exp</th>
                <th>Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, i) => (
                <motion.tr
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="hover:bg-ink/[0.03] transition-colors"
                >
                  <td className="font-semibold">{job.title}</td>
                  <td className="text-ink-500">{job.company}</td>
                  <td className="text-ink-500">{job.years_experience_required} years</td>
                  <td className="text-ink-500 capitalize">{job.seniority_level}</td>
                  <td>
                    <button onClick={() => navigate(`/jobs/${job.id}`)} className="link-action">
                      View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={<Briefcase size={22} />}
          message="No jobs yet"
          action={
            <motion.button
              onClick={() => navigate('/jobs/new')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="btn-studio-primary"
            >
              Create First Job
            </motion.button>
          }
        />
      )}
    </Page>
  )
}
