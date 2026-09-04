interface MarqueeProps {
  items: string[]
  className?: string
  /** Render on the dark panel ground instead of paper. */
  dark?: boolean
}

/** Monospace ticker between sections, separated by hairlines. */
export function Marquee({ items, className = '', dark = false }: MarqueeProps) {
  const track = [...items, ...items]

  return (
    <div
      className={`relative overflow-hidden border-y ${
        dark ? 'border-white/10 bg-panel' : 'border-ink/15 bg-paper-200'
      } ${className}`}
    >
      <div className="flex whitespace-nowrap animate-marquee w-max py-3.5">
        {track.map((item, i) => (
          <span
            key={i}
            className={`flex items-center gap-6 font-mono text-[11px] uppercase tracking-label ${
              dark ? 'text-white/45' : 'text-ink-400'
            }`}
          >
            <span className="px-6">{item}</span>
            <span aria-hidden="true" className="opacity-40">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
