# Changelog

All notable changes to Bioparity are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased] — Commit 8b — Homepage hero upgrade (2026-04-21)

Homepage only. No data, route, or copy changes. Tests: 67 → 69 passing.

### Added
- `lib/timeline.js` — `buildTimeline(ledger)` returns an array of `{ date, event_id, event_name, robot_name, value, display_value, autonomy, eligibility, tier }` sorted by date ascending (tie-break by event_id then robot_name). Skips performances with null value. **Eligibility field used: `performance.record_eligibility.eligible` (boolean).**
- `components/TimelineHero.js` — hand-rolled SVG time-axis hero (no chart library). Plots every real performance as a dot. Autonomy → color (`autonomous`=`accent-verified` green, `assisted`=`accent-experimental` amber, `teleoperated`=`accent-data` blue, `unknown`=`ink-muted`). Eligibility → fill style (eligible=filled, ineligible=2px hollow ring). Hover/focus/tap reveals a tooltip `"{robot_name} · {event_name} · {display_value} · {autonomy} · {eligibility}"`. Year labels every 1 year when span ≤ 8, every 2 when greater. Dots jittered deterministically within a ±20px vertical band when their x-positions are within 20px. Mobile (<640px) wraps the plot in `overflow-x-auto` with a 560px min-width. Dot radius is 10px desktop / 8px mobile via responsive `w-4 md:w-5`.
- `tests/timeline.test.js` — two cases, both under assertion group 21: `buildTimeline` returns exactly 4 entries matching the four real performances by robot name; output is sorted by date ascending.

### Changed
- `components/ParityMeter.js` — now a client component. On mount, primary animates 0→target over 1200ms with `ease-out-cubic` via `requestAnimationFrame`; secondary starts 200ms later. The "gap" underline (red at 0%, amber mid-range, no underline at 100% — per 8a) is suppressed during the animation and fades in only when `done = true`. Honors `prefers-reduced-motion: reduce` by skipping the animation and rendering the final value + underline immediately. Current parity is 0% so the animation is cosmetic — the hook is in place for future non-zero states.
- `app/page.js` — loads `buildTimeline(ledger)` alongside `summarizeLedger(ledger)` and renders `<TimelineHero entries={timeline} />` between the parity meter and the event list, separated by 8a `SectionRule`s above and below.

### Notes
- Final dot count on the timeline: **4** (Cassie 2022-09-28, Tiangong Ultra 2025-08-15, H1 2025-08-15, Flash 2026-04-19).
- Robot name displayed in the tooltip is `performance.robot_model` (e.g. "Flash", "Tiangong Ultra") to match the rest of the app. The spec verification string "Honor Flash" combines `manufacturer + robot_model` — if you want that, say the word and I'll prefix manufacturer when it's a single word.
- Count-up mid-animation text update at target=0% is not observable (0 × eased = 0 for all t); the `done` → underline transition is the observable proof the hook fires. For non-zero targets the rAF loop will tick the number every frame.

## [Unreleased] — Commit 8a — Design foundation (2026-04-21)

Pure visual layer. No data, routes, or copy were changed. Tests: 67 → 67 passing.

### Added
- `tailwind.config.js` — explicit design-token system: typography scale (`display`/`h1`/`h2`/`h3`/`body`/`small`/`micro` with per-step size, line-height, and letter-spacing) and semantic color tokens (`bg`, `surface`, `card`, `border`, `ink`, `ink-muted`, `accent-verified`, `accent-experimental`, `accent-ineligible`, `accent-data`). Legacy tokens (`paper`/`panel`/`rule`/`robot`/`warn`/`parity`/…) are kept as aliases so pre-8a components keep rendering unchanged.
- `components/Brand.js` — `SignatureDot` (perfect green square, `0.35em × 0.35em`, baseline-aligned) and `SectionRule` (2px × 24px accent-verified vertical divider). The dot now replaces the `.` glyph in the homepage hero wordmark, header logo, methodology title, and event-detail breadcrumb.
- `lib/sport-glyphs.js` — seven monochrome 24×24 stroke-based SVG glyphs (`SprintGlyph`, `MiddleGlyph`, `DistanceGlyph`, `HurdlesGlyph`, `HighJumpGlyph`, `LongJumpGlyph`, `ArcheryGlyph`) plus a `glyphForEvent(event)` selector. Seven marks cover all 19 events — every `EventCard` now renders an inline glyph left of the event name at 20×20, inheriting text color via `currentColor`.

### Changed
- Typography pass: homepage hero wordmark → `text-display` (72px / 1.0 / -0.04em), tagline → `text-h3`; EventCard event name → `text-h3`, sanctioning/category line → `text-micro`; `/methodology` title → `text-h1`, all section headings → `text-h2`; `/event/[event_id]` hero → `text-h1` and all block labels → `text-micro`.
- `ParityMeter` — primary number now renders in `ink` (white) by default, with a single 2px underline as the "gap" signal: `accent-ineligible` (red) at 0%, `accent-experimental` (amber) between 0 and 100, full `accent-verified` (green) only when parity hits 100%. Zero no longer reads as celebratory.
- `bg-ink` → `bg-bg` across `layout.js`, `FilterBar`, and `SiteNav`. `ink` in the token system now semantically means body-text white (`#f4f3ef`); the deeper body background is the new `bg` token (`#0a0a0f`).
- `app/globals.css` — root body color updated to match new `ink` / `bg` tokens.

### Notes
- No assertions were retargeted. Test suite stayed at 67/67 passing. `npm run build` succeeds and generates all 27 static pages.
- Spacing rhythm documented in the tailwind config header — stays on Tailwind's default scale, targeting `1 / 2 / 4 / 6 / 10 / 16` (4 / 8 / 16 / 24 / 40 / 64 px) for section-level gaps.

## [Unreleased] — Commit 7.5 (2026-04-21)

### Added
- `autonomy` field on every performance entry in `data/ledger.json`. Allowed values: `autonomous`, `assisted`, `teleoperated`, `unknown`. The four real entries are tagged explicitly — Cassie 24.73s, Tiangong Ultra 26.87s, and Unitree H1 6:34.40 as `autonomous`; Honor Flash 50:26 (ineligible) as `assisted`.
- `components/AutonomyBadge.js` — pill component rendered next to the validation badge on `EventCard` and on each performance block on `/event/[event_id]` (best-robot card and ineligible-attempts section).
- Methodology section **What Counts as an Attempt** on `/methodology`, explaining that parity is capability parity (not head-to-head), what does not count, and that autonomy labels what a result means without gating eligibility.
- Three ledger-schema tests locking: every performance has an explicit autonomy value from the allowed set; the ledger has three autonomous + one assisted across the four real entries; `selectBestPerformance` preserves autonomy on its returned performance.

### Changed
- Honor Flash ineligibility reason on `mens-half-marathon` now appends a note that the Beijing E-Town run involved human handlers on-course, mid-event battery swaps, and manual course corrections — making explicit why the run is `assisted` and not a clean parity attempt.

### Notes
- `lib/engine.js` required no changes: `selectBestPerformance` already returns the raw performance object, so `autonomy` passes through as-is. Autonomy does not filter, it only labels — eligibility gates and tier logic are unchanged.
- Test count: 64 → 67 passing.

## [0.1.0] — 2026-04-19

Initial public release.

### Added

- Canonical event schema (`data/ledger.json`) with 23 individual Olympic events spanning
  track sprint, track endurance, field jumps, field throws, swimming sprint and
  endurance, speed skating (long and short track), archery, and rowing. Both Summer
  and Winter Olympic events represented.
- Validation engine (`lib/engine.js`):
  - HARD FAIL constraints (locomotion, energy source, terrain match)
  - Compliance eligibility (wind speed, wind legality, surface, equipment)
  - Status precedence: Parity beats Robot Lead within epsilon, direction-aware
  - Best-performance selection with experimental fallback
  - Two-denominator parity summary
- Projection engine (`lib/predict.js`): linear least-squares regression with
  guardrails (insufficient data, low fit, regressing trend, already passed,
  beyond horizon, already achieved) and three confidence tiers.
- Public site (Next.js 14 App Router):
  - `/` — hero, two-denominator parity meter, filterable event grid
  - `/event/[event_id]` — per-event detail with full performance history and
    projection chart
  - `/methodology` — full spec including the "Why bipedal?" anchor
  - `/audit` — links to the public commit history and ledger files
  - `/submit` — how to submit a verified performance via PR
  - `/about` — project context and invitation to sanctioning bodies
- Open Graph card and favicon generated at build time from the live ledger.
- Recognized sanctioning bodies constant (`lib/sanctioning-bodies.js`):
  World Athletics, FINA, ISU, IWF, UCI, World Archery, ISSF, FIS, IBU, IBSF,
  FIG, World Rowing, ProRL.
- Inaugural ProRL Combine 2026 placeholder entry on the men's 100m.
- Two hard-fail demonstration cases in `data/rejected-examples.json`.
- Test suite (`tests/engine.test.js`) covering all 12 required cases plus
  additional boundary tests. CI runs the suite plus the production build on
  every push and pull request.
- Repo-ready public docs: README, MIT LICENSE, CONTRIBUTING, PR template,
  three issue templates.
