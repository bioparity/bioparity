import path from 'node:path';
import fs from 'node:fs';
import { loadLedger } from '../../lib/engine.js';
import CalendarEntry from '../../components/CalendarEntry.js';
import { SignatureDot, SectionRule } from '../../components/Brand.js';

export const metadata = {
  title: 'Sanctioned Events — Bioparity',
  description: 'Every humanoid competition Bioparity recognizes, with sanctioning body, rules, and results.',
};

function loadEntries() {
  const p = path.join(process.cwd(), 'data', 'sanctioned-events.json');
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return [];
  }
}

function loadEventLookup() {
  const ledger = loadLedger(path.join(process.cwd(), 'data', 'ledger.json'));
  const lookup = {};
  for (const ev of ledger.events) lookup[ev.event_id] = ev;
  return lookup;
}

export default function CalendarPage() {
  const entries = loadEntries();
  const eventLookup = loadEventLookup();

  const upcoming = entries
    .filter((e) => e.status === 'upcoming')
    .sort((a, b) => (a.start_date < b.start_date ? -1 : 1));
  const completed = entries
    .filter((e) => e.status === 'completed')
    .sort((a, b) => (a.start_date > b.start_date ? -1 : 1));

  const isEmpty = entries.length === 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 md:py-16">
      <h1 className="font-bold tracking-tight text-4xl md:text-h1 inline-flex items-baseline gap-[0.08em]">
        Sanctioned Events<SignatureDot />
      </h1>
      <p className="text-ink-muted md:text-h3 mt-4 max-w-3xl">
        Every humanoid competition Bioparity recognizes, with sanctioning body, rules, and results. No rumors.
      </p>
      <SectionRule className="mt-10" />
      {isEmpty ? (
        <p className="text-ink-muted md:text-h3 mt-10">No sanctioned events tracked yet.</p>
      ) : (
        <>
          <section className="mt-10">
            <h2 className="text-micro uppercase text-dim mb-4">Upcoming</h2>
            {upcoming.length === 0 ? (
              <p className="text-small text-ink-muted">No upcoming events.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {upcoming.map((e) => (
                  <CalendarEntry key={e.id} entry={e} eventLookup={eventLookup} />
                ))}
              </div>
            )}
          </section>
          <section className="mt-10">
            <h2 className="text-micro uppercase text-dim mb-4">Completed</h2>
            {completed.length === 0 ? (
              <p className="text-small text-ink-muted">No completed events.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {completed.map((e) => (
                  <CalendarEntry key={e.id} entry={e} eventLookup={eventLookup} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
