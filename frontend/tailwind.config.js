/** @type {import('tailwindcss').Config} */

/**
 * Design language: editorial paper + terminal ledger.
 *
 * A warm paper ground carries near-black editorial type (heavy grotesk for
 * statements, high-contrast serif italic for the emphasised half of a
 * headline). Data lives in monospace: eyebrows, labels, figures, and the
 * dark "ledger" panels that quote measured numbers back at you.
 *
 * Two signal colours only — rust for cost/risk, mint for saving/pass —
 * so a number's colour always means the same thing anywhere in the app.
 * Corners are square; separation comes from hairline rules, never shadow.
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Paper ground -------------------------------------------------- */
        paper: {
          DEFAULT: '#f3f0e7',
          50: '#f8f6f0',
          100: '#f3f0e7',
          200: '#ebe7da',
          300: '#ded9c8',
          400: '#c9c3ad',
        },
        /* Editorial ink ------------------------------------------------- */
        ink: {
          DEFAULT: '#14140f',
          900: '#0c0c09',
          700: '#2b2a22',
          500: '#57544a',
          400: '#7c786c',
          300: '#a3a094',
        },
        /* Terminal panel ------------------------------------------------ */
        panel: {
          DEFAULT: '#161615',
          700: '#1f1f1d',
          600: '#2a2a27',
          500: '#3a3a35',
        },
        /* Signal: cost / risk / fail ------------------------------------ */
        rust: {
          DEFAULT: '#d2542a',
          50: '#fdf3ef',
          100: '#fae2d8',
          400: '#e07443',
          500: '#d2542a',
          600: '#b44320',
          700: '#8f3417',
        },
        /* Signal: saving / pass ----------------------------------------- */
        mint: {
          DEFAULT: '#8ed4a4',
          50: '#f0f9f3',
          100: '#d9f0e1',
          400: '#a3ddb4',
          500: '#8ed4a4',
          600: '#57ab74',
          700: '#3d8154',
        },
        /* Signal: hold / partial ---------------------------------------- */
        ochre: {
          DEFAULT: '#c08a2e',
          50: '#fbf5e8',
          100: '#f4e6c6',
          500: '#c08a2e',
          600: '#a06f22',
        },

        /* Legacy aliases — keep older utility names rendering on-brand --- */
        primary: {
          50: '#fdf3ef',
          100: '#fae2d8',
          200: '#f4c6b2',
          300: '#eca387',
          400: '#e07443',
          500: '#d2542a',
          600: '#b44320',
          700: '#8f3417',
          800: '#722a13',
          900: '#5c2311',
        },
        cream: {
          DEFAULT: '#f3f0e7',
          50: '#f8f6f0',
          100: '#f3f0e7',
          200: '#ebe7da',
          300: '#ded9c8',
          400: '#c9c3ad',
        },
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Archivo', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'Times New Roman', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        /* Square by default; `sm` is the only softening we allow. */
        DEFAULT: '0px',
        sm: '2px',
        md: '2px',
        lg: '2px',
        xl: '3px',
        '2xl': '3px',
      },
      letterSpacing: {
        label: '0.16em',
        wide2: '0.22em',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.25' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        blink: 'blink 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
