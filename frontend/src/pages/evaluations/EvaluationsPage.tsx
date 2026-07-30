import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchEvaluations } from '@/store/slices/evaluationsSlice'
import { Page, scoreColor } from '@/components/motion'
import { PageHeader } from '@/components/studio/PageHeader'
import { EmptyState } from '@/components/studio/EmptyState'

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
        eyebrow="03 / VERIFIED RUNS"
        title={['Evaluations']}
        subtitle="Every scored candidate, with the recommendation that came out of it."
      />

      {isLoading ? (
        <div className="studio-card p-8 text-center text-ink-400">Loading…</div>
      ) : evaluations.length > 0 ? (
        <div className="studio-card overflow-x-auto">
          <table className="studio-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Final Score</th>
                <th>Recommendation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((evaluation, i) => (
                <motion.tr
                  key={evaluation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="hover:bg-ink/[0.03] transition-colors"
                >
                  <td className="font-mono text-xs text-ink-400">{evaluation.id}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-extrabold tabular-nums">
                        {evaluation.final_score.toFixed(1)}
                      </span>
                      <div className="w-20 h-1.5 bg-ink/10 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${scoreColor(evaluation.final_score)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${evaluation.final_score}%` }}
                          transition={{ duration: 0.8, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        evaluation.recommendation_status === 'GO'
                          ? 'badge-success'
                          : evaluation.recommendation_status === 'HOLD'
                            ? 'badge-warning'
                            : 'badge-danger'
                      }`}
                    >
                      {evaluation.recommendation_status}
                    </span>
                  </td>
                  <td>
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
        <EmptyState icon={<CheckCircle size={22} />} message="No evaluations yet" />
      )}
    </Page>
  )
}
