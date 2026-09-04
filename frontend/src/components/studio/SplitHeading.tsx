import { motion } from 'framer-motion'

/**
 * A line of a display heading. A plain string renders in the heavy grotesk;
 * `{ italic: true }` renders in the high-contrast serif italic that carries
 * the emphasised half of a statement.
 */
export type HeadingLine = string | { text: string; italic?: boolean; accent?: boolean }

function normalise(line: HeadingLine) {
  return typeof line === 'string' ? { text: line, italic: false, accent: false } : line
}

/**
 * Display heading revealed one line at a time (rise + fade, 90ms apart).
 * Pass each visual line separately so the choreography reads as typesetting
 * rather than as a block of text fading in.
 */
export function SplitHeading({
  lines,
  className = '',
  accentFrom,
  delay = 0,
  as: Tag = 'h2',
  animateOnMount = false,
}: {
  lines: HeadingLine[]
  className?: string
  /** Index from which lines render in the signal colour. */
  accentFrom?: number
  delay?: number
  as?: 'h1' | 'h2' | 'h3'
  /** Animate immediately instead of waiting to be scrolled into view. */
  animateOnMount?: boolean
}) {
  const reveal = animateOnMount
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.5 } }

  return (
    <Tag className={className}>
      {lines.map((raw, i) => {
        const line = normalise(raw)
        const accent = line.accent || (accentFrom !== undefined && i >= accentFrom)
        return (
          <motion.span
            key={`${line.text}-${i}`}
            className={`block ${line.italic ? 'serif-em' : ''} ${accent ? 'text-rust-500' : ''}`}
            initial={{ opacity: 0, y: 26 }}
            {...reveal}
            transition={{ duration: 0.7, delay: delay + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
          >
            {line.text}
          </motion.span>
        )
      })}
    </Tag>
  )
}
