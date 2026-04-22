# Changelog

All notable changes to Bioparity are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased] — Commit 10 — Manual ingestion sweep (2026-04-22)

Adds verified humanoid performances from WHRG 2025 and Beijing E-Town 2026, codifies three new methodology Recording Rules, and finishes Commit 9's reframe by cleaning "Olympic" references from NEXT_STEPS.md. Tests 85 → 93.

### Changed
- `data/ledger.json` — Tiangong Ultra mens-100m time corrected from 26.87 s → **21.50 s** per Global Times 2025-08-17 closing coverage of WHRG 2025. Commit 7's speculative note about the 21.50 figure being "bonus-adjusted" was retired; the Global Times article reports 21.50 as the winning time with no adjustment language.
- `app/event/[event_id]/page.js` — renders a new `event_notes` field (dashed-border, italic-muted) when present on the event, below the status badge.
- `tests/engine.test.js` — test 18 retargeted from "exactly 4 real performances" → 10, with the new sorted model list. Test 20's autonomy-distribution assertion retargeted to 7 autonomous / 1 assisted / 1 teleoperated / 1 unknown.
- `tests/timeline.test.js` — test 21 retargeted from 4 → 9 timeline entries (one per valued performance; null-value Unitree hurdles entry is filtered out by `buildTimeline`).
- `tests/pipeline.test.js` — `ALLOWED_SOURCE_TYPES` extended with `'press coverage'` to distinguish third-party news reporting from first-party company press releases.
- `NEXT_STEPS.md` — three remaining "Olympic" references (lines from the original Commit 9 inventory) reframed to "track and field world records" / "World Athletics–ratified". Grep now returns zero matches for "olympic" in NEXT_STEPS.md.

### Added
- **WHRG 2025 performances:**
  - `mens-400m` — Unitree H1 gold, 1:28.00 (88.00 s), 2025-08-15, autonomous + eligible, cited to Global Times (exact 400m time per roboticsandautomationnews coverage since Global Times did not publish it).
  - `womens-100m-hurdles` — Unitree H1 gold, value `null` (no time published), 2025-08-15, autonomous + ineligible with a long category-mismatch reason explaining that WHRG's "100m hurdles" did not publish barrier height / gender category / spec-conformance and therefore cannot be treated as a parity attempt on the World Athletics women's 100m hurdles.
- **Beijing E-Town 2026 performances** (all on `mens-half-marathon`):
  - Honor Lightning, 48:19 (2899 s), **teleoperated** + ineligible (Rule 1), sourced from PBS/NPR; documented as the first humanoid across the finish line before the event's 20% teleop handicap moved Flash into the recognized-winner slot.
  - Honor Lightning, ~51:00 (3060 s approximate), autonomous + ineligible (event-rules: handler intervention, battery swaps, course corrections), CCTV-via-PBS source; exact time not published.
  - Honor Lightning, ~53:00 (3180 s approximate), autonomous + ineligible, same source and same event-rules reason.
  - Booster Robotics K1, 1:53:00 (6780 s), **unknown autonomy** + ineligible, cited to Global Times 2026-04-19 which reports the raw finish but does not classify K1's autonomy tier.
- **Event-level note** on `mens-half-marathon`: "The Beijing E-Town Humanoid Half Marathon 2026 had over 100 participating humanoid teams. Per Global Times reporting, 47 teams completed the course (18 autonomous, 29 teleoperated), a 45% completion rate. Bioparity records the top 5 finishers per autonomy tier where times are sourced. Full field results are maintained by the event organizer."
- **Recording Rules section** in `app/methodology/page.js` (verbatim headings, as required):
  - "Teleoperation is automatically ineligible."
  - "Large-field events are capped at five entries per autonomy tier."
  - "Approximate or category-mismatched events are not treated as parity attempts."
  - Cross-link added to the tail of "What Counts as an Attempt".
- `scripts/empty-events-audit-2026-04-22.json` — records the 5 events populated by Commit 10 (`mens-100m`, `mens-400m`, `mens-1500m`, `mens-half-marathon`, `womens-100m-hurdles`) and the 20 events that remain empty after a dedicated search. Two spec deltas reported in the audit's `notes` field (spec expected womens-100m and mens-110m-hurdles populated, but no sourced performance was found).
- **Pipeline additions** in `data/pipeline.json`:
  - `mirrorme-bolt-sprint-capability-2026` — MirrorMe's February 2, 2026 Bolt unveiling (10 m/s peak capability claim). Source URL substituted from the Commit 10 spec's reference (which pointed at an unrelated Unitree article) to CnEVPost's MirrorMe coverage, which actually documents the announcement.
  - `honor-autonomous-sub-record-halfmarathon-2027` — inferred open target (no direct Honor statement). Flagged as inferred in the notes.
- **Tests:**
  - `tests/ingestion.test.js` — 5 cases under group 28 (mens-400m has ≥1 perf, womens-100m-hurdles has ≥1, mens-half-marathon has ≥5, every source_url is syntactically valid, every teleoperated perf is ineligible with a teleop reason).
  - `tests/methodology-rules.test.js` — 3 cases under group 29 (verbatim Recording Rules headings).

### Task outcomes
- **TASK 1 path taken:** correction-in-place. The existing Tiangong Ultra entry on `mens-100m` had `source_url: globaltimes.cn/.../1341057.shtml` and `date: 2025-08-15`, both matching the Commit 10 spec's WHRG-2025 heuristic. The Global Times article itself (fetched during research) reports 21.50 s as the winning time with no handicap or adjustment language. Value updated from 26.87 → 21.50; notes rewritten to drop the prior unverified "bonus-adjusted" claim and point at the Global Times coverage.
- **Final parity denominator:** `events_with_attempts = 4` (not 7 as the spec projected). The denominator counts events with compliance-valid attempts, where `compliance-valid` requires `value !== null`. The womens-100m-hurdles entry has `value: null` per the spec and therefore does not raise the denominator; the 5 other populated events are: mens-100m (2 perfs), mens-400m (1), mens-1500m (1), and mens-half-marathon (5), but the Tiangong value fix and multiple perfs on half-marathon do not split an event across multiple "with attempts" rows — each event counts once. The net delta is 4 (up from 3) because mens-400m newly entered the "with attempts" set.
- **Final timeline dot count:** **9** (baseline 4 + Unitree H1 on 400m + 3 Honor Lightning runs + Booster K1; the null-value Unitree hurdles is properly filtered by `buildTimeline`).
- **Final test count: 93** (Commit 9 left 85 → +5 ingestion + 3 methodology-rules = 93).

### Notes
- **Lightning vs Flash naming:** the existing `mens-half-marathon` winner entry is `robot_model: "Flash"` per PBS and the original Commit 7.5 ingestion. Other outlets (Global Times, ITV, webpronews) name Honor's autonomous half-marathon platform "Lightning." Commit 10 kept Flash unchanged on the 50:26 winner per the spec, and used "Lightning" on the three new Honor entries matching the source material that identifies them. The model-name inconsistency is documented in the individual performance `notes` fields; a future commit may reconcile if Honor publishes an authoritative naming.
- **Event schema additions:** `event_notes` is a new top-level field on event objects. No tests are regression-protecting its presence yet; adding it is backwards-compatible with the engine, which does not read it.

## [Unreleased] — Commit 9 — Scope reframe: World Athletics–ratified records + 6 new events (2026-04-22)

Dropped "Olympic" framing in favor of World Athletics–ratified records. Added 5000m, 10000m, and 3000m steeplechase (men's and women's) to the ledger. Parity meter denominator is now 25 events. Methodology rewritten to anchor on the current World Athletics record list rather than the IOC program.

### Added
- `data/ledger.json` — six new event entries: `mens-5000m` (Joshua Cheptegei 12:35.36 / 755.36 s / 2020-08-14 Monaco), `womens-5000m` (Beatrice Chebet 13:58.06 / 838.06 s / 2024-05-25 Eugene), `mens-10000m` (Joshua Cheptegei 26:11.00 / 1571.00 s / 2020-10-07 Valencia), `womens-10000m` (Beatrice Chebet 28:54.14 / 1734.14 s / 2024-05-25 Eugene), `mens-3000m-steeplechase` (Lamecha Girma 7:52.11 / 472.11 s / 2023-06-09 Paris), `womens-3000m-steeplechase` (Beatrice Chepkoech 8:44.32 / 524.32 s / 2018-07-20 Monaco). All six start with `performances: []` and `verified_by: "World Athletics"`. `course_notes` field added on the two steeplechase events referencing World Athletics Rule 22 (28 barriers, 7 water jumps).
- `lib/sport-glyphs.js` — new `SteeplechaseGlyph` (24×24, 1.5 px stroke, currentColor; shape: fixed barrier + water pit with wavy line). 5000 m and 10 000 m reuse `DistanceGlyph` rather than a fragmented long-distance variant — the shape reads as "long distance" and the track-length chip + event name already carry the finer distinction.
- `tests/scope.test.js` — 4 new cases under group 26: ledger has exactly 25 events, every track-and-field event's `verified_by` is `World Athletics` (archery events excepted — World Archery), no `event_id` contains "olympic", all six Commit 9 `event_ids` are present.
- `tests/copy.test.js` — 2 new cases under group 27: case-insensitive "Olympic" regression guard on `app/page.js`, `app/methodology/page.js`, and `app/about/page.js`; `World Athletics` appears ≥ 2 times in the methodology source.

### Changed
- `lib/sport-glyphs.js` — `glyphForEvent` extended: steeplechase → `SteeplechaseGlyph`; 5000m/10000m → `DistanceGlyph`; fallback chain preserved.
- `app/page.js` — homepage tagline reframed to "human track and field world records. A canonical, public, auditable ledger anchored on the World Athletics–ratified record list."
- `app/layout.js` — site title, description, Open Graph, and Twitter cards all reframed. New title: `Bioparity — Human vs Robot Track & Field Parity Ledger`.
- `app/methodology/page.js` — Commit 7's "Scope: Why Summer Olympics Only" section rewritten as "Scope: Why World Athletics–Ratified Records" with three paragraphs explaining the ceiling argument, the quadrennial-subset point, and the locomotion-biomechanics exclusion (winter/equipment-mediated/throws). Event list updated to 25 entries. Added a new paragraph to "What Counts as an Attempt": "The parity meter measures against World Athletics world records. An attempt that would beat the record but fails sanctioning rules (wind, surface, equipment, handler intervention) is recorded as ineligible and does not move the meter."
- `app/about/page.js` — OG alt text and subhead reframed away from "Olympic" to "track and field world records". The Navy/Fallujah paragraph stays unchanged.
- `scripts/build-og.js` — OG card tagline reframed; regenerated `public/og.png` now reads "Tracking when humanoid robots match human track and field world records." Footer reads "0% across all 25 tracked."
- `data/sanctioned-events.json` — ProRL Combine notes rewritten to drop "Olympic" and explain that the 50 m sprint course has no ratified World Athletics record at that distance.
- `README.md`, `CONTRIBUTING.md`, `.github/ISSUE_TEMPLATE/new-event-request.md`, `package.json` — all one-liners reframed to "track and field world records (World Athletics–ratified)" or equivalent.
- `CHANGELOG.md` — historical 0.1.0 entry scrubbed of "Olympic" references (event counts adjusted, phrasing shifted to "summer and winter disciplines" with a pointer forward to Commit 9).
- `tests/engine.test.js` — test 18 updated from 19 → 25 event count and its approved-IDs set now lists all 25 IDs. Test 19 (`summarizeLedger.total_events`) updated from 19 → 25.
- `tests/about.test.js` — guard extended with a third assertion: no "Olympic" anywhere in `app/about/page.js`.

### Verification anchors — World Record sources (from worldathletics.org only)
| Event | Holder | Time | Date | Venue | Source |
|---|---|---|---|---|---|
| mens-5000m | Joshua Cheptegei (UGA) | 12:35.36 | 2020-08-14 | Monaco | [worldathletics.org press release](https://worldathletics.org/news/press-release/cheptegei-5000m-world-record-ratified) |
| womens-5000m | Beatrice Chebet (KEN) | 13:58.06 | 2024-05-25 | Eugene, USA | [worldathletics.org report](https://worldathletics.org/news/report/chebet-world-5000m-record-eugene-sub-14-prefontaine-classic) |
| mens-10000m | Joshua Cheptegei (UGA) | 26:11.00 | 2020-10-07 | Valencia, Spain | [worldathletics.org all-time list](https://worldathletics.org/records/all-time-toplists/middlelong/10000-metres/outdoor/men/senior) |
| womens-10000m | Beatrice Chebet (KEN) | 28:54.14 | 2024-05-25 | Eugene, USA | [worldathletics.org report](https://worldathletics.org/news/report/world-record-prefontaine-classic-eugene-2024) |
| mens-3000m-steeplechase | Lamecha Girma (ETH) | 7:52.11 | 2023-06-09 | Paris, France | [worldathletics.org press release](https://worldathletics.org/news/press-releases/ratified-world-records-kipyegon-1500m-5000m-girma-steeplechase-perez-race-walk) |
| womens-3000m-steeplechase | Beatrice Chepkoech (KEN) | 8:44.32 | 2018-07-20 | Monaco | [worldathletics.org press release](https://worldathletics.org/news/press-release/world-record-ratified-chepkoech) |

### Notes
- Parity meter is **fully data-driven** — `components/ParityMeter.js` reads `summary.total_events` and `summary.events_with_attempts` from `summarizeLedger(ledger)`. No hardcoded `19` or `25` anywhere in the UI.
- TimelineHero dot count unchanged at **4** — adding events with zero performances does not change the dot set.
- 6 new static event routes prerender cleanly: `/event/mens-5000m`, `/event/womens-5000m`, `/event/mens-10000m`, `/event/womens-10000m`, `/event/mens-3000m-steeplechase`, `/event/womens-3000m-steeplechase`. Total static pages: 31 → 37.
- Final test count: **85** (79 → +4 scope + 2 copy; existing tests 18/19 retargeted, about.test got one new assertion — no net change beyond the 6 additions).

## [Unreleased] — Commit 8e — Final /about copy + pre-push fixes (2026-04-22)

Last commit before the 8a–8e stack pushes to `main`. Tests stay at 79.

### Changed
- `app/about/page.js` — replaced the 8d scaffold with the final reviewed copy across all 5 sections (Who / Why Bioparity exists / How it was built / What I'm looking for / Contact) plus the subhead. Every `<Placeholder>` dashed-box wrapper removed. Contact section uses a mailto link for `hello@bioparity.io`, an external `target="_blank" rel="noopener noreferrer"` link to `github.com/bioparity/bioparity`, and a Next.js `<Link>` to `/methodology`.
- `tests/about.test.js` — the 8d scaffold-guard was replaced with a final-copy anchor test: exactly two "Fallujah" mentions (city + "Second Battle of Fallujah" — matches the final copy) and presence of `hello@bioparity.io`.
- `lib/timeline.js` — timeline entries now include `manufacturer` alongside `robot_name`.
- `components/TimelineHero.js` — robot display label in the tooltip and `aria-label` is now `{manufacturer} {robot_model}`. When the combined string exceeds 36 characters, the manufacturer portion is truncated at a word boundary ≤ 24 characters with an ellipsis.
- `components/SiteNav.js` — restored `Submit` and `Audit` after the 8d trim. Final order: (Home via logo) · Pipeline · Calendar · Briefs · Methodology · Submit · Audit · About. Seven entries in `LINKS`; Home is the header wordmark click target.

### Notes — reported items
- **Test count after 8a + 8b + 8c + 8d + 8e: 79.**
- **Manufacturer truncation applied on the timeline:** only the Tiangong Ultra entry triggered it (manufacturer "Beijing Innovation Center of Humanoid Robots" → 45 chars; combined with model → 59 chars → exceeded the 36-char threshold). Truncated at the word boundary ≤ 24 chars to "Beijing Innovation…", giving the final tooltip label `Beijing Innovation… Tiangong Ultra`. The other three entries rendered in full: `Agility Robotics Cassie`, `Unitree Robotics H1`, `Honor Flash`.
- **/about anchor assertions confirmed:** "Fallujah" appears exactly twice (intentional — city + Second Battle); `hello@bioparity.io` present.
- **Discrepancy with spec wording:** the task said "'Fallujah' appears exactly once", but the supplied final copy references "Fallujah, Iraq" then "the Second Battle of Fallujah" in the same sentence — two mentions. I preserved the copy as written and aligned the test assertion to `=== 2` so the anchor still locks the factual claim.

### Full cumulative file list — 8a + 8b + 8c + 8d + 8e

**Added**
- `components/Brand.js` (8a)
- `lib/sport-glyphs.js` (8a)
- `.claude/launch.json` (8a, preview)
- `lib/timeline.js` (8b; manufacturer field added in 8e)
- `components/TimelineHero.js` (8b; label logic upgraded in 8e)
- `tests/timeline.test.js` (8b)
- `data/pipeline.json` (8c)
- `data/sanctioned-events.json` (8c)
- `lib/briefs.js` (8c)
- `content/briefs/half-marathon-harder-than-marathon.md` (8c)
- `components/PipelineCard.js`, `components/CalendarEntry.js`, `components/BriefCard.js` (8c)
- `app/pipeline/page.js`, `app/calendar/page.js`, `app/briefs/page.js`, `app/briefs/[slug]/page.js` (8c)
- `tests/pipeline.test.js`, `tests/calendar.test.js`, `tests/briefs.test.js` (8c)
- `tests/about.test.js` (8d; rewritten in 8e)

**Modified**
- `tailwind.config.js` (8a)
- `app/globals.css` (8a)
- `app/layout.js` (8a)
- `app/methodology/page.js` (8a)
- `app/event/[event_id]/page.js` (8a)
- `app/page.js` (8a + 8b + 8c)
- `components/EventCard.js` (8a)
- `components/ParityMeter.js` (8a + 8b)
- `components/FilterBar.js` (8a)
- `components/SiteNav.js` (8a + 8c + 8d + 8e)
- `app/about/page.js` (8d scaffold + 8e final copy)
- `package.json` (8c — `react-markdown@^9`)
- `CHANGELOG.md` (entry per commit)

## [Unreleased] — Commit 8d — /about page scaffold (2026-04-22)

Visual-structure-only commit for the `/about` page. No real biographical or project copy was written — every section is an explicit `PLACEHOLDER` block. Tests: 78 → 79 passing.

### Added
- `tests/about.test.js` — guard test under group 25. Asserts `app/about/page.js` contains ≥ 6 `PLACEHOLDER` markers. Designed to FAIL when Brandon fills in the copy — that failure is the signal that the page is done.

### Changed
- `app/about/page.js` — replaced the prior "For sanctioning bodies / researchers / builders" layout with the 8d scaffold: six sections (header + Who + Why + How + What I'm looking for + Contact), each wrapping unwritten copy in a dashed-border italic ink-muted `<Placeholder>` block so the page reads as visibly unfinished both on localhost and in production. 8 total PLACEHOLDER markers across the page. Metadata extended with OpenGraph + Twitter tags pointing at the site-wide `/og.png`.
- `components/SiteNav.js` — final nav order is now Home (logo) · Pipeline · Calendar · Briefs · Methodology · About. `/submit` and `/audit` were removed from the nav per 8d's explicit order spec; the routes still exist and are reachable by direct URL.

### Notes
- Task 3 (homepage footer About link) was skipped per 8d's "skip if no homepage-specific footer" clause: the footer lives in `app/layout.js` as a site-wide component, not in `app/page.js`. Nav link covers the About route.
- The contact section on `/about` has a real (non-placeholder) paragraph with the `hello@bioparity.io` mailto and the GitHub repo link — per spec, only the "response expectations" tail paragraph is a placeholder.

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

- Canonical event schema (`data/ledger.json`) with 23 individual events spanning
  track sprint, track endurance, field jumps, field throws, swimming sprint and
  endurance, speed skating (long and short track), archery, and rowing. Both summer
  and winter disciplines represented at initial release. (Scope was later narrowed
  to World Athletics–ratified track and field events only; see Commit 9.)
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
