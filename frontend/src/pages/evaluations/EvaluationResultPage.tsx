import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Download, FileText, RefreshCw } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchEvaluation, addInterviewNotes } from '@/store/slices/evaluationsSlice'
import { Page, StaggerItem, AnimatedNumber } from '@/components/motion'
import { PageHeader } from '@/components/studio/PageHeader'
import { ScoreRow } from '@/components/studio/Meter'
import { Ledger, LedgerRow, LedgerStats, LedgerFooter } from '@/components/studio/Ledger'
import { EmptyState } from '@/components/studio/EmptyState'

const API_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:8000')

const STATUS_TONE: Record<string, string> = {
  GO: 'badge-success',
  HOLD: 'badge-warning',
  NO_GO: 'badge-danger',
}

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
      toast.success(
        `Scores recalculated: ${updated.final_score}/100 — ${updated.recommendation_status}`
      )
      setNotes('')
    } catch (err) {
      const message = typeof err === 'string' ? err : 'Failed to recalculate scores'
      if (message.toLowerCase().includes('not found')) {
        toast.error('This evaluation is no longer available on the server. Please re-run the analysis.')
      } else {
        toast.error(message)
      }
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
      <Page className="max-w-3xl">
        <EmptyState
          message="Evaluation not found"
          hint="It may have expired from the server, or the link is out of date."
          action={
            <button onClick={() => navigate('/evaluations')} className="btn-primary">
              <ArrowLeft size={16} />
              Back to evaluations
            </button>
          }
        />
      </Page>
    )
  }

  const usesPeopleAnalytics = evaluation.people_analytics_score != null
  const scoreRows: { label: string; value: number }[] = [
    { label: 'Profile', value: evaluation.profile_score },
    usesPeopleAnalytics
      ? { label: 'People Analytics', value: evaluation.people_analytics_score as number }
      : { label: 'Technical', value: evaluation.technical_score },
    { label: 'Culture fit', value: evaluation.culture_score },
    { label: 'References', value: evaluation.reference_score },
  ]

  const hasDelta = evaluation.pre_interview_score != null
  const badge = STATUS_TONE[evaluation.recommendation_status] ?? 'badge-info'

  return (
    <Page>
      <PageHeader
        eyebrow="04 / Verified run"
        title={['Evaluation', { text: 'result.', italic: true }]}
        action={
          <div className="flex flex-wrap gap-3">
            <a
              href={`${API_URL}/api/evaluations/${id}/report`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              title="Open the full report — print it from there to save as PDF"
            >
              <FileText size={15} />
              Full report
              <ArrowUpRight size={14} />
            </a>
            <button
              onClick={handleDownloadHtml}
              disabled={isDownloading}
              className="btn-secondary"
            >
              <Download size={15} />
              {isDownloading ? 'Downloading…' : 'HTML'}
            </button>
            <button onClick={() => navigate('/evaluations')} className="btn-secondary">
              <ArrowLeft size={15} />
              Back
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-8 mb-8">
        {/* Verdict ledger */}
        <StaggerItem>
          <Ledger
            label="Verdict"
            meta={`${scoreRows.length} dimensions${usesPeopleAnalytics ? ' · People Analytics' : ''}`}
            live={false}
          >
            <div className="flex items-end justify-between gap-6 mb-8">
              <div>
                <p className="panel-label mb-2">Final score</p>
                <AnimatedNumber
                  value={evaluation.final_score}
                  decimals={1}
                  className="stat-num text-6xl leading-none text-white"
                />
              </div>
              <div className="text-right">
                <p className="panel-label mb-2">Recommendation</p>
                <p className="stat-num text-3xl text-white">
                  {evaluation.recommendation_status.replace('_', '-')}
                </p>
              </div>
            </div>

            {hasDelta && (
              <>
                <LedgerRow
                  label="Before interview notes"
                  value={(evaluation.pre_interview_score as number).toFixed(1)}
                  pct={evaluation.pre_interview_score as number}
                  tone="ochre"
                />
                <LedgerRow
                  label="After interview notes"
                  value={evaluation.final_score.toFixed(1)}
                  pct={evaluation.final_score}
                  tone="mint"
                  delay={0.12}
                />
              </>
            )}

            <LedgerStats
              items={[
                {
                  value: <AnimatedNumber value={evaluation.confidence} suffix="%" countOnView />,
                  unit: 'confidence',
                },
                {
                  value: `+${evaluation.strategic_bonus.toFixed(1)}`,
                  unit: 'strategic bonus',
                },
              ]}
            />

            <LedgerFooter
              left={hasDelta ? `Was ${evaluation.pre_interview_status}` : 'No interview notes yet'}
              right={evaluation.recommendation_status.replace('_', '-')}
            />
          </Ledger>
        </StaggerItem>

        {/* Score breakdown */}
        <StaggerItem className="studio-card">
          <div className="px-6 py-4 border-b border-ink/15 flex items-center justify-between">
            <p className="eyebrow">Score breakdown</p>
            <span className={badge}>{evaluation.recommendation_status.replace('_', '-')}</span>
          </div>
          <div className="p-6 space-y-7">
            {scoreRows.map((row, i) => (
              <ScoreRow key={row.label} label={row.label} value={row.value} delay={i * 0.08} />
            ))}
          </div>
        </StaggerItem>
      </div>

      {/* Rationale */}
      <StaggerItem className="studio-card p-8 md:p-10 mb-8">
        <p className="rule-eyebrow mb-6">Rationale</p>
        <blockquote className="serif-em text-2xl md:text-[28px] leading-[1.35] text-ink max-w-3xl">
          {evaluation.rationale}
        </blockquote>
      </StaggerItem>

      {/* Evidence */}
      {(evaluation.strengths.length > 0 || evaluation.gaps.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {evaluation.strengths.length > 0 && (
            <StaggerItem className="studio-card">
              <div className="px-6 py-4 border-b border-ink/15">
                <p className="eyebrow text-mint-700">Strengths</p>
              </div>
              <ul className="p-6 space-y-3.5">
                {evaluation.strengths.map((strength, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.06 }}
                    className="flex gap-3.5 text-[15px] text-ink-700 leading-relaxed"
                  >
                    <span className="text-mint-600 shrink-0 font-mono">+</span>
                    <span>{strength}</span>
                  </motion.li>
                ))}
              </ul>
            </StaggerItem>
          )}

          {evaluation.gaps.length > 0 && (
            <StaggerItem className="studio-card">
              <div className="px-6 py-4 border-b border-ink/15">
                <p className="eyebrow text-ochre-600">Addressable gaps</p>
              </div>
              <ul className="p-6 space-y-3.5">
                {evaluation.gaps.map((gap, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.06 }}
                    className="flex gap-3.5 text-[15px] text-ink-700 leading-relaxed"
                  >
                    <span className="text-ochre-500 shrink-0 font-mono">→</span>
                    <span>{gap}</span>
                  </motion.li>
                ))}
              </ul>
            </StaggerItem>
          )}
        </div>
      )}

      {/* Critical flags */}
      {evaluation.critical_flags.length > 0 && (
        <StaggerItem className="border border-rust-500 bg-rust-50 mb-8">
          <div className="px-6 py-4 border-b border-rust-500/30">
            <p className="eyebrow text-rust-600">Critical flags</p>
          </div>
          <ul className="p-6 space-y-3.5">
            {evaluation.critical_flags.map((flag, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.06 }}
                className="flex gap-3.5 text-[15px] text-rust-700 leading-relaxed"
              >
                <span className="shrink-0 font-mono">!</span>
                <span>{flag}</span>
              </motion.li>
            ))}
          </ul>
        </StaggerItem>
      )}

      {/* Interview guide — sits directly above the notes box, because the
          answers to these questions are what goes into it. */}
      {evaluation.interview_guide && evaluation.interview_guide.length > 0 && (
        <StaggerItem className="studio-card mb-8">
          <div className="px-6 py-4 border-b border-ink/15 flex items-center justify-between gap-4">
            <p className="eyebrow">Interview guide</p>
            <span className="font-mono text-[11px] uppercase tracking-label text-ink-300">
              {evaluation.interview_guide.length} question
              {evaluation.interview_guide.length === 1 ? '' : 's'}
            </span>
          </div>

          <p className="px-6 pt-5 text-ink-500 leading-relaxed max-w-2xl">
            Chosen from this candidate's gaps. Bring the answers back as notes below and
            every score recalculates against them.
          </p>

          <div className="p-6 pt-5">
            {evaluation.interview_guide.map((q, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + idx * 0.07 }}
                className="grid grid-cols-[26px_1fr] gap-x-4 py-5 border-t border-ink/10 first:border-t-0 first:pt-0"
              >
                <span className="font-mono text-[11px] tracking-label text-ink-300 pt-1">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 mb-2">
                    <span className="font-mono text-[11px] uppercase tracking-label text-ink">
                      {q.focus}
                    </span>
                    {q.dimension && <span className="badge-info">{q.dimension}</span>}
                  </div>
                  <p className="text-[15px] text-ink-700 leading-relaxed">{q.question}</p>
                  <div className="mt-3 pl-3.5 border-l-2 border-mint-600">
                    <p className="font-mono text-[10px] uppercase tracking-label text-mint-700 mb-1">
                      Listen for
                    </p>
                    <p className="text-sm text-ink-500 leading-relaxed">{q.listen_for}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </StaggerItem>
      )}

      {/* Post-interview notes */}
      <StaggerItem className="studio-card">
        <div className="px-6 py-4 border-b border-ink/15 flex items-center justify-between gap-4">
          <p className="eyebrow">Post-interview notes</p>
          <span className="font-mono text-[11px] uppercase tracking-label text-ink-300">
            Scores never fall
          </span>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-ink-500 leading-relaxed max-w-2xl">
            Add what came up in the room — skills demonstrated, culture signals, reference feedback —
            and the chain runs again against it. A dimension keeps the higher of its previous and
            recalculated score, so notes can only add evidence.
          </p>

          {evaluation.interview_notes && (
            <div className="border-l-2 border-ink pl-5 py-1">
              <p className="eyebrow mb-2">On the record</p>
              <p className="text-[15px] text-ink-700 whitespace-pre-line leading-relaxed">
                {evaluation.interview_notes}
              </p>
              {evaluation.notes_updated_at && (
                <p className="font-mono text-[11px] uppercase tracking-label text-ink-400 mt-3">
                  Updated {evaluation.notes_updated_at}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="field-label">Add notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field min-h-[120px]"
              placeholder="E.g. Demonstrated strong AWS and system design in the technical round; references confirmed leadership experience…"
              disabled={isRecalculating}
            />
          </div>

          <button
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="btn-primary"
          >
            <motion.span
              animate={isRecalculating ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isRecalculating ? Infinity : 0, ease: 'linear' }}
              className="inline-block"
            >
              <RefreshCw size={15} />
            </motion.span>
            {isRecalculating ? 'Recalculating…' : 'Add notes & recalculate'}
          </button>
        </div>
      </StaggerItem>
    </Page>
  )
}
