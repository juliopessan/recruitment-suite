/** @type {import('tailwindcss').Config} */

/**
 * Ledger design system.
 *
 * Every colour resolves to a CSS variable defined in src/index.css, with
 * light values on :root and dark values under prefers-color-scheme / the
 * [data-theme] toggle — so the whole app themes from one place and matches
 * the Ledger tokens exactly.
 *
 * Five colours, one job each: paper (ground), ink (text/rules), orange
 * (cost / error — class name `rust` kept for continuity), mint (savings /
 * proof), lime (the live-status dot only). There is no sixth accent:
 * warning / hold states are ink + a shape + a word.
 *
 * Variables hold RGB channels ("23 20 15") so Tailwind opacity modifiers
 * like `border-ink/15` keep working.
 */
const c = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: c('paper'),
          50: c('paper'),
          100: c('paper'),
          200: c('paper-2'),
          300: c('line'),
          400: c('line'),
        },
        ink: {
          DEFAULT: c('ink'),
          900: c('ink'),
          700: c('ink'),
          // Everything lighter than ink is ink-soft: the lightest shade that
          // still passes AA as text on paper (6.48:1 light, 7.29:1 dark).
          500: c('ink-soft'),
          400: c('ink-soft'),
          300: c('ink-soft'),
          soft: c('ink-soft'),
        },
        line: c('line'),
        panel: {
          DEFAULT: c('panel'),
          700: c('panel-2'),
          600: c('panel-line'),
          500: c('panel-line'),
          line: c('panel-line'),
          text: c('panel-text'),
          soft: c('panel-text-soft'),
        },
        /* Orange: cost / waste / error. Raw for bars, rules, borders and the
           focus ring; -ink (600/700) whenever it has to be read as text. */
        rust: {
          DEFAULT: c('orange'),
          50: 'var(--orange-tint)',
          100: 'var(--orange-tint)',
          400: c('orange'),
          500: c('orange'),
          600: c('orange-ink'),
          700: c('orange-ink'),
        },
        /* Mint: savings / proof. Same split: raw for marks, -ink for text. */
        mint: {
          DEFAULT: c('mint'),
          50: 'var(--mint-tint)',
          100: 'var(--mint-tint)',
          400: c('mint'),
          500: c('mint'),
          600: c('mint'),
          700: c('mint-ink'),
        },
        /* Live-status dot only — never text, never a bar fill. */
        lime: c('lime'),

        /* Legacy aliases so any untouched utility still lands on-palette. */
        primary: {
          50: 'var(--orange-tint)',
          100: 'var(--orange-tint)',
          200: c('orange'),
          300: c('orange'),
          400: c('orange'),
          500: c('orange'),
          600: c('orange-ink'),
          700: c('orange-ink'),
          800: c('orange-ink'),
          900: c('orange-ink'),
        },
        cream: {
          DEFAULT: c('paper'),
          50: c('paper'),
          100: c('paper'),
          200: c('paper-2'),
          300: c('line'),
          400: c('line'),
        },
      },
      fontFamily: {
        sans: ['Archivo', 'Arial', 'Helvetica', 'sans-serif'],
        display: ['Archivo', 'Arial', 'Helvetica', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', '"Times New Roman"', 'serif'],
        mono: ['"IBM Plex Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        /* Square by default; `rounded-full` stays for the one sanctioned round
           element, the live-status dot. */
        DEFAULT: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
      },
      letterSpacing: {
        label: '0.16em',
        wide2: '0.22em',
      },
      minHeight: {
        target: '44px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgb(var(--lime) / 0.55)' },
          '70%': { boxShadow: '0 0 0 7px rgb(var(--lime) / 0)' },
          '100%': { boxShadow: '0 0 0 0 rgb(var(--lime) / 0)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        pulse: 'pulseRing 2.4s ease-out infinite',
      },
    },
  },
  plugins: [],
}
