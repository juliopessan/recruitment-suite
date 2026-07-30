import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchCandidates } from '@/store/slices/candidatesSlice'
import { Page } from '@/components/motion'
import { PageHeader } from '@/components/studio/PageHeader'
import { EmptyState } from '@/components/studio/EmptyState'

export default function CandidatesPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items: candidates, isLoading } = useAppSelector((state) => state.candidates)

  useEffect(() => {
    dispatch(fetchCandidates({}))
  }, [dispatch])

  return (
    <Page>
      <PageHeader
        eyebrow="01 / TALENT POOL"
        title={['Candidates']}
        subtitle="Manage and view every candidate in the pipeline."
        action={
          <motion.button
            onClick={() => navigate('/candidates/new')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="btn-studio-primary"
          >
            Add Candidate
          </motion.button>
        }
      />

      {isLoading ? (
        <div className="studio-card p-8 text-center text-ink-400">Loading…</div>
      ) : candidates.length > 0 ? (
        <div className="studio-card overflow-x-auto">
          <table className="studio-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, i) => (
                <motion.tr
                  key={candidate.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="hover:bg-ink/[0.03] transition-colors"
                >
                  <td className="font-semibold">{candidate.name}</td>
                  <td className="text-ink-500">{candidate.email}</td>
                  <td className="text-ink-500">{candidate.total_years_experience} years</td>
                  <td>
                    <button
                      onClick={() => navigate(`/candidates/${candidate.id}`)}
                      className="link-action"
                    >
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
          icon={<Users size={22} />}
          message="No candidates yet"
          action={
            <motion.button
              onClick={() => navigate('/candidates/new')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="btn-studio-primary"
            >
              Create First Candidate
            </motion.button>
          }
        />
      )}
    </Page>
  )
}
