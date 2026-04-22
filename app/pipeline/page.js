import path from 'node:path';
import fs from 'node:fs';
import { loadLedger } from '../../lib/engine.js';
import PipelineCard from '../../components/PipelineCard.js';
import { SignatureDot, SectionRule } from '../../components/Brand.js';

export const metadata = {
  title: 'Pipeline — Bioparity',
  description: 'Publicly declared humanoid-parity targets from labs, tracked to verifiable sources.',
};

function loadPipeline() {
  const p = path.join(process.cwd(), 'data', 'pipeline.json');
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

export default function PipelinePage() {
  const entries = loadPipeline();
  const eventLookup = loadEventLookup();
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
      <h1 className="font-bold tracking-tight text-4xl md:text-h1 inline-flex items-baseline gap-[0.08em]">
        Pipeline<SignatureDot />
      </h1>
      <p className="text-ink-muted md:text-h3 mt-4 max-w-3xl">
        Publicly declared targets from labs working on humanoid parity. Tracked to verifiable sources.
        Updated when labs announce, revise, or go silent.
      </p>
      <SectionRule className="mt-10" />
      <div className="mt-10">
        {entries.length === 0 ? (
          <p className="text-ink-muted md:text-h3">No verified pipeline entries yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((e) => (
              <PipelineCard key={e.id} entry={e} eventLookup={eventLookup} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
