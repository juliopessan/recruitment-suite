import { ReactNode } from 'react'
import { SplitHeading } from './SplitHeading'

/**
 * Standard header for the internal pages: numbered eyebrow, oversized
 * heading revealed line by line (same choreography as the landing hero),
 * supporting copy, and an optional right-aligned action.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string
  /** One entry per visual line. */
  title: string[]
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <p className="eyebrow mb-2">{eyebrow}</p>
        <SplitHeading
          as="h1"
          lines={title}
          className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05]"
        />
        {subtitle && <p className="text-ink-500 mt-3 max-w-xl">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 pt-1">{action}</div>}
    </div>
  )
}
