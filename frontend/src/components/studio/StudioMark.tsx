import { useId } from 'react'

/**
 * The mark: a solid ink square carrying the wordmark's initial, echoing the
 * stamped-block logos this system is built around. Pairs with a tracked
 * uppercase wordmark (see `Wordmark`).
 *
 * Animated, the R pushes the S in and back out: R for Recruitment, S for
 * Suite. Both letters sit on one strip clipped by the square, so the push is
 * a single transform. At rest, without JS timing or under reduced motion, it
 * is the plain R.
 */
export function StudioMark({
  size = 26,
  inverted = false,
  animated = true,
}: {
  size?: number
  inverted?: boolean
  animated?: boolean
}) {
  const clip = `mark-clip-${useId().replace(/:/g, '')}`
  const bg = inverted ? 'rgb(var(--paper))' : 'rgb(var(--ink))'
  const fg = inverted ? 'rgb(var(--ink))' : 'rgb(var(--paper))'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="32" height="32" style={{ fill: bg }} />
      <defs>
        <clipPath id={clip}>
          <rect width="32" height="32" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <g className={animated ? 'mark-push' : undefined}>
          {(['R', 'S'] as const).map((letter, i) => (
            <text
              key={letter}
              x={16 + i * 32}
              y="16.5"
              style={{ fill: fg }}
              fontFamily="Archivo, system-ui, sans-serif"
              fontSize="19"
              fontWeight="800"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {letter}
            </text>
          ))}
        </g>
      </g>
    </svg>
  )
}

/** Mark + tracked uppercase wordmark, the standard lockup. */
export function Wordmark({
  size = 26,
  inverted = false,
  className = '',
}: {
  size?: number
  inverted?: boolean
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <StudioMark size={size} inverted={inverted} />
      <span
        className={`font-display font-extrabold uppercase tracking-[0.14em] text-[15px] leading-none ${
          inverted ? 'text-paper' : 'text-ink'
        }`}
      >
        <span className="wm-r">Recruitment</span>&nbsp;<span className="wm-s">Suite</span>
      </span>
    </span>
  )
}
