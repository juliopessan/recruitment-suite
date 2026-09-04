import { ReactNode } from 'react'
import { motion } from 'framer-motion'

/* ====================================================================
   The ledger panel — the signature surface of this system.

   A dark, monospace read-out that quotes figures back at the reader:
   a header with a live dot and a corpus note, label/value rows each
   backed by a flat meter, a grid of headline figures, an optional
   callout, and a footer of provenance. Used on the landing hero and
   anywhere a set of numbers is the argument.
   ==================================================================== */

const TONE = {
  rust: { text: 'text-rust-400', bar: 'bg-rust-500' },
  mint: { text: 'text-mint-500', bar: 'bg-mint-500' },
  ochre: { text: 'text-ochre-500', bar: 'bg-ochre-500' },
  plain: { text: 'text-white', bar: 'bg-white/70' },
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
          {live && (
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-mint-500 shrink-0"
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
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
    <div className="grid grid-cols-2 gap-x-6 gap-y-5 py-6 my-2 panel-rule border-b border-white/10">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="flex items-baseline gap-2 min-w-0"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
        >
          <span className="stat-num text-2xl md:text-[26px] text-white leading-none shrink-0">
            {item.value}
          </span>
          <span className="panel-label truncate">{item.unit}</span>
        </motion.div>
      ))}
    </div>
  )
}

/** Bordered note with a signal-coloured glyph block. */
export function LedgerCallout({
  title,
  children,
  tone = 'mint',
  glyph = '✓',
}: {
  title: string
  children: ReactNode
  tone?: LedgerTone
  glyph?: string
}) {
  const bg = tone === 'rust' ? 'bg-rust-500' : tone === 'ochre' ? 'bg-ochre-500' : 'bg-mint-500'

  return (
    <div className="border border-white/15 p-4 flex gap-4 items-start">
      <span
        className={`${bg} w-7 h-7 shrink-0 flex items-center justify-center text-panel font-bold text-sm`}
        aria-hidden="true"
      >
        {glyph}
      </span>
      <div className="min-w-0">
        <p className="panel-label mb-1.5">{title}</p>
        <p className="text-[13px] leading-relaxed text-white/70">{children}</p>
      </div>
    </div>
  )
}

/** Provenance line closing the panel. */
export function LedgerFooter({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-6 panel-label">
      <span>{left}</span>
      {right && <span className="text-white/70">{right}</span>}
    </div>
  )
}
