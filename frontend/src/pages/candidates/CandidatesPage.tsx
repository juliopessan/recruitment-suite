import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Users } from 'lucide-react'
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
        eyebrow="02 / Talent pool"
        title={['Candidates']}
        subtitle="Everyone in the pipeline, and how much experience they bring."
        action={
          <button onClick={() => navigate('/candidates/new')} className="btn-primary">
            <Plus size={16} />
            Add candidate
          </button>
        }
      />

      {isLoading ? (
        <div className="studio-card p-10 text-center eyebrow">Loading…</div>
      ) : candidates.length > 0 ? (
        <div className="studio-card overflow-x-auto">
          <table className="studio-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Experience</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, i) => (
                <motion.tr
                  key={candidate.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="hover:bg-ink/[0.03] transition-colors"
                >
                  <td className="font-semibold">{candidate.name}</td>
                  <td className="font-mono text-[13px] text-ink-500">{candidate.email}</td>
                  <td className="font-mono text-[13px] text-ink-500">
                    {candidate.total_years_experience} yrs
                  </td>
                  <td className="text-right">
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
          icon={<Users size={20} />}
          message="No candidates yet"
          hint="Candidates are created automatically when you run an analysis, or add one by hand."
          action={
            <button onClick={() => navigate('/candidates/new')} className="btn-primary">
              <Plus size={16} />
              Add the first candidate
            </button>
          }
        />
      )}
    </Page>
  )
}
