/**
 * Ledger runtime, ported from the design system's ledger.js to the React
 * app: theme (auto → light → dark), tab state (title + favicon dot) and a
 * polite live region for screen-reader announcements.
 */

/* ── theme ──────────────────────────────────────────────────────────── */

export type ThemeMode = 'auto' | 'light' | 'dark'

const THEME_KEY = 'ledger-theme'
const THEME_EVENT = 'ledger:theme'

const prefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

export const theme = {
  get(): ThemeMode {
    try {
      const v = localStorage.getItem(THEME_KEY)
      return v === 'light' || v === 'dark' ? v : 'auto'
    } catch {
      return 'auto'
    }
  },

  set(mode: ThemeMode) {
    const root = document.documentElement
    if (mode === 'auto') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', mode)
    try {
      if (mode === 'auto') localStorage.removeItem(THEME_KEY)
      else localStorage.setItem(THEME_KEY, mode)
    } catch {
      /* private mode: the choice just won't persist */
    }
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: mode }))
  },

  cycle(): ThemeMode {
    const order: ThemeMode[] = ['auto', 'light', 'dark']
    const next = order[(order.indexOf(theme.get()) + 1) % order.length]
    theme.set(next)
    return next
  },

  event: THEME_EVENT,
}

/* ── tab: title + favicon with a state dot ──────────────────────────── */

export type TabState = 'idle' | 'live' | 'error'

// Browser chrome follows the OS scheme, not the page theme.
const FAV = {
  light: { bg: '#17140F', fg: '#F1EEE5', live: '#B9CC3E', err: '#C9591F' },
  dark: { bg: '#EDE9DE', fg: '#151310', live: '#C9D95F', err: '#E07A3C' },
}

const PRODUCT = 'Recruitment Suite'
const LETTER = 'R'

let tabState: TabState = 'idle'

function faviconSvg(state: TabState): string {
  const c = FAV[prefersDark() ? 'dark' : 'light']
  const dot = state === 'live' ? c.live : state === 'error' ? c.err : null
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
    `<rect width="32" height="32" fill="${c.bg}"/>` +
    `<text x="16" y="24" text-anchor="middle" font-family="Archivo,Arial Black,Arial,sans-serif" ` +
    `font-weight="800" font-size="22" fill="${c.fg}">${LETTER}</text>` +
    (dot ? `<circle cx="25" cy="7" r="6" fill="${dot}" stroke="${c.bg}" stroke-width="2"/>` : '') +
    `</svg>`
  )
}

export const tab = {
  refresh() {
    const old = document.querySelector('link[rel="icon"]')
    const link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/svg+xml'
    link.href = 'data:image/svg+xml,' + encodeURIComponent(faviconSvg(tabState))
    // Replacing the node (rather than mutating href) forces a tab repaint.
    if (old?.parentNode) old.parentNode.replaceChild(link, old)
    else document.head.appendChild(link)
  },

  /** `Page | Product`, page first so truncated tabs stay distinguishable. */
  set(opts: { title?: string; state?: TabState }) {
    if (opts.state) tabState = opts.state
    if (opts.title != null) document.title = opts.title ? `${opts.title} | ${PRODUCT}` : PRODUCT
    tab.refresh()
  },
}

if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => tab.refresh())
}

/* ── polite live region ─────────────────────────────────────────────── */

export function say(message: string) {
  let region = document.getElementById('ledger-live')
  if (!region) {
    region = document.createElement('div')
    region.id = 'ledger-live'
    region.className = 'sr-only'
    region.setAttribute('role', 'status')
    region.setAttribute('aria-live', 'polite')
    document.body.appendChild(region)
  }
  region.textContent = ''
  const r = region
  setTimeout(() => {
    r.textContent = message
  }, 60)
}
