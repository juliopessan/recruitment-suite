# Tokens

## Palette

| Role | Token | Hex | Used for |
|---|---|---|---|
| Ground | `paper` | `#f3f0e7` | Page background |
| Ground (raised) | `paper-50` | `#f8f6f0` | Cards on paper |
| Ground (recessed) | `paper-200` | `#ebe7da` | Alternating sections, tickers |
| Text | `ink` | `#14140f` | Headlines, body, solid buttons |
| Text (muted) | `ink-500` | `#57544a` | Body copy, secondary text |
| Text (label) | `ink-400` | `#7c786c` | Monospace labels |
| Text (faint) | `ink-300` | `#a3a094` | Placeholders, ordinals |
| Panel | `panel` | `#161615` | The ledger surface |
| Panel border | `panel-600` | `#2a2a27` | Ledger edge |
| **Signal — cost/risk/fail** | `rust` | `#d2542a` | Scores < 50, NO-GO, errors, destructive |
| **Signal — saving/pass** | `mint` | `#8ed4a4` | Scores ≥ 75, GO, success |
| Signal — hold/partial | `ochre` | `#c08a2e` | Scores 50–74, HOLD, warnings |
| Rules | — | `rgba(20,20,15,.15)` | Hairlines on paper |
| Rules (dark) | — | `rgba(255,255,255,.10)` | Hairlines on panel |

On a dark panel use the brighter mint (`#8ed4a4`); on paper use `mint-600`
(`#57ab74`) so it holds contrast against the light ground.

**Score → tone mapping** (keep identical across app and generated documents):

```
score >= 75  → mint
score >= 50  → ochre
else         → rust
```

## Type

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display / body | **Archivo** | 400–900 | Headlines at 800; tight tracking `-0.02em` |
| Emphasis | **Instrument Serif** *italic* | 400 | One line of a headline, or a pull quote |
| Data | **JetBrains Mono** | 400–700 | Labels uppercase `0.16em`; figures `tabular-nums` |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

Always give each face a real fallback stack — these pages must survive a blocked
font CDN.

## Tailwind config

```js
// tailwind.config.js — theme.extend
colors: {
  paper: { DEFAULT:'#f3f0e7', 50:'#f8f6f0', 100:'#f3f0e7', 200:'#ebe7da', 300:'#ded9c8', 400:'#c9c3ad' },
  ink:   { DEFAULT:'#14140f', 900:'#0c0c09', 700:'#2b2a22', 500:'#57544a', 400:'#7c786c', 300:'#a3a094' },
  panel: { DEFAULT:'#161615', 700:'#1f1f1d', 600:'#2a2a27', 500:'#3a3a35' },
  rust:  { DEFAULT:'#d2542a', 50:'#fdf3ef', 100:'#fae2d8', 400:'#e07443', 500:'#d2542a', 600:'#b44320', 700:'#8f3417' },
  mint:  { DEFAULT:'#8ed4a4', 50:'#f0f9f3', 100:'#d9f0e1', 400:'#a3ddb4', 500:'#8ed4a4', 600:'#57ab74', 700:'#3d8154' },
  ochre: { DEFAULT:'#c08a2e', 50:'#fbf5e8', 100:'#f4e6c6', 500:'#c08a2e', 600:'#a06f22' },

  // Legacy aliases: keep utilities in untouched files landing on-palette
  // during a large restyle. Map whatever the codebase already used.
  primary: { 50:'#fdf3ef', 100:'#fae2d8', 200:'#f4c6b2', 300:'#eca387', 400:'#e07443',
             500:'#d2542a', 600:'#b44320', 700:'#8f3417', 800:'#722a13', 900:'#5c2311' },
  cream:   { DEFAULT:'#f3f0e7', 50:'#f8f6f0', 100:'#f3f0e7', 200:'#ebe7da', 300:'#ded9c8', 400:'#c9c3ad' },
},
fontFamily: {
  sans:    ['Archivo','system-ui','-apple-system','Segoe UI','sans-serif'],
  display: ['Archivo','system-ui','sans-serif'],
  serif:   ['"Instrument Serif"','Georgia','Times New Roman','serif'],
  mono:    ['"JetBrains Mono"','ui-monospace','SFMono-Regular','Menlo','monospace'],
},
borderRadius: {
  // Square by default. `rounded-full` is untouched and stays available for dots.
  DEFAULT:'0px', sm:'2px', md:'2px', lg:'2px', xl:'3px', '2xl':'3px',
},
letterSpacing: { label:'0.16em', wide2:'0.22em' },
```

Overriding `borderRadius.DEFAULT` is what silently squares off an entire existing
codebase — `rounded`, `rounded-lg`, `rounded-xl` all collapse to ~0 without
touching a single component. It is the highest-leverage line in the config.

## Plain CSS (no build step)

For generated HTML — reports, exports, emails, Jinja/Handlebars templates:

```css
:root{
  --paper:#f3f0e7; --paper-50:#f8f6f0; --paper-200:#ebe7da;
  --ink:#14140f; --ink-700:#2b2a22; --ink-500:#57544a; --ink-400:#7c786c; --ink-300:#a3a094;
  --panel:#161615; --panel-600:#2a2a27;
  --rust:#d2542a; --rust-600:#b44320; --rust-50:#fdf3ef;
  --mint:#8ed4a4; --mint-600:#57ab74; --mint-700:#3d8154; --mint-50:#f0f9f3;
  --ochre:#c08a2e; --ochre-600:#a06f22; --ochre-50:#fbf5e8;
  --line:rgba(20,20,15,.15); --line-soft:rgba(20,20,15,.10);
  --line-dark:rgba(255,255,255,.10);
  --sans:'Archivo',system-ui,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;
  --serif:'Instrument Serif',Georgia,'Times New Roman',serif;
  --mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
```

For anything that will be printed, add:

```css
@media print{
  body{background:#fff}
  .panel,footer{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  /* force accordions open, hide screen-only toolbars, avoid breaking cards */
  .layer{break-inside:avoid}
}
```

## Scale

- Section rhythm: `py-24` on marketing, `py-14` in-app; each section closed by a
  hairline rather than whitespace alone.
- Content width: `max-w-[1200px]` marketing, `max-w-3xl` for forms and reading.
- Display headline: `clamp(2.25rem, 4.6vw, 3.5rem)`, `leading-[1.0]`,
  `tracking-tight`. Larger than this and multi-line headlines start wrapping —
  measure before going bigger.
- Monospace label: 11px, `0.16em`, uppercase.
- Meter: 3px tall, square.
