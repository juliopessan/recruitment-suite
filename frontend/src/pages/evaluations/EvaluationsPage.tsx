import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ClipboardCheck } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchEvaluations } from '@/store/slices/evaluationsSlice'
import { Page, scoreColor } from '@/components/motion'
import { PageHeader } from '@/components/studio/PageHeader'
import { EmptyState } from '@/components/studio/EmptyState'

const BADGE: Record<string, string> = {
  GO: 'badge-success',
  HOLD: 'badge-warning',
  NO_GO: 'badge-danger',
}

export default function EvaluationsPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items: evaluations, isLoading } = useAppSelector((state) => state.evaluations)

  useEffect(() => {
    dispatch(fetchEvaluations({}))
  }, [dispatch])

  return (
    <Page>
      <PageHeader
        eyebrow="04 / Verified runs"
        title={['Evaluations']}
        subtitle="Every scored candidate, and the recommendation that came out of the chain."
        action={
          <button onClick={() => navigate('/analyze')} className="btn-primary">
            Run an analysis
            <ArrowRight size={16} />
          </button>
        }
      />

      {isLoading ? (
        <div className="studio-card p-10 text-center eyebrow">Loading…</div>
      ) : evaluations.length > 0 ? (
        <div className="studio-card overflow-x-auto">
          <table className="studio-table">
            <thead>
              <tr>
                <th>Evaluation</th>
                <th>Final score</th>
                <th>Recommendation</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((evaluation, i) => (
                <motion.tr
                  key={evaluation.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="hover:bg-ink/[0.03] transition-colors"
                >
                  <td className="font-mono text-[11px] text-ink-400">{evaluation.id}</td>
                  <td>
                    <div className="flex items-center gap-4 min-w-[160px]">
                      <span className="stat-num text-lg w-12 shrink-0">
                        {evaluation.final_score.toFixed(1)}
                      </span>
                      <div className="meter-track w-24">
                        <motion.div
                          className={`h-full ${scoreColor(evaluation.final_score)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${evaluation.final_score}%` }}
                          transition={{
                            duration: 0.8,
                            delay: 0.1 + i * 0.04,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={BADGE[evaluation.recommendation_status] ?? 'badge-info'}>
                      {evaluation.recommendation_status.replace('_', '-')}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => navigate(`/evaluations/${evaluation.id}`)}
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
          icon={<ClipboardCheck size={20} />}
          message="No evaluations yet"
          hint="Upload a CV and paste a job description, and the chain will produce the first one."
          action={
            <button onClick={() => navigate('/analyze')} className="btn-primary">
              Run an analysis
              <ArrowRight size={16} />
            </button>
          }
        />
      )}
    </Page>
  )
}
