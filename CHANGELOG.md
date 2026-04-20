# Changelog

All notable changes to Bioparity are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
