/**
 * The mark: a solid ink square carrying the wordmark's initial, echoing the
 * stamped-block logos this system is built around. Pairs with a tracked
 * uppercase wordmark (see `Wordmark`).
 */
export function StudioMark({ size = 26, inverted = false }: { size?: number; inverted?: boolean }) {
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
      <text
        x="16"
        y="16.5"
        style={{ fill: fg }}
        fontFamily="Archivo, system-ui, sans-serif"
        fontSize="19"
        fontWeight="800"
        textAnchor="middle"
        dominantBaseline="central"
      >
        R
      </text>
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
        Recruitment&nbsp;Suite
      </span>
    </span>
  )
}
