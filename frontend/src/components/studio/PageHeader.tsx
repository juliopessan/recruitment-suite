import { ReactNode } from 'react'
import { SplitHeading, HeadingLine } from './SplitHeading'

/**
 * Standard header for the internal pages: a ruled monospace eyebrow, an
 * oversized heading revealed line by line (same choreography as the landing
 * hero), supporting copy, and an optional right-aligned action. Closes with
 * a hairline so every page starts on the same rule.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string
  /** One entry per visual line; `{ text, italic }` for the serif half. */
  title: HeadingLine[]
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-10">
      <div className="flex flex-wrap items-end justify-between gap-6 pb-6">
        <div className="min-w-0">
          <p className="rule-eyebrow mb-4">{eyebrow}</p>
          <SplitHeading
            as="h1"
            animateOnMount
            lines={title}
            className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.02]"
          />
          {subtitle && (
            <p className="text-ink-500 mt-4 max-w-xl leading-relaxed">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="rule" />
    </div>
  )
}
