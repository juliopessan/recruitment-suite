import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, RefreshCw, Download } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchEvaluation, addInterviewNotes } from '@/store/slices/evaluationsSlice'
import { Page, StaggerItem, AnimatedNumber, ScoreBar, scoreColor } from '@/components/motion'

const API_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:8000')

export default function EvaluationResultPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const evaluation = useAppSelector((state) => state.evaluations.currentEvaluation)
  const [notes, setNotes] = useState('')
  const [isRecalculating, setIsRecalculating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchEvaluation(id))
    }
  }, [dispatch, id])

  const handleRecalculate = async () => {
    if (!id || notes.trim().length < 3) {
      toast.error('Add a few words about the interview first')
      return
    }
    setIsRecalculating(true)
    try {
      const updated = await dispatch(addInterviewNotes({ id, notes: notes.trim() })).unwrap()
      toast.success(`Scores recalculated: ${updated.final_score}/100 — ${updated.recommendation_status}`)
      setNotes('')
    } catch {
      toast.error('Failed to recalculate scores')
    } finally {
      setIsRecalculating(false)
    }
  }

  const handleDownloadHtml = async () => {
    if (!id) return
    setIsDownloading(true)
    try {
      const res = await fetch(`${API_URL}/api/evaluations/${id}/report`)
      if (!res.ok) throw new Error('Failed to fetch report')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `evaluation-report-${id}.html`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Failed to download report')
    } finally {
      setIsDownloading(false)
    }
  }

  if (!evaluation) {
    return (
      <div className="card text-center">
        <p className="text-gray-500">Evaluation not found</p>
        <button onClick={() => navigate('/evaluations')} className="btn-primary mt-4">
          Back to Evaluations
        </button>
      </div>
    )
  }

  const getRecommendationColor = (status: string) => {
    switch (status) {
      case 'GO':
        return 'bg-green-50 text-green-900 border-green-500'
      case 'HOLD':
        return 'bg-yellow-50 text-yellow-900 border-yellow-500'
      case 'NO_GO':
        return 'bg-red-50 text-red-900 border-red-500'
      default:
        return 'bg-gray-50 text-gray-900 border-gray-300'
    }
  }

  const usesPeopleAnalytics = evaluation.people_analytics_score != null
  const scoreRows: { label: string; value: number }[] = [
    { label: 'Profile', value: evaluation.profile_score },
    usesPeopleAnalytics
      ? { label: 'People Analytics', value: evaluation.people_analytics_score as number }
      : { label: 'Technical', value: evaluation.technical_score },
    { label: 'Culture Fit', value: evaluation.culture_score },
    { label: 'References', value: evaluation.reference_score },
  ]

  return (
    <Page className="space-y-6">
      <StaggerItem className="flex justify-between items-center">
        <h1>Evaluation Result</h1>
        <div className="flex gap-2">
          <a
            href={`${API_URL}/api/evaluations/${id}/report`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center gap-2"
            title="Open the full report — use its Print / Save as PDF button to export as PDF"
          >
            <FileText size={16} />
            View Full Report
          </a>
          <button
            onClick={handleDownloadHtml}
            disabled={isDownloading}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={16} />
            {isDownloading ? 'Downloading…' : 'Download HTML'}
          </button>
          <button onClick={() => navigate('/evaluations')} className="btn-secondary">
            Back
          </button>
        </div>
      </StaggerItem>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        className={`card border-l-4 ${getRecommendationColor(evaluation.recommendation_status)}`}
      >
        <div className="flex justify-between items-center">
          <div>
            <AnimatedNumber value={evaluation.final_score} decimals={1} className="text-5xl font-bold" />
            <p className="text-sm mt-1">Overall Score</p>
            {evaluation.pre_interview_score != null && (
              <p className="text-xs text-gray-500 mt-1">
                Before interview notes: <span className="font-semibold">{evaluation.pre_interview_score}/100</span>
                {' '}({evaluation.pre_interview_status})
              </p>
            )}
          </div>
          <div className="text-right">
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold"
            >
              {evaluation.recommendation_status}
            </motion.p>
            <p className="text-sm">Recommendation</p>
          </div>
        </div>
      </motion.div>

      <StaggerItem className="card">
        <h3 className="mb-5">Score Breakdown</h3>
        <div className="space-y-4">
          {scoreRows.map((row) => (
            <div key={row.label} className="grid grid-cols-[140px_56px_1fr] items-center gap-3">
              <span className="text-sm text-gray-600">{row.label}</span>
              <AnimatedNumber value={row.value} decimals={1} className="font-semibold text-gray-900" />
              <ScoreBar value={row.value} colorClass={scoreColor(row.value)} />
            </div>
          ))}
        </div>
        <div className="flex gap-8 mt-6 pt-4 border-t border-gray-100 text-sm text-gray-600">
          <span>
            Confidence:{' '}
            <AnimatedNumber value={evaluation.confidence} suffix="%" className="font-semibold text-gray-900" />
          </span>
          <span>
            Strategic Bonus:{' '}
            <span className="font-semibold text-gray-900">+{evaluation.strategic_bonus.toFixed(1)}</span>
          </span>
        </div>
      </StaggerItem>

      <StaggerItem className="card">
        <h3 className="mb-4">Rationale</h3>
        <p className="text-gray-700">{evaluation.rationale}</p>
      </StaggerItem>

      {evaluation.strengths.length > 0 && (
        <StaggerItem className="card">
          <h3 className="mb-4">Strengths</h3>
          <ul className="space-y-2">
            {evaluation.strengths.map((strength, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.08 }}
                className="flex items-start"
              >
                <span className="text-green-600 mr-2">✓</span>
                <span>{strength}</span>
              </motion.li>
            ))}
          </ul>
        </StaggerItem>
      )}

      {evaluation.gaps.length > 0 && (
        <StaggerItem className="card">
          <h3 className="mb-4">Addressable Gaps</h3>
          <ul className="space-y-2">
            {evaluation.gaps.map((gap, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.08 }}
                className="flex items-start"
              >
                <span className="text-yellow-600 mr-2">⚠</span>
                <span>{gap}</span>
              </motion.li>
            ))}
          </ul>
        </StaggerItem>
      )}

      {evaluation.critical_flags.length > 0 && (
        <StaggerItem className="card bg-red-50 border-l-4 border-red-500">
          <h3 className="mb-4 text-red-900">Critical Flags</h3>
          <ul className="space-y-2">
            {evaluation.critical_flags.map((flag, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.08 }}
                className="flex items-start text-red-800"
              >
                <span className="mr-2">⚡</span>
                <span>{flag}</span>
              </motion.li>
            ))}
          </ul>
        </StaggerItem>
      )}

      <StaggerItem className="card space-y-4">
        <div>
          <h3 className="mb-1">Post-Interview Notes</h3>
          <p className="text-sm text-gray-500">
            Add what came up in the interview — skills demonstrated, culture fit signals, reference
            feedback — and the agents will recalculate every score against it.
          </p>
        </div>

        {evaluation.interview_notes && (
          <div className="bg-purple-50 border-l-4 border-purple-400 rounded-lg p-4">
            <p className="text-sm text-gray-800 whitespace-pre-line">{evaluation.interview_notes}</p>
            {evaluation.notes_updated_at && (
              <p className="text-xs text-gray-500 mt-2">Updated: {evaluation.notes_updated_at}</p>
            )}
          </div>
        )}

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-field min-h-[100px] text-sm"
          placeholder="E.g. Candidate demonstrated strong AWS and system design skills in the technical interview; references confirmed leadership experience…"
          disabled={isRecalculating}
        />
        <motion.button
          onClick={handleRecalculate}
          disabled={isRecalculating}
          whileHover={{ scale: isRecalculating ? 1 : 1.02 }}
          whileTap={{ scale: isRecalculating ? 1 : 0.98 }}
          className="btn-primary flex items-center gap-2"
        >
          <motion.span
            animate={isRecalculating ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isRecalculating ? Infinity : 0, ease: 'linear' }}
            className="inline-block"
          >
            <RefreshCw size={16} />
          </motion.span>
          {isRecalculating ? 'Recalculating…' : 'Add Notes & Recalculate'}
        </motion.button>
      </StaggerItem>
    </Page>
  )
}
