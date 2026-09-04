import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { logout } from '@/store/slices/authSlice'
import { ArrowDown, ArrowUpRight, LogOut } from 'lucide-react'
import { Page, Reveal, StaggerItem, AnimatedNumber } from '@/components/motion'
import { Ledger, LedgerRow, LedgerStats, LedgerCallout, LedgerFooter } from '@/components/studio/Ledger'
import { PipelineDiagram } from '@/components/studio/PipelineDiagram'
import { Marquee } from '@/components/studio/Marquee'
import { Wordmark } from '@/components/studio/StudioMark'
import { SplitHeading } from '@/components/studio/SplitHeading'
import { ScoreRow } from '@/components/studio/Meter'

const NAV = [
  { href: '#cost', label: 'The cost' },
  { href: '#how', label: 'How' },
  { href: '#proof', label: 'The proof' },
  { href: '#interview', label: 'After the interview' },
  { href: '#limits', label: 'Limits' },
]

const AGENTS = [
  {
    num: '01',
    name: 'Profile',
    reads: 'Years against the requirement, education, trajectory, language fit',
  },
  {
    num: '02',
    name: 'Technical',
    reads: 'Required and nice-to-have skill coverage, certifications — matched semantically, with a literal fallback',
  },
  {
    num: '03',
    name: 'Culture',
    reads: 'Leadership, mentoring, collaboration and stakeholder signals in the record',
  },
  {
    num: '04',
    name: 'References',
    reads: 'How verifiable the record is: profiles that exist, education with dates, named certifications',
  },
  {
    num: '05',
    name: 'Recommendation',
    reads: 'Weights the four scores into one number and a GO / HOLD / NO-GO with its reasoning',
  },
]

const COSTS = [
  {
    title: 'Every CV starts from zero.',
    body: 'The same job requirements get re-checked by hand against every résumé that lands, all week.',
  },
  {
    title: 'Judgement drifts.',
    body: 'The tenth CV of the afternoon does not get read the way the first one did. Nobody means for that to happen.',
  },
  {
    title: 'Nothing is written down.',
    body: 'Six weeks later, the reason a candidate was passed over lives in somebody’s memory, if anywhere.',
  },
]

const LIMITS = [
  {
    title: 'It does not call your references.',
    body: 'The reference score reads how verifiable a record is — profiles that resolve, education with dates, named certifications. It is not a conversation with a former manager, and it does not pretend to be one.',
  },
  {
    title: 'It does not decide.',
    body: 'GO, HOLD and NO-GO are recommendations carrying their reasoning. A person still signs off, and the report is written to be argued with.',
  },
  {
    title: 'It cannot read what is not there.',
    body: 'A thin CV scores thin. Add the LinkedIn profile, or come back after the interview with notes, and the picture fills in.',
  },
  {
    title: 'Scores are a model of fit, not a measurement of a person.',
    body: 'Weighted, explainable and repeatable — which is a real improvement over a gut call at 6pm, and still not the truth about somebody.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)

  const handleLogout = () => {
    dispatch(logout())
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-ink/15">
        <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Wordmark />
          </motion.div>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[15px] text-ink-500 hover:text-ink transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <span className="chip hidden md:inline-flex">V1.0 / 5 Agents</span>
            {token ? (
              <>
                <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-label text-ink-400">
                  {user?.name || 'Signed in'}
                </span>
                <button onClick={handleLogout} className="btn-secondary py-2 px-4">
                  <LogOut size={15} />
                  Sign out
                </button>
              </>
            ) : (
              <button onClick={() => navigate('/login')} className="btn-primary py-2.5 px-5">
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <Page className="max-w-[1200px] mx-auto px-6 pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-14 items-center">
          <div>
            <motion.p
              className="rule-eyebrow mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Agentic evaluation layer
            </motion.p>

            <SplitHeading
              as="h1"
              animateOnMount
              delay={0.08}
              lines={[
                'Every hiring call',
                { text: 'is a judgement.', italic: true },
                'Give it evidence.',
              ]}
              className="text-[clamp(2.25rem,4.6vw,3.5rem)] font-extrabold leading-[1.0] tracking-tight mb-9"
            />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="space-y-5 max-w-lg mb-10"
            >
              <p className="text-[17px] leading-relaxed text-ink-500">
                A CV, a LinkedIn profile and a job description go in. Five agents score profile fit,
                technical depth, culture signals and how verifiable the record is — and every number
                keeps the evidence that produced it.
              </p>
              <p className="text-[17px] leading-relaxed text-ink-500">
                <strong className="font-semibold text-ink">Recruitment Suite</strong> runs the whole
                chain in one pass and ships it as a report you can hand to a hiring manager. English
                or Portuguese, ready to print.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 sm:items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              <button onClick={() => navigate('/login')} className="btn-studio-primary">
                Start an evaluation
                <ArrowDown size={17} />
              </button>
              <a href="#proof" className="btn-studio-secondary">
                See a sample run
                <ArrowUpRight size={16} />
              </a>
            </motion.div>
          </div>

          {/* Ledger */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex justify-end mb-4">
              <p className="rule-eyebrow">One full pass</p>
            </div>
            <Ledger label="Candidate ledger" meta="Sample run · 5 agents">
              <LedgerRow
                label="Before the interview · what the record supports"
                value={<AnimatedNumber value={71} decimals={1} countOnView />}
                pct={71}
                tone="ochre"
              />
              <LedgerRow
                label="After interview notes · what was confirmed"
                value={<AnimatedNumber value={84} decimals={1} countOnView />}
                pct={84}
                tone="mint"
                delay={0.15}
              />
              <LedgerStats
                items={[
                  { value: <AnimatedNumber value={84} decimals={1} countOnView />, unit: 'final score' },
                  { value: 'GO', unit: 'recommendation' },
                  { value: '05', unit: 'agents run' },
                  { value: <AnimatedNumber value={92} suffix="%" countOnView />, unit: 'confidence' },
                ]}
              />
              <LedgerCallout title="Traceable, not asserted">
                Every figure opens into the CV line, job requirement or interview note that produced
                it. The report shows its working.
              </LedgerCallout>
              <LedgerFooter
                left="Profile · Technical · Culture · References"
                right="Notes never lower a score"
              />
            </Ledger>
          </motion.div>
        </div>
      </Page>

      <Marquee
        items={[
          'Objective scoring',
          'Evidence you can audit',
          'Five chained agents',
          'EN-US / PT-BR',
          'Print-ready reports',
        ]}
      />

      {/* ── 01 · The cost ──────────────────────────────────────────── */}
      <section id="cost" className="py-24 border-b border-ink/15 scroll-mt-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-16">
              <StaggerItem>
                <p className="rule-eyebrow mb-6">01 / The cost</p>
                <SplitHeading
                  lines={['Screening burns', { text: 'the wrong hours.', italic: true }]}
                  className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.02]"
                />
              </StaggerItem>

              <div className="divide-y divide-ink/15 border-t border-ink/15">
                {COSTS.map((cost, i) => (
                  <StaggerItem key={cost.title}>
                    <div className="py-7 flex gap-6">
                      <span className="font-mono text-[11px] tracking-label text-ink-300 pt-1.5 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold mb-2">{cost.title}</h3>
                        <p className="text-ink-500 leading-relaxed">{cost.body}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 02 · How ───────────────────────────────────────────────── */}
      <section id="how" className="py-24 border-b border-ink/15 scroll-mt-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <StaggerItem className="mb-14 max-w-2xl">
              <p className="rule-eyebrow mb-6">02 / How it works</p>
              <SplitHeading
                lines={['Five agents.', { text: 'One chain.', italic: true }]}
                className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.02] mb-5"
              />
              <p className="text-ink-500 text-[17px] leading-relaxed">
                Each agent reads the same candidate against the same job, scores one dimension, and
                hands its number down the chain. The last one weighs them into a decision.
              </p>
            </StaggerItem>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <StaggerItem>
                <PipelineDiagram
                  input={{ label: 'Input', title: 'CV / LinkedIn', meta: 'PDF · DOCX · URL' }}
                  steps={[
                    { num: '01', title: 'Profile Fit', sub: 'Experience' },
                    { num: '02', title: 'Technical Skills', sub: 'Coverage' },
                    { num: '03', title: 'Culture Fit', sub: 'Signals' },
                    { num: '04', title: 'References', sub: 'Verifiability' },
                    { num: '05', title: 'Recommendation', sub: 'Decision' },
                  ]}
                  output={{
                    label: 'Output',
                    title: 'One scorecard',
                    meta: 'Decision + evidence trail',
                  }}
                  footerLeft="The candidate travels the chain."
                  footerRight="Every score stays traceable."
                />
              </StaggerItem>

              <StaggerItem>
                <div className="border-t border-ink/15">
                  {AGENTS.map((agent) => (
                    <div
                      key={agent.num}
                      className="py-5 border-b border-ink/15 flex gap-5 group hover:bg-ink/[0.02] transition-colors px-1"
                    >
                      <span className="font-mono text-[11px] tracking-label text-rust-600 pt-1 shrink-0">
                        {agent.num}
                      </span>
                      <div>
                        <h3 className="font-bold mb-1">{agent.name}</h3>
                        <p className="text-sm text-ink-500 leading-relaxed">{agent.reads}</p>
                      </div>
                    </div>
                  ))}
                  <p className="pt-5 font-mono text-[11px] uppercase tracking-label text-ink-400 leading-relaxed">
                    HR &amp; People roles swap agent 02 for a People Analytics specialist —
                    listening platforms, org psychology, survey programmes, executive stakeholders.
                  </p>
                </div>
              </StaggerItem>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 03 · The proof ─────────────────────────────────────────── */}
      <section id="proof" className="py-24 border-b border-ink/15 scroll-mt-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <StaggerItem className="mb-14 max-w-2xl">
              <p className="rule-eyebrow mb-6">03 / The proof</p>
              <SplitHeading
                lines={['What lands on the', { text: 'manager’s desk.', italic: true }]}
                className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.02] mb-5"
              />
              <p className="text-ink-500 text-[17px] leading-relaxed">
                One report per candidate. Scores with their reasoning, what is strong, what is
                missing, and what to do about it.
              </p>
            </StaggerItem>

            <StaggerItem>
              <div className="studio-card grid grid-cols-1 md:grid-cols-2">
                {/* Scores */}
                <div className="p-8 md:p-10 md:border-r border-ink/15">
                  <p className="rule-eyebrow mb-8">Score breakdown</p>
                  <div className="space-y-7">
                    {[
                      { label: 'Profile fit', score: 88 },
                      { label: 'Technical skills', score: 92 },
                      { label: 'Culture fit', score: 85 },
                      { label: 'References', score: 64 },
                    ].map((item, i) => (
                      <ScoreRow
                        key={item.label}
                        label={item.label}
                        value={item.score}
                        decimals={0}
                        delay={i * 0.08}
                      />
                    ))}
                  </div>

                  <div className="mt-9 pt-6 rule flex items-end justify-between">
                    <div>
                      <p className="eyebrow mb-1.5">Final</p>
                      <AnimatedNumber
                        value={84}
                        decimals={1}
                        className="stat-num text-5xl leading-none"
                        countOnView
                      />
                    </div>
                    <span className="badge-success text-sm px-3 py-1.5">GO</span>
                  </div>
                </div>

                {/* Insights */}
                <div className="p-8 md:p-10 border-t md:border-t-0 border-ink/15">
                  <p className="rule-eyebrow mb-8">Evidence</p>

                  <div className="space-y-7">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-label text-mint-700 mb-3">
                        Strengths
                      </p>
                      <ul className="space-y-2 text-[15px] text-ink-700">
                        <li className="flex gap-3">
                          <span className="text-mint-600 shrink-0">+</span>
                          12 years against a requirement of 8
                        </li>
                        <li className="flex gap-3">
                          <span className="text-mint-600 shrink-0">+</span>
                          Every required skill present in the record
                        </li>
                        <li className="flex gap-3">
                          <span className="text-mint-600 shrink-0">+</span>
                          Led and mentored across three teams
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-label text-ochre-600 mb-3">
                        Addressable gaps
                      </p>
                      <ul className="space-y-2 text-[15px] text-ink-700">
                        <li className="flex gap-3">
                          <span className="text-ochre-500 shrink-0">→</span>
                          No named cloud certification on the record
                        </li>
                        <li className="flex gap-3">
                          <span className="text-ochre-500 shrink-0">→</span>
                          Reference trail thin: no dated education
                        </li>
                      </ul>
                    </div>

                    <div className="pt-6 rule">
                      <p className="font-mono text-[11px] uppercase tracking-label text-ink-400 mb-3">
                        Next steps
                      </p>
                      <p className="text-[15px] text-ink-700 leading-relaxed">
                        Technical round on cloud depth, then a manager conversation. Onboarding plan
                        included in the report.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </Reveal>
        </div>
      </section>

      {/* ── 04 · After the interview ───────────────────────────────── */}
      <section id="interview" className="py-24 border-b border-ink/15 scroll-mt-20 bg-paper-200">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <StaggerItem>
                <p className="rule-eyebrow mb-6">04 / After the interview</p>
                <SplitHeading
                  lines={['Notes only ever', { text: 'raise the score.', italic: true }]}
                  className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.02] mb-6"
                />
                <div className="space-y-5 text-ink-500 text-[17px] leading-relaxed max-w-lg">
                  <p>
                    Type what came up in the room — skills demonstrated, culture signals, what a
                    reference actually said — and the whole chain runs again against it.
                  </p>
                  <p>
                    A skill the interviewer watched someone use is stronger evidence than a line on
                    a CV, so confirming one earns credit. And no dimension can fall below where it
                    stood before the notes: an interview adds evidence, it never deletes any.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <Ledger label="Recalculation" meta="Notes applied" live={false}>
                  <LedgerRow
                    label="Technical · before"
                    value={<AnimatedNumber value={68} decimals={1} countOnView />}
                    pct={68}
                    tone="ochre"
                  />
                  <LedgerRow
                    label="Technical · after notes"
                    value={<AnimatedNumber value={80} decimals={1} countOnView />}
                    pct={80}
                    tone="mint"
                    delay={0.15}
                  />
                  <LedgerStats
                    items={[
                      { value: '+12', unit: 'verification bonus' },
                      { value: '00', unit: 'scores lowered' },
                    ]}
                  />
                  <LedgerCallout title="Clamped by design" glyph="↑">
                    Each dimension keeps the higher of its pre-notes and recalculated score, so the
                    before-and-after delta always reads in one direction.
                  </LedgerCallout>
                </Ledger>
              </StaggerItem>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 05 · Limits ────────────────────────────────────────────── */}
      <section id="limits" className="py-24 border-b border-ink/15 scroll-mt-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <StaggerItem className="mb-14 max-w-2xl">
              <p className="rule-eyebrow mb-6">05 / Limits</p>
              <SplitHeading
                lines={['What it will', { text: 'not do.', italic: true }]}
                className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.02] mb-5"
              />
              <p className="text-ink-500 text-[17px] leading-relaxed">
                A hiring tool that oversells itself costs you more than it saves. So, plainly:
              </p>
            </StaggerItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              {LIMITS.map((limit, i) => (
                <StaggerItem key={limit.title}>
                  <div className="py-7 border-t border-ink/15 flex gap-5 h-full">
                    <span className="font-mono text-[11px] tracking-label text-ink-300 pt-1.5 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold mb-2 leading-snug">{limit.title}</h3>
                      <p className="text-ink-500 leading-relaxed">{limit.body}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 06 · Start ─────────────────────────────────────────────── */}
      <section id="start" className="py-28 scroll-mt-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <StaggerItem>
              <div className="panel p-10 md:p-16 text-center">
                <div className="flex justify-center mb-8">
                  <p className="rule-eyebrow-dark">06 / Adopt</p>
                </div>
                <SplitHeading
                  lines={['Score your next', { text: 'candidate.', italic: true }]}
                  className="text-[clamp(2.5rem,5.5vw,4rem)] font-extrabold tracking-tight leading-[1.0] mb-8 text-paper"
                />
                <p className="text-white/60 text-[17px] leading-relaxed max-w-lg mx-auto mb-10">
                  Upload a CV, paste the job description, and read the whole chain in one pass.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center gap-3 px-7 py-4 bg-paper text-ink font-bold text-[15px] hover:bg-white active:translate-y-px transition-all"
                >
                  Start an evaluation
                  <ArrowUpRight size={17} />
                </button>
              </div>
            </StaggerItem>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-ink/15">
        <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <Wordmark size={22} />
          <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-label text-ink-400">
            <a
              href="https://github.com/juliopessan/recruitment-suite"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink transition-colors"
            >
              Source
            </a>
            <span>EN-US / PT-BR</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
