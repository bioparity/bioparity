# Changelog

All notable changes to Bioparity are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
