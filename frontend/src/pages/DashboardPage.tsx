import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchCandidates } from '@/store/slices/candidatesSlice'
import { fetchJobs } from '@/store/slices/jobsSlice'
import { fetchEvaluations } from '@/store/slices/evaluationsSlice'
import { Page, StaggerItem, AnimatedNumber } from '@/components/motion'
import { PageHeader } from '@/components/studio/PageHeader'
import { Ledger, LedgerRow, LedgerStats, LedgerFooter } from '@/components/studio/Ledger'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const candidates = useAppSelector((state) => state.candidates.items)
  const jobs = useAppSelector((state) => state.jobs.items)
  const evaluations = useAppSelector((state) => state.evaluations.items)

  useEffect(() => {
    dispatch(fetchCandidates({ skip: 0, limit: 5 }))
    dispatch(fetchJobs({ skip: 0, limit: 5 }))
    dispatch(fetchEvaluations({}))
  }, [dispatch])

  const total = evaluations.length
  const goCount = evaluations.filter((e) => e.recommendation_status === 'GO').length
  const holdCount = evaluations.filter((e) => e.recommendation_status === 'HOLD').length
  const noGoCount = total - goCount - holdCount
  const goRate = total > 0 ? Math.round((goCount / total) * 100) : 0
  const avgScore =
    total > 0 ? evaluations.reduce((sum, e) => sum + e.final_score, 0) / total : 0

  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0)

  const counters = [
    { label: 'Candidates', value: candidates.length, to: '/candidates' },
    { label: 'Jobs', value: jobs.length, to: '/jobs' },
    { label: 'Evaluations', value: total, to: '/evaluations' },
    { label: 'GO rate', value: goRate, suffix: '%', to: '/evaluations' },
  ]

  return (
    <Page>
      <PageHeader
        eyebrow="00 / Overview"
        title={['Where the', { text: 'pipeline stands.', italic: true }]}
        subtitle="Everything scored so far, and what came out of it."
        action={
          <button onClick={() => navigate('/analyze')} className="btn-primary">
            Run an analysis
            <ArrowRight size={16} />
          </button>
        }
      />

      {/* Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-ink/15 mb-10">
        {counters.map((c) => (
          <button
            key={c.label}
            onClick={() => navigate(c.to)}
            className="text-left border-r border-b border-ink/15 p-6 hover:bg-ink/[0.03] transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <p className="eyebrow">{c.label}</p>
              <ArrowUpRight
                size={14}
                className="text-ink-300 group-hover:text-ink transition-colors"
              />
            </div>
            <AnimatedNumber
              value={c.value}
              suffix={c.suffix ?? ''}
              className="stat-num text-4xl leading-none"
            />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-8">
        {/* Recommendation split */}
        <StaggerItem className="self-start">
          <Ledger
            label="Recommendation split"
            meta={`${total} evaluation${total === 1 ? '' : 's'}`}
            live={total > 0}
          >
            {total > 0 ? (
              <>
                <LedgerRow
                  label="GO · move to offer"
                  value={goCount}
                  pct={pct(goCount)}
                  tone="mint"
                />
                <LedgerRow
                  label="HOLD · needs a conversation"
                  value={holdCount}
                  pct={pct(holdCount)}
                  tone="ochre"
                  delay={0.1}
                />
                <LedgerRow
                  label="NO-GO · passed over"
                  value={noGoCount}
                  pct={pct(noGoCount)}
                  tone="rust"
                  delay={0.2}
                />
                <LedgerStats
                  items={[
                    {
                      value: <AnimatedNumber value={avgScore} decimals={1} countOnView />,
                      unit: 'average score',
                    },
                    {
                      value: <AnimatedNumber value={goRate} suffix="%" countOnView />,
                      unit: 'reach GO',
                    },
                  ]}
                />
                <LedgerFooter left="Weighted across every agent" right="Live" />
              </>
            ) : (
              <div className="py-10 text-center">
                <p className="panel-label mb-5">No evaluations yet</p>
                <button
                  onClick={() => navigate('/analyze')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-paper text-ink font-semibold text-sm hover:bg-white transition-colors"
                >
                  Score your first candidate
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </Ledger>
        </StaggerItem>

        {/* Recent lists */}
        <div className="space-y-8">
          <StaggerItem className="studio-card">
            <div className="px-6 py-4 border-b border-ink/15 flex items-center justify-between">
              <p className="eyebrow">Recent candidates</p>
              <button onClick={() => navigate('/candidates')} className="link-action">
                All
              </button>
            </div>
            <div>
              {candidates.length > 0 ? (
                candidates.slice(0, 5).map((candidate, i) => (
                  <motion.button
                    key={candidate.id}
                    onClick={() => navigate(`/candidates/${candidate.id}`)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="w-full flex justify-between items-center gap-4 px-6 py-3.5 border-b border-ink/10 last:border-b-0 hover:bg-ink/[0.03] transition-colors text-left"
                  >
                    <span className="font-semibold text-sm truncate">{candidate.name}</span>
                    <span className="font-mono text-[11px] text-ink-400 truncate">
                      {candidate.email}
                    </span>
                  </motion.button>
                ))
              ) : (
                <p className="px-6 py-8 text-center eyebrow">Nothing yet</p>
              )}
            </div>
          </StaggerItem>

          <StaggerItem className="studio-card">
            <div className="px-6 py-4 border-b border-ink/15 flex items-center justify-between">
              <p className="eyebrow">Recent jobs</p>
              <button onClick={() => navigate('/jobs')} className="link-action">
                All
              </button>
            </div>
            <div>
              {jobs.length > 0 ? (
                jobs.slice(0, 5).map((job, i) => (
                  <motion.button
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="w-full flex justify-between items-center gap-4 px-6 py-3.5 border-b border-ink/10 last:border-b-0 hover:bg-ink/[0.03] transition-colors text-left"
                  >
                    <span className="font-semibold text-sm truncate">{job.title}</span>
                    <span className="font-mono text-[11px] text-ink-400 truncate">
                      {job.company}
                    </span>
                  </motion.button>
                ))
              ) : (
                <p className="px-6 py-8 text-center eyebrow">Nothing yet</p>
              )}
            </div>
          </StaggerItem>
        </div>
      </div>
    </Page>
  )
}
