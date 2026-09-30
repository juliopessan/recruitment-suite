import { useEffect, useRef, useState } from 'react'
import { say } from '@/lib/ledger'

/**
 * Ledger "spinning verbs": a wait state that names the work.
 *
 *   [#] Matching...  4s      running
 *   [✓] Matched              done   (lingers, then clears)
 *   [✕] <message>            failed (stays until acted on)
 *
 * Every verb must name something the pipeline genuinely does, so this set
 * is specific to candidate evaluation rather than borrowed:
 *   Parsing   — the CV file is turned into text
 *   Matching  — required skills are matched against the record
 *   Weighing  — each agent weighs its dimension
 *   Vouching  — the record is checked for verifiable references
 *   Tallying  — the weighted final score is summed
 */
export const VERB_SETS = {
  evaluate: [
    ['Parsing', 'Parsed'],
    ['Matching', 'Matched'],
    ['Weighing', 'Weighed'],
    ['Vouching', 'Vouched'],
    ['Tallying', 'Tallied'],
  ],
  recalculate: [
    ['Weighing', 'Weighed'],
    ['Matching', 'Matched'],
    ['Tallying', 'Tallied'],
  ],
  file: [
    ['Ruling', 'Ruled'],
    ['Binding', 'Bound'],
    ['Filing', 'Filed'],
  ],
} as const

export type VerbSet = keyof typeof VERB_SETS
export type VerbPhase = 'idle' | 'running' | 'done' | 'error'

const DELAY = 400 // nothing renders for fast responses
const CYCLE = 1600 // next verb every 1.6s
const MIN_SHOW = 600 // once visible, stay long enough to be read
const LINGER = 1400 // past form stays this long, then clears

export function VerbStatus({
  phase,
  set = 'evaluate',
  error,
  label = 'Working',
  className = '',
}: {
  phase: VerbPhase
  set?: VerbSet
  /** Message shown (and announced) when phase is 'error'. */
  error?: string
  /** Single screen-reader announcement at start; cycling verbs are never read. */
  label?: string
  className?: string
}) {
  const verbs = VERB_SETS[set]
  const [visible, setVisible] = useState(false)
  const [shown, setShown] = useState<'running' | 'done' | 'error' | null>(null)
  const [index, setIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const shownAt = useRef<number>(0)
  const startedAt = useRef<number>(0)
  // Shuffled per run: a fixed order would read as real stage-by-stage
  // progress, which this is not — it is a wait indicator, not a tracker.
  const order = useRef<number[]>(verbs.map((_, i) => i))

  // Start / stop the running state.
  useEffect(() => {
    if (phase !== 'running') return

    const o = verbs.map((_, i) => i)
    for (let i = o.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[o[i], o[j]] = [o[j], o[i]]
    }
    order.current = o

    startedAt.current = Date.now()
    setIndex(0)
    setElapsed(0)
    say(label)

    const show = window.setTimeout(() => {
      shownAt.current = Date.now()
      setVisible(true)
      setShown('running')
    }, DELAY)
    const cycle = window.setInterval(() => setIndex((i) => (i + 1) % verbs.length), CYCLE)
    const clock = window.setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)),
      250
    )

    return () => {
      window.clearTimeout(show)
      window.clearInterval(cycle)
      window.clearInterval(clock)
    }
  }, [phase, label, verbs.length])

  // Resolve to the past form, or to an error that stays.
  useEffect(() => {
    if (phase === 'done') {
      // Never rendered (fast response): stay invisible, just announce.
      if (!visible) {
        say(verbs[order.current[index]][1])
        return
      }
      const wait = Math.max(0, MIN_SHOW - (Date.now() - shownAt.current))
      const t1 = window.setTimeout(() => {
        setShown('done')
        say(verbs[order.current[index]][1])
      }, wait)
      const t2 = window.setTimeout(() => {
        setVisible(false)
        setShown(null)
      }, wait + LINGER)
      return () => {
        window.clearTimeout(t1)
        window.clearTimeout(t2)
      }
    }

    if (phase === 'error') {
      setVisible(true)
      setShown('error')
      if (error) say(error)
    }

    if (phase === 'idle') {
      setVisible(false)
      setShown(null)
    }
    // `index`/`visible` are read at the moment of resolution on purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, error])

  if (!visible || !shown) {
    // Reserve the line so nothing below shifts when the verb appears.
    return <div className={`h-6 ${className}`} aria-hidden="true" />
  }

  const [present, past] = verbs[order.current[index]]

  return (
    <div className={`h-6 flex items-center ${className}`}>
      {shown === 'running' && (
        <span className="verb" aria-hidden="true">
          <span className="verb__sq" />
          <span key={present} className="verb__word--in">
            {present}
            <span className="verb__dots" />
          </span>
          {elapsed >= 1 && <span className="verb__clock">{elapsed}s</span>}
        </span>
      )}

      {shown === 'done' && (
        <span className="verb" aria-hidden="true">
          <span className="verb__flag verb__flag--done">✓</span>
          <span>{past}</span>
        </span>
      )}

      {shown === 'error' && (
        <span className="verb">
          <span className="verb__flag verb__flag--fail" aria-hidden="true">
            ✕
          </span>
          <span className="font-sans text-sm">{error}</span>
        </span>
      )}
    </div>
  )
}
