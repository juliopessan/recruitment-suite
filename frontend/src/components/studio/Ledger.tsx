import { ReactNode } from 'react'
import { motion } from 'framer-motion'

/* ====================================================================
   The Proof Panel — Ledger's signature component.

   A fixed-dark read-out (same surface in both themes) that shows a
   measured before/after instead of an adjective: header with the lime
   live dot, an orange baseline bar ALWAYS before the mint bar, a stat
   row, a mint-bordered note, and a muted provenance footer.
   ==================================================================== */

/* Two signal colours only. "plain" is panel ink, for a neutral figure. */
const TONE = {
  rust: { text: 'text-rust-500', bar: 'bg-rust-500' },
  mint: { text: 'text-mint-500', bar: 'bg-mint-500' },
  plain: { text: 'text-panel-text', bar: 'bg-panel-text/70' },
} as const

export type LedgerTone = keyof typeof TONE

export function Ledger({
  label,
  meta,
  live = true,
  children,
  className = '',
}: {
  label: string
  meta?: ReactNode
  live?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`panel p-6 md:p-7 ${className}`}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5 min-w-0">
          {live && <span className="live-dot" aria-hidden="true" />}
          <span className="panel-label truncate">{label}</span>
        </div>
        {meta && <span className="panel-label text-right shrink-0">{meta}</span>}
      </div>
      {children}
    </div>
  )
}

/**
 * One measured line: what it is on the left, the figure on the right, and
 * a flat meter underneath showing it against the row's scale.
 */
export function LedgerRow({
  label,
  value,
  pct,
  tone = 'plain',
  delay = 0,
}: {
  label: string
  value: ReactNode
  /** Bar fill, 0–100. */
  pct: number
  tone?: LedgerTone
  delay?: number
}) {
  const t = TONE[tone]

  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-baseline justify-between gap-4 mb-2.5">
        <span className="panel-label truncate">{label}</span>
        <span className={`stat-num text-xl md:text-2xl ${t.text} shrink-0`}>{value}</span>
      </div>
      <div className="meter-track-dark">
        <motion.div
          className={`h-full ${t.bar}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

/** Headline figures in a two-column grid: big mono number + small unit. */
export function LedgerStats({
  items,
}: {
  items: { value: ReactNode; unit: string }[]
}) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5 py-6 my-2 panel-rule border-b border-panel-line">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="flex items-baseline gap-2 min-w-0"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
        >
          <span className="stat-num text-2xl md:text-[26px] text-panel-text leading-none shrink-0">
            {item.value}
          </span>
          <span className="panel-label truncate">{item.unit}</span>
        </motion.div>
      ))}
    </div>
  )
}

/**
 * The panel's note: mint-bordered on panel-2, with a flag whose glyph is a
 * fixed near-black (#0C0A08) so it holds contrast on mint in both themes.
 */
export function LedgerCallout({
  title,
  children,
  tone = 'mint',
  glyph = '✓',
}: {
  title: string
  children: ReactNode
  tone?: 'mint' | 'rust'
  glyph?: string
}) {
  const border = tone === 'rust' ? 'border-rust-500' : 'border-mint-500'
  const flag = tone === 'rust' ? 'bg-rust-500' : 'bg-mint-500'

  return (
    <div className={`border ${border} bg-panel-700 p-4 flex gap-4 items-start`}>
      <span
        className={`${flag} w-7 h-7 shrink-0 flex items-center justify-center font-bold text-sm`}
        style={{ color: '#0C0A08' }}
        aria-hidden="true"
      >
        {glyph}
      </span>
      <div className="min-w-0">
        <p className="panel-label mb-1.5">{title}</p>
        <p className="text-[13px] leading-relaxed text-panel-text">{children}</p>
      </div>
    </div>
  )
}

/** Provenance line closing the panel. */
export function LedgerFooter({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-6 panel-label">
      <span>{left}</span>
      {right && <span className="text-panel-text">{right}</span>}
    </div>
  )
}
