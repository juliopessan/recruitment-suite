interface MarqueeProps {
  items: string[]
  className?: string
}

export function Marquee({ items, className = '' }: MarqueeProps) {
  const track = [...items, ...items]

  return (
    <div className={`relative overflow-hidden border-y border-ink/10 bg-cream-100 ${className}`}>
      <div className="flex whitespace-nowrap animate-marquee w-max py-3">
        {track.map((item, i) => (
          <span key={i} className="mx-4 text-xs font-bold tracking-[0.18em] uppercase text-ink-500">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
