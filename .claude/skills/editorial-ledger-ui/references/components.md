# Components

The component layer goes in the global stylesheet so pages compose classes
instead of restyling. Keep the class *names* a codebase already uses — only the
styles change. That is what stops a large restyle from missing screens.

## Type helpers

```css
/* The workhorse: small uppercase monospace label */
.eyebrow{ @apply font-mono text-[11px] font-medium uppercase tracking-label text-ink-400; }

/* The system's most repeated gesture: ——— SECTION LABEL */
.rule-eyebrow{ @apply eyebrow inline-flex items-center gap-3; }
.rule-eyebrow::before{ content:''; @apply block w-10 h-px bg-current opacity-40; }

/* Dark-panel variant */
.rule-eyebrow-dark{ @apply font-mono text-[11px] font-medium uppercase tracking-label
                    text-white/45 inline-flex items-center gap-3; }
.rule-eyebrow-dark::before{ content:''; @apply block w-10 h-px bg-current opacity-60; }

/* The emphasised half of a headline */
.serif-em{ @apply font-serif italic font-normal; letter-spacing:-0.01em; }

/* Bordered monospace chip: V1.0 / 5 AGENTS */
.chip{ @apply inline-flex items-center gap-2 border border-ink/25 px-3 py-1.5
       font-mono text-[11px] uppercase tracking-label text-ink-500; }
```

`.rule-eyebrow` is `inline-flex`, so it will not centre or right-align itself.
Wrap it in a `flex justify-center` / `justify-end` container instead of adding
alignment utilities to it.

## Buttons

```css
.btn-primary{ @apply inline-flex items-center justify-center gap-2 px-5 py-2.5
  bg-ink text-paper font-semibold text-sm hover:bg-ink-700 active:translate-y-px
  transition-all disabled:opacity-40 disabled:cursor-not-allowed; }

.btn-secondary{ @apply inline-flex items-center justify-center gap-2 px-5 py-2.5
  border border-ink/25 text-ink font-semibold text-sm hover:border-ink
  hover:bg-ink/[0.04] active:translate-y-px transition-all
  disabled:opacity-40 disabled:cursor-not-allowed; }

/* Destructive is outlined until hover — it should not shout from rest state */
.btn-danger{ @apply inline-flex items-center justify-center gap-2 px-5 py-2.5
  border border-rust-500 text-rust-600 font-semibold text-sm
  hover:bg-rust-500 hover:text-paper transition-all; }

/* Hero scale */
.btn-studio-primary{ @apply inline-flex items-center justify-center gap-3 px-7 py-4
  bg-ink text-paper font-bold text-[15px] hover:bg-ink-700 active:translate-y-px transition-all; }

/* Underlined text action; the gap widens on hover so the arrow "steps out" */
.btn-studio-secondary{ @apply inline-flex items-center gap-2 pb-1 font-semibold text-[15px]
  text-ink border-b border-ink/30 hover:border-ink hover:gap-3 transition-all; }

/* Table/list action — monospace, because it sits among data */
.link-action{ @apply font-mono text-xs uppercase tracking-label text-ink-500
  border-b border-ink/25 pb-0.5 hover:text-rust-600 hover:border-rust-500 transition-colors; }
```

Press feedback is `translate-y-px`, not `scale`. Squares should not squash.

## Fields

```css
.input-field{ @apply w-full px-3.5 py-2.5 bg-paper-50 border border-ink/20 text-ink text-sm
  placeholder:text-ink-300 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink
  transition-colors disabled:opacity-50 disabled:cursor-not-allowed; }

/* Labels are data, so they are monospace */
.field-label{ @apply block font-mono text-[11px] uppercase tracking-label text-ink-500 mb-2; }
```

Focus is an ink ring, not a signal colour — rust and mint must keep meaning
cost and pass.

## Surfaces

```css
.card, .studio-card{ @apply bg-paper-50 border border-ink/15; }
.card{ @apply p-6; }                     /* keeps padding for older call sites */

.panel{ @apply bg-panel text-paper-100 border border-panel-600; }
.panel-label{ @apply font-mono text-[11px] uppercase tracking-label text-white/45; }

.meter-track{ @apply h-[3px] w-full bg-ink/10 overflow-hidden; }
.meter-track-dark{ @apply h-[3px] w-full bg-white/10 overflow-hidden; }

.stat-num{ @apply font-mono tabular-nums font-bold tracking-tight; }
```

Card headers are a bordered strip, not padding: a `px-6 py-4` row with
`border-b border-ink/15` holding an `.eyebrow` on the left and optional meta on
the right. It gives every card the same shoulder.

## Badges and tables

```css
.badge{ @apply inline-flex items-center px-2.5 py-1 font-mono text-[11px] font-medium
  uppercase tracking-label border; }
.badge-success{ @apply badge border-mint-600 text-mint-700 bg-mint-50; }
.badge-warning{ @apply badge border-ochre-500 text-ochre-600 bg-ochre-50; }
.badge-danger { @apply badge border-rust-500  text-rust-600  bg-rust-50; }
.badge-info   { @apply badge border-ink/25    text-ink-500   bg-ink/[0.03]; }

.studio-table{ @apply w-full text-sm; }
.studio-table thead th{ @apply text-left px-6 py-3.5 font-mono text-[11px] font-medium
  uppercase tracking-label text-ink-400 border-b border-ink/15; }
.studio-table tbody td{ @apply px-6 py-4 border-b border-ink/10 align-middle; }
.studio-table tbody tr:last-child td{ @apply border-b-0; }
```

Badges are square outlined chips, never filled pills.

## The ledger

The signature component. Composed, not monolithic:

- `Ledger` — dark panel; header with a pulsing mint dot, a label, and right-side
  meta (corpus note, sample warning, count).
- `LedgerRow` — `{ label, value, pct, tone }`. Label left in `.panel-label`,
  figure right in the tone colour at ~22px mono, flat meter underneath.
- `LedgerStats` — 2-column grid of `{ value, unit }`: big mono figure, small
  mono unit beside it. Bounded top and bottom by dark hairlines.
- `LedgerCallout` — bordered note with a signal-coloured glyph square.
- `LedgerFooter` — provenance line. Use `flex-wrap`, **never** `truncate`.

Two contrasting rows is the strongest use: *before* in ochre against *after* in
mint, so the delta reads at a glance without a legend.

```tsx
<Ledger label="Candidate ledger" meta="Sample run · 5 agents">
  <LedgerRow label="Before the interview" value={<AnimatedNumber value={71} decimals={1} countOnView />} pct={71} tone="ochre" />
  <LedgerRow label="After interview notes" value={<AnimatedNumber value={84} decimals={1} countOnView />} pct={84} tone="mint" delay={0.15} />
  <LedgerStats items={[{ value: '84.0', unit: 'final score' }, { value: 'GO', unit: 'recommendation' }]} />
  <LedgerCallout title="Traceable, not asserted">Every figure opens into the line that produced it.</LedgerCallout>
  <LedgerFooter left="Profile · Technical · Culture" right="Notes never lower a score" />
</Ledger>
```

`value` takes a `ReactNode` so callers can pass an animated counter without the
component knowing about animation.

## Meter / ScoreRow

The light-ground counterpart of `LedgerRow`: monospace label left, tone-coloured
figure right, 3px meter beneath. Derive the tone from the value with the shared
mapping (`>=75` mint, `>=50` ochre, else rust) so one function governs colour
everywhere — app, report, export.

## SplitHeading

Reveals a headline one line at a time (rise + fade, 90ms apart). Take lines as
`string | { text, italic?, accent? }` so a heading can mix heavy grotesk and
serif italic:

```tsx
<SplitHeading
  as="h1"
  animateOnMount        // hero only; below the fold, reveal on scroll instead
  lines={['Every hiring call', { text: 'is a judgement.', italic: true }, 'Give it evidence.']}
  className="text-[clamp(2.25rem,4.6vw,3.5rem)] font-extrabold leading-[1.0] tracking-tight"
/>
```

Pass `animateOnMount` above the fold and let everything below use `whileInView`,
so sections do not burn their entrance off-screen.

## Navigation

- **Sidebar:** numbered monospace rows (`00`, `01`, …) with a small icon. Active
  item is a **solid ink block with paper text**, moved between items with a
  shared `layoutId` so it slides. No pills, no left border.
- **Top bar:** wordmark lockup left (ink square with the initial + tracked
  uppercase wordmark), monospace user meta right, hairline underneath.
- **Marketing nav:** plain sentence-case text links, plus a `.chip` for
  version/meta and one solid button.

## Motion

Restrained and consistent:

- Easing `[0.22, 1, 0.36, 1]`, 0.35–0.7s.
- Lists and cards stagger 40–90ms.
- Meters and counters animate on scroll into view, once.
- Hover lift is `y: -3` with no shadow — the border does the work.
- Wrap the stylesheet with `@media (prefers-reduced-motion: reduce)` collapsing
  all durations to ~0.
