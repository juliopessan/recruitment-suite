import { motion } from 'framer-motion'
import { AnimatedNumber } from '@/components/motion'

/** Signal colour for a 0–100 score: mint passes, ochre holds, rust fails. */
export function toneForScore(value: number): 'mint' | 'ochre' | 'rust' {
  if (value >= 75) return 'mint'
  if (value >= 50) return 'ochre'
  return 'rust'
}

const BAR = {
  mint: 'bg-mint-600',
  ochre: 'bg-ochre-500',
  rust: 'bg-rust-500',
} as const

const TEXT = {
  mint: 'text-mint-700',
  ochre: 'text-ochre-600',
  rust: 'text-rust-600',
} as const

/** Flat 3px meter on the paper ground. */
export function Meter({
  value,
  tone,
  delay = 0,
}: {
  value: number
  tone?: 'mint' | 'ochre' | 'rust'
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
