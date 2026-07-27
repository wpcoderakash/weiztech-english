# Weiz Technologies — Next.js

Rebuild of [weiztech.com](https://weiztech.com) (WordPress + Bricks Builder) in Next.js.

**This is a migration, not a redesign.** Design, layout, typography, spacing, colours,
animations, SEO and responsive behaviour must match the original. Where a value looks
wrong, check the source before changing it — several oddities are faithful reproductions
and are annotated as such in the code.

## Status

Phase 7 of 15 — base project setup. **No pages exist yet.**

Planning documents live in the parent directory:

| Document                            | Covers                              |
| ----------------------------------- | ----------------------------------- |
| `PHASE-1-AUDIT-REPORT.md`           | Full audit of the WordPress source  |
| `PHASE-2-DESIGN-TOKENS.md`          | Every design token, with provenance |
| `PHASE-3-COMPONENT-ARCHITECTURE.md` | 63 components, server/client split  |
| `PHASE-4-ROUTING-PLAN.md`           | 19 routes, 30 redirects             |
| `PHASE-5-DATA-STRATEGY.md`          | Content model, SEO metadata, schema |
| `PHASE-6-NEXTJS-ARCHITECTURE.md`    | Architecture decisions              |
| `PHASE-7-SETUP-REPORT.md`           | What this scaffold contains         |

## Stack

Next.js 16.2.12 (App Router) · React 19.2.4 · TypeScript 5 (strict) · CSS Modules · ESLint · Prettier

No Tailwind, no CSS-in-JS, no state library — see `PHASE-6` §7.3 and §8 for why.

## Commands

```bash
npm run dev          # dev server
npm run build        # production build
npm run check        # typecheck + lint + format check — run before every commit
npm run format       # apply Prettier
```

## Structure

```
src/
├── app/          routes (layout only so far)
├── components/   13 role-based folders — see PHASE-3 §5
├── content/      page data + blog MDX (static; no CMS — PHASE-5 §7)
├── styles/       tokens · reset · global · utilities
├── lib/          actions · animations · mail · seo · utils · constants
├── fonts/        Rubik 400/500/600 (next/font/local)
└── types/
```

## Design tokens

`src/styles/tokens.css` is the single source of truth and every value carries its
provenance. Three things to know before editing it:

1. **Root font-size is 62.5%** — `1rem = 10px`. Every token assumes this.
2. **Type and space scales are fluid**, interpolating 320px → 1200px then locking.
3. **`--space-xs` is a degenerate clamp** whose min exceeds its max, so it resolves to a
   constant 13.507px. That is faithful to the source. Do not "fix" the bounds.

## Breakpoints

Three ladders run simultaneously (`src/lib/constants/breakpoints.ts`):

| Ladder           | Widths                  | Applies to                    |
| ---------------- | ----------------------- | ----------------------------- |
| ACSS utilities   | ≤1180 / 992 / 768 / 480 | utility classes               |
| Bricks overrides | ≤991 / 767 / 478        | per-element responsive styles |
| GSAP matchMedia  | ≥1480 / 768             | animation gating              |

The 1px offsets between the first two are real. At exactly 992px the ACSS utility applies
but the Bricks override does not. Preserve both.

## Deliberate deviations from the original

Logged in full in `PHASE-5-DATA-STRATEGY.md` §10. The one baked into this scaffold:

- **Visible focus indicators are restored.** The source disables focus outlines site-wide
  (`:focus { outline: none }` plus `--focus-width: 0`), a WCAG 2.4.7 failure on a site that
  publicly links to an accessibility statement. To revert, set `--focus-width: 0` in
  `tokens.css`.
