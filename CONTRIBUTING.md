# Contributing to Bioparity

Bioparity is a public, MIT-licensed ledger. Contributions are welcome — particularly:

- New verified robot performances on existing events.
- Updates to existing human world records when they are broken.
- New events that fit the scope (individual, measurable, Olympic).
- Corrections to source URLs, dates, or values.
- Methodology refinements (open an issue first to discuss).
- Documentation, accessibility, and code quality improvements.

---

## Code of conduct

Be respectful. Critique data, not contributors. Unsourced claims will be closed;
unkind people will be blocked. This is a data project, not a debate club. Disagreements
about methodology happen in the open via issues and pull requests. Disagreements about
people do not happen here.

---

## Submitting a verified robot performance

1. Fork the repository at [github.com/bioparity/bioparity](https://github.com/bioparity/bioparity).
2. Open `data/ledger.json` and locate the relevant event by `event_id`.
3. Add a new entry to that event's `performances` array. Existing entries document
   the schema. The required fields are:
   - `performance_id` (UUID v4)
   - `robot_model`, `manufacturer`
   - `value` (canonical units: seconds, meters, or points — never raw display strings)
   - `date` (`YYYY-MM-DD`)
   - `validation_status` (`verified` for sanctioned, `experimental` otherwise)
   - `source_url` — **required** for `verified`. Must point to the sanctioning body's
     official record or result page.
   - `sanctioning_body` — must be one of the recognized bodies listed in
     [/methodology](https://bioparity.io/methodology) for `verified` entries.
   - `notes` — short context, especially for experimental entries.
   - `compliance` (locomotion, energy, terrain — see schema)
   - `environment` (surface, conditions, location, altitude)
   - `conditions_adjustment` (wind, surface, equipment)
   - `record_eligibility` (eligible + reason)
4. Run the tests locally: `npm install && npm test`. All tests must pass.
5. Run a build locally: `npm run build`. It must complete without warnings.
6. Open a pull request. Fill out the PR template.

---

## What gets a PR closed

- **No `source_url` on a `verified` entry.** Unsourced claims are not accepted as
  verified. No exceptions. This is how we stay defensible.
- **`source_url` from a body not in the recognized list.** If you believe a body
  should be added, open a separate issue to discuss it.
- **A `verified` entry that contradicts the cited source.** The value, date, and
  conditions in the entry must match what the source says.
- **A change to derived fields.** `status`, `delta_to_parity`, and `percent_to_parity`
  are computed at read time. They are never stored on disk. The test suite enforces this.
- **A change that breaks the test suite.** CI runs `node --test tests/*.test.js` on
  every PR.

---

## Reporting a bug or requesting an event

Use one of the issue templates:

- `bug.md` — something is broken or wrong on the site.
- `new-event-request.md` — an event that fits the scope is missing.
- `data-correction.md` — a value, date, or source is incorrect.

---

## Questions

Email **hello@bioparity.io** for anything that doesn't fit a PR or issue.
