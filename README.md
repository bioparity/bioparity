# Bioparity

**Tracking when humanoid robots match human track and field world records (World Athletics–ratified). A public ledger.**

Live: **https://bioparity.io**

---

## What this is

Bioparity is a canonical, public, auditable ledger of the **Biological Parity Gap** —
the gap between the current World Athletics–ratified human world record on a given
track and field event and the best performance achieved by a humanoid bipedal robot
on the same event under regulation conditions.

Robots already beat humans at many things. None of those things matter to the question
this project exists to answer: *can a machine built like us outperform us at what we
do?* A wheeled robot winning a 100m sprint tells us nothing about that. A bipedal
robot running 9.57 seconds does.

The ledger lives in a single committed JSON file. Every change — a new record, a new
robot performance, a corrected source, a methodology refinement — is a public commit
on GitHub. The audit trail is the git history. There is no database. There is no
hidden moderation queue. There is no API key.

## Methodology at a glance

- **HARD FAIL** (rejected outright, never enters the ledger): non-bipedal locomotion,
  non-integrated power source (tethered or external), or terrain mismatch.
- **Eligibility** (passes hard-fail but ineligible for record purposes): wind speed
  over 2.0 m/s, illegal wind, non-standardized surface, non-compliant equipment. Each
  condition independently fails; the rejection reason lists every failing condition.
  Wind null is allowed for indoor / no-wind events and does **not** trigger
  ineligibility.
- **Validation status** is a separate axis from eligibility: `verified` (cited from a
  recognized sanctioning body), `experimental` (illustrative or unsanctioned), or
  `unverified` (pending). Best-performance selection requires both validation
  != unverified **and** eligibility = true. If no row clears both, the engine falls
  back to the best experimental row and surfaces a "Fallback: experimental" flag.
- **Status precedence**: a robot performance within an epsilon tolerance of the human
  record is **Parity** — even if numerically better. Only outside epsilon does it
  become **Robot Lead**.
- **Why bipedal**: parity is a biological question, not a performance question.

Full methodology, including the epsilon table per metric type and the "Why bipedal?"
section, lives at [/methodology](https://bioparity.io/methodology).

## How to contribute a verified robot performance

1. Fork [github.com/bioparity/bioparity](https://github.com/bioparity/bioparity).
2. Edit `data/ledger.json` and add a `RobotPerformance` to the appropriate event's
   `performances` array. Existing entries document the schema.
3. Run the test suite locally: `npm install && npm test`. CI runs the same checks.
4. Open a pull request. The PR template requires a `source_url` and
   `sanctioning_body` for any submission marked `verified`.

A performance is treated as **verified** only when the citation is from one of:
World Athletics, FINA, ISU, IWF, UCI, World Archery, ISSF, FIS, IBU, IBSF, FIG,
World Rowing, or ProRL. Pull requests that claim `verified` without a citation from
a recognized body will be closed.

## For sanctioning bodies

If you operate one of the recognized bodies above — or a body that should be
recognized — Bioparity is designed to be adopted, integrated, or forked. Specifically:

- **ProRL**: the inaugural ProRL Combine (Boston, 2026-04-19) is already represented
  in the ledger as a placeholder `unverified` entry on the men's 100m, awaiting
  results. We would gladly work with ProRL on an ingestion pipeline so future
  Combine results land in the ledger automatically.
- **Other federations**: if your body would like its sanctioned events used as the
  verification source for the corresponding ledger entries, or if you would like to
  fork this project for your own canonical ledger, please reach out.

Contact: **hello@bioparity.io**

## Tech stack

- Next.js 14 App Router (plain JavaScript, no TypeScript)
- Tailwind CSS
- Recharts (projection lines on event detail pages)
- Statically rendered from `data/ledger.json` at build time
- No database. No API keys. No analytics.
- Deployed on Vercel.

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # node --test runner — engine + projection tests
npm run build        # regenerates og.png + favicon.ico, then production build
```

The OG image (`public/og.png`) is regenerated on every build by
`scripts/build-og.js`, so the parity number on the social-share card always matches
the current ledger.

## License

[MIT](LICENSE). Copyright (c) 2026 Brandon Sterne. Forks, integrations, and adoption
by sanctioning bodies are explicitly welcome.

## Contact

**hello@bioparity.io**
