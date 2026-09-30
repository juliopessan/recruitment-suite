import { useEffect, useRef } from 'react'

/**
 * Ledger scroll progress: a fixed 2px orange bar along the top edge,
 * scaled by how far the page has been read. One rAF-throttled handler,
 * transform only (no layout). Hidden from assistive tech.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const p = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={bar} className="scroll-progress" aria-hidden="true" />
}
