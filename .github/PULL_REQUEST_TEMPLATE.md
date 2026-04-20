## Type of change

- [ ] New verified robot performance
- [ ] New human world record update
- [ ] New event added
- [ ] Code change / bug fix
- [ ] Documentation
- [ ] Methodology refinement

## Summary

<!-- One paragraph: what does this PR change, and why? -->

## If this is a data change

- **Event (event_id):**
- **Robot model:**
- **Manufacturer:**
- **Value (in canonical units — seconds, meters, or points — never display strings):**
- **Date (YYYY-MM-DD):**
- **Source URL (REQUIRED for `verified` entries):**
- **Sanctioning body:**
- **I confirm the source is from a recognized body listed in [/methodology](https://bioparity.io/methodology):** [ ]
- **I confirm the conditions (wind, surface, equipment) match the event's regulations:** [ ]

## Tests

- [ ] `npm install && npm test` passes locally
- [ ] `npm run build` completes without warnings

## Checklist

- [ ] No derived fields (`status`, `delta_to_parity`, `percent_to_parity`) added to `data/ledger.json`
- [ ] No `verified` entry has a null `source_url`
- [ ] All values use canonical units (no display strings)
