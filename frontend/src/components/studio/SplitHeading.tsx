import { motion } from 'framer-motion'

/**
 * Heading that reveals one line at a time using the same choreography as
 * the hero headline (rise + fade, 90ms apart). Pass each visual line as a
 * separate string; a line may be highlighted in the accent colour.
 */
export function SplitHeading({
  lines,
  className = '',
  accentFrom,
  delay = 0,
  as: Tag = 'h2',
}: {
  lines: string[]
  className?: string
  /** Index from which lines render in the accent colour. */
  accentFrom?: number
  delay?: number
  as?: 'h1' | 'h2'
}) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <motion.span
          key={line}
          className={`block ${accentFrom !== undefined && i >= accentFrom ? 'text-primary-500' : ''}`}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: delay + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
        >
          {line}
        </motion.span>
      ))}
    </Tag>
  )
}
