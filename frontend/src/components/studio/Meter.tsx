import { motion } from 'framer-motion'
import { AnimatedNumber } from '@/components/motion'

/**
 * Tone for a 0–100 score. Mint passes, orange fails; the middle band is
 * plain ink — Ledger has no sixth colour for "hold", the figure and the
 * word beside it carry that state instead.
 */
export type ScoreTone = 'mint' | 'ink' | 'rust'

export function toneForScore(value: number): ScoreTone {
  if (value >= 75) return 'mint'
  if (value >= 50) return 'ink'
  return 'rust'
}

const BAR = {
  mint: 'bg-mint-600',
  ink: 'bg-ink/55',
  rust: 'bg-rust-500',
} as const

const TEXT = {
  mint: 'text-mint-700',
  ink: 'text-ink',
  rust: 'text-rust-600',
} as const

/** Flat 3px meter on the paper ground. */
export function Meter({
  value,
  tone,
  delay = 0,
}: {
  value: number
  tone?: ScoreTone
  delay?: number
}) {
  const t = tone ?? toneForScore(value)
  return (
    <div className="meter-track">
      <motion.div
        className={`h-full ${BAR[t]}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

/**
 * A scored dimension: monospace label, the figure, and the meter beneath —
 * the light-ground counterpart of `LedgerRow`.
 */
export function ScoreRow({
  label,
  value,
  decimals = 1,
  delay = 0,
}: {
  label: string
  value: number
  decimals?: number
  delay?: number
}) {
  const tone = toneForScore(value)

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <span className="font-mono text-[11px] uppercase tracking-label text-ink-500 truncate">
          {label}
        </span>
        <AnimatedNumber
          value={value}
          decimals={decimals}
          className={`stat-num text-lg ${TEXT[tone]} shrink-0`}
          countOnView
        />
      </div>
      <Meter value={value} tone={tone} delay={delay} />
    </div>
  )
}
