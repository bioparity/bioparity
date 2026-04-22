import path from 'node:path';
import { loadLedger } from '../../lib/engine.js';
import { getAllBriefs } from '../../lib/briefs.js';
import BriefCard from '../../components/BriefCard.js';
import { SignatureDot, SectionRule } from '../../components/Brand.js';

export const metadata = {
  title: 'Research Briefs — Bioparity',
  description: 'Short, sourced essays on specific parity questions. Peer-reviewed by contributors.',
};

function loadEventLookup() {
  const ledger = loadLedger(path.join(process.cwd(), 'data', 'ledger.json'));
  const lookup = {};
  for (const ev of ledger.events) lookup[ev.event_id] = ev;
  return lookup;
}

export default function BriefsIndexPage() {
  const briefs = getAllBriefs();
  const eventLookup = loadEventLookup();
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 md:py-16">
      <h1 className="font-bold tracking-tight text-4xl md:text-h1 inline-flex items-baseline gap-[0.08em]">
        Research Briefs<SignatureDot />
      </h1>
      <p className="text-ink-muted md:text-h3 mt-4 max-w-3xl">
        Short, sourced essays on specific parity questions. Peer-reviewed by contributors. One at a time, done right.
      </p>
      <SectionRule className="mt-10" />
      <div className="mt-10">
        {briefs.length === 0 ? (
          <p className="text-ink-muted md:text-h3">No briefs published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {briefs.map((b) => (
              <BriefCard key={b.slug} brief={b} eventLookup={eventLookup} />
            ))}
          </div>
        )}
      </div>

      <section className="mt-16">
        <h2 className="text-h2 font-semibold tracking-tight">Contribute</h2>
        <p className="text-muted leading-relaxed mt-3">
          Bioparity briefs are open to roboticists, ML researchers, sports scientists, and biomechanists.
          If you have a sourced argument about any question in the parity space — pacing, thermal limits,
          control horizons, actuator fatigue, sanctioning-body mismatch, fair-equipment definitions — open a PR.
        </p>
        <p className="text-muted leading-relaxed mt-3">
          Briefs live at{' '}
          <a
            href="https://github.com/bioparity/bioparity/tree/main/content/briefs"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-paper"
          >
            github.com/bioparity/bioparity/content/briefs
          </a>
          . Format is markdown with a YAML-style frontmatter block (see the existing draft as a template).
        </p>
        <p className="text-muted leading-relaxed mt-3">
          Review policy: every non-trivial claim needs a citation with a resolving URL. No editorializing, no
          speculation presented as fact. Briefs are MIT-licensed like the rest of Bioparity. Drafts land with a
          clear <em className="text-paper not-italic">DRAFT</em> label until a second contributor reviews.
        </p>
      </section>
    </div>
  );
}
