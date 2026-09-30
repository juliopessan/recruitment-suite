import { useEffect, useRef } from 'react'

/**
 * Ledger numbered rail: three steps of a real sequence on a 1px rail.
 * The square markers punch through the rail (they carry the section's
 * ground colour), and the rail traces left to right when it enters view.
 */
export function Rail({
  steps,
  className = '',
}: {
  steps: { title: string; body: string }[]
  className?: string
}) {
  const ref = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-in')
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <ol ref={ref} className={`rail ${className}`}>
      {steps.map((s, i) => (
        <li key={s.title} className="rail__step">
          <span className="rail__num" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="font-bold mt-5 mb-1.5">
            <span className="sr-only">Step {i + 1}: </span>
            {s.title}
          </h3>
          <p className="text-sm text-ink-500 leading-relaxed max-w-xs">{s.body}</p>
        </li>
      ))}
    </ol>
  )
}
