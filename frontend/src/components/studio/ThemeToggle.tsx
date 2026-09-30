import { useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { theme, tab, ThemeMode } from '@/lib/ledger'

const ICON = { auto: Monitor, light: Sun, dark: Moon }

/** Cycles auto → light → dark. Square, 44px, labelled for screen readers. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>(() => theme.get())

  useEffect(() => {
    const sync = () => setMode(theme.get())
    window.addEventListener(theme.event, sync)
    return () => window.removeEventListener(theme.event, sync)
  }, [])

  const Icon = ICON[mode]

  return (
    <button
      type="button"
      onClick={() => {
        setMode(theme.cycle())
        tab.refresh()
      }}
      className={`icon-btn ${className}`}
      aria-label={`Theme: ${mode}. Change theme`}
      title={`Theme: ${mode}`}
    >
      <Icon size={17} aria-hidden="true" />
    </button>
  )
}
