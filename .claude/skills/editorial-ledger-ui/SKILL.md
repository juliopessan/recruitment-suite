---
name: editorial-ledger-ui
description: Our house design system — "editorial paper + terminal ledger". Warm paper ground, heavy grotesk display type with serif-italic emphasis, monospace for every label and figure, square corners, hairline rules, and dark ledger panels that quote numbers back at the reader. Use when building or restyling any UI, landing page, dashboard, report, document or slide for our projects, and whenever asked for our design system, brand, visual identity, house style, or "the usual look".
---

# Editorial paper + terminal ledger

## The one idea

**Statements are set in editorial type. Anything that is data is set in monospace.**

Everything else follows from that split. A headline is typography; a score is a
readout. Never blur the two — a number in the body sans, or a sentence in mono,
breaks the system faster than a wrong colour.

The signature surface is the **ledger**: a dark, monospace panel that quotes
measured figures back at the reader, with a flat meter under each one. Put the
argument in editorial type on paper, and the evidence in a ledger beside it.

## Non-negotiables

These are what make the system recognisable. Break one and it stops being ours.

1. **Square corners.** `border-radius: 0` everywhere. The only exceptions are
   status dots and avatars (`rounded-full`).
2. **Hairlines, not shadows.** Separation comes from 1px rules at ~15% ink.
   Cards are bordered, never elevated. No `box-shadow` in layout.
3. **Two signal colours, meaning-stable.** Rust = cost, risk, fail.
   Mint = saving, pass. (Ochre = hold/partial, the only third.) A figure's
   colour must mean the same thing on every screen. Never use them decoratively.
4. **Monospace for all labels and figures.** Eyebrows, table headers, field
   labels, counts, scores, timestamps, IDs, units. Uppercase, `0.16em` tracking,
   ~11px. Always `tabular-nums` on anything that animates or aligns.
5. **The ruled eyebrow.** Section labels are preceded by a 40px rule:
   `——— SECTION LABEL`. This is the system's most repeated gesture.
6. **Serif italic carries the emphasised half of a headline** — one line of a
   multi-line heading, never the whole thing, never body copy.
7. **Flat 3px meters.** Square ends, muted track, signal-coloured fill. Not
   rounded, not gradient, not animated on a loop.

## Tokens and components

Read `references/tokens.md` for the palette, type stack and a copy-paste Tailwind
config plus the plain-CSS `:root` equivalent (for HTML/Jinja/email contexts that
have no build step).

Read `references/components.md` for the component layer — buttons, fields, cards,
the ledger, meters, badges, tables — as both CSS and React patterns.

## Copy voice

The design promises rigour, so the writing has to earn it.

- **Plain and specific.** "Notes only ever raise the score" beats "Intelligent
  score optimisation".
- **Say what it does not do.** A `Limits` section — stating plainly what the tool
  will not do — is part of the house style, not an optional extra. It is the
  cheapest trust you can buy, and it belongs in the main nav.
- **Never fabricate a measurement.** The ledger format makes any number look
  audited. Only put figures in it that you can point at a source for. Label
  demo data `SAMPLE RUN` in the panel meta, visibly.
- **Numbers earn their place.** If you cannot say where a figure came from, use
  a qualitative statement instead.

## Applying it to a project

1. Set the tokens first (`tokens.md`), including the legacy aliases so any
   untouched utility class still lands on-palette.
2. Rewrite the global stylesheet as a **component layer** — `.btn-primary`,
   `.input-field`, `.card`, `.panel`, `.badge-*`, table styles — so pages compose
   classes rather than restyling. Keep the existing class *names* where a
   codebase already uses them; only the styles change. This is what keeps a
   large restyle from missing screens.
3. Build the shared components before the pages (ledger, meter, ruled heading,
   page header, empty state).
4. Then sweep the pages.
5. Restyle the **output artefacts too** — reports, exports, generated documents.
   A product whose UI and whose deliverable disagree has no identity.

## Verify by looking

A design task is not done when it compiles. Render it and look at it.

```bash
npm run build && npx vite preview --port 4173 &
# then screenshot with Playwright (Chromium is preinstalled at
# /opt/pw-browsers/ in our remote envs) and Read the PNGs
```

Check every page and both languages if the product is localised. In practice
this catches things static review never does: headlines wrapping to the wrong
line count, truncated flex children, fixed elements covering content.

### Known traps

- **`whileInView` + fullPage screenshots.** Scroll-revealed sections stay at
  `opacity: 0` in a `fullPage: true` capture, so the page looks empty below the
  hero. Scroll to each section and shoot the viewport instead — don't "fix" the
  animation.
- **Headline line breaks.** A three-line headline that wraps to four ruins the
  rhythm. Don't guess the font size — measure the rendered line boxes
  (`getBoundingClientRect().height` per line span) and adjust.
- **Fixed toolbars over content.** Print/export buttons pinned top-right land on
  the masthead. Pin them bottom-right.
- **Webfonts blocked in sandboxes.** If Google Fonts is proxied off, screenshots
  show fallbacks. Layout is still valid; typographic weight is not. Say so when
  reporting, and re-check on the deployed URL.
- **Long labels in a `truncate` flex row.** Prefer `flex-wrap` for ledger
  footers and meta rows; truncation silently eats meaning.

## Reference implementation

`juliopessan/recruitment-suite` — commit `cf718ad` applies this system end to end:
Tailwind tokens, the `index.css` component layer, the `studio/` components
(`Ledger`, `Meter`, `SplitHeading`, `PageHeader`, `EmptyState`, `Marquee`,
`PipelineDiagram`), every app page, and the Jinja HTML report.
