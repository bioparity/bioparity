# Changelog

All notable changes to Bioparity are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased] — Commit 8c — Content layers: pipeline, calendar, briefs (2026-04-21)

Three new content surfaces. No data schema changes to the ledger. Tests: 69 → 78 passing.

### Added
- `data/pipeline.json` — publicly declared lab targets, schema locked in `tests/pipeline.test.js`. One verified entry at launch: Unitree's sub-10-second 100m target (Wang Xingxing, Yabuli Forum, per Global Times April 13, 2026).
- `data/sanctioned-events.json` — calendar of humanoid competitions Bioparity recognizes. Five seed entries: Cassie 100m Guinness attempt (OSU, 2022-05-11), 1st World Humanoid Robot Games (Beijing, Aug 2025), 2026 Beijing E-Town Humanoid Half Marathon (2026-04-19), Inaugural ProRL Combine (Boston Seaport, 2026-04-19), 2nd World Humanoid Robot Games (Beijing, Aug 22–26, 2026 — upcoming).
- `lib/briefs.js` — brief loader with a tiny inline YAML-subset frontmatter parser (strings, arrays, dates). No YAML dependency.
- `content/briefs/half-marathon-harder-than-marathon.md` — seed brief *scaffold* (not written content). Six section headings, each with a `[PLACEHOLDER — to be written]` paragraph. Status `draft`. Authored as "Bioparity contributors".
- `components/PipelineCard.js` — sport-glyph + lab + target-metric card with status pill colored per spec (announced=data blue, in progress=experimental amber, achieved=verified green, silent=muted gray, abandoned=ineligible red). External source link uses `target="_blank" rel="noopener noreferrer"`.
- `components/CalendarEntry.js` — date-range + event name + sanctioning-body tier badge (governing/league/event-organizer with matching accent colors). Event-type chips resolve against the ledger.
- `components/BriefCard.js` — abstract preview, draft label, event tag chips, date + author line.
- `app/pipeline/page.js`, `app/calendar/page.js`, `app/briefs/page.js`, `app/briefs/[slug]/page.js` — four new routes. All prerender statically at build time.
- `tests/pipeline.test.js`, `tests/calendar.test.js`, `tests/briefs.test.js` — nine new tests under groups 22/23/24: schema validation, URL shape validation (no fetching), and event-id cross-check against the ledger.
- Homepage "Explore" section — three cards linking to Pipeline, Calendar, Briefs, using the 8a glyphs (sprint / hurdles / archery) as repurposed UI icons.

### Changed
- `components/SiteNav.js` — added Pipeline, Calendar, Briefs to both desktop inline nav and mobile hamburger drawer. Order: Home (logo) · Pipeline · Calendar · Briefs · Methodology · Submit · Audit · About.
- `package.json` — added `react-markdown@^9` as the lightest option between the user's two choices (`@next/mdx` vs `react-markdown`). Required by `app/briefs/[slug]/page.js` to render future contributor markdown. Tailwind tokens from 8a are re-applied via custom `components` prop on `<ReactMarkdown>`.

### Notes — research provenance
Pipeline entries were constrained by the anti-fabrication rule: a lab entry is included only if (a) the target is concretely stated with a number and a date, (b) a working source URL exists, and (c) the source is a paper, press release, demo, or quoted interview. Labs I searched and checked:

| Lab | Outcome |
|---|---|
| **Unitree Robotics** | INCLUDED — Wang Xingxing stated at the 2026 Yabuli Entrepreneurs Forum that humanoids will break the 10-second 100m by mid-2026 (globaltimes.cn). |
| Honor | Dropped — Honor's test engineer spoke of transferring liquid-cooling and structural reliability tech "to industrial scenarios", not a concrete parity target for a new event. No numeric + dated commitment found. |
| Figure AI | Dropped — CEO video showed running demo; 4.3 km/h walking spec is a product stat, not a declared parity target. |
| Boston Dynamics | Dropped — CES 2026 Atlas announcement was industrial/enterprise deployment, not an athletic parity target. |
| Tesla | Dropped — Optimus Gen 3 "8 mph legs" is a product spec, not a tied-to-event parity target. |
| XPeng | Dropped — 2026 mass-production target is manufacturing, not parity. |
| 1X, Sanctuary AI, Apptronik, Fourier, UBTech, Agility Robotics (post-Cassie), Engineered Arts, Kepler, Galbot | Dropped — no specific numeric + dated + sourced parity target surfaced in the searches we ran. Generic roadmap language ("we're working on endurance / dexterity / mass production") does not meet the inclusion bar. |

Calendar entries were built from the four real performances already in the ledger plus two upcoming/known-real events (ProRL Combine, 2nd WHRG). Every `sanctioning_body` matches a code in `lib/sanctioning-bodies.js` — enforced by `tests/calendar.test.js`.

### Coverage check
No `event_id` in `data/ledger.json` is uncovered by the 8a `glyphForEvent` mapping — all 19 events resolve to one of the seven glyphs (5 sprint, 2 middle, 4 distance, 2 hurdles, 2 high-jump, 2 long-jump, 2 archery). Verified programmatically in 8b summary.

### Final counts
- Pipeline entries: **1** (Unitree sub-10s 100m)
- Calendar entries: **5** (1 upcoming + 4 completed)
- Brief scaffolds: **1** (draft)
- Tests: **78 passing** (69 → +3 pipeline + 4 calendar + 2 briefs)
- Static routes generated: **31** (27 → +4 new: /pipeline, /calendar, /briefs, /briefs/half-marathon-harder-than-marathon)

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
