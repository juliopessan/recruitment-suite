import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, Plus } from 'lucide-react'
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
        eyebrow="03 / Open roles"
        title={['Jobs']}
        subtitle="Every role you are hiring for, and what it asks of a candidate."
        action={
          <button onClick={() => navigate('/jobs/new')} className="btn-primary">
            <Plus size={16} />
            Add job
          </button>
        }
      />

      {isLoading ? (
        <div className="studio-card p-10 text-center eyebrow">Loading…</div>
      ) : jobs.length > 0 ? (
        <div className="studio-card overflow-x-auto">
          <table className="studio-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Required</th>
                <th>Level</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, i) => (
                <motion.tr
                  key={job.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="hover:bg-ink/[0.03] transition-colors"
                >
                  <td className="font-semibold">{job.title}</td>
                  <td className="text-ink-500">{job.company}</td>
                  <td className="font-mono text-[13px] text-ink-500">
                    {job.years_experience_required} yrs
                  </td>
                  <td>
                    <span className="badge-info capitalize">{job.seniority_level}</span>
                  </td>
                  <td className="text-right">
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
          icon={<Briefcase size={20} />}
          message="No jobs yet"
          hint="Jobs are created automatically from the description you paste into an analysis."
          action={
            <button onClick={() => navigate('/jobs/new')} className="btn-primary">
              <Plus size={16} />
              Add the first job
            </button>
          }
        />
      )}
    </Page>
  )
}
