import path from 'node:path';
import { loadLedger, computeStatus, summarizeLedger } from '../lib/engine.js';
import ParityMeter from '../components/ParityMeter.js';
import FilterBar from '../components/FilterBar.js';

function loadData() {
  const ledgerPath = path.join(process.cwd(), 'data', 'ledger.json');
  const ledger = loadLedger(ledgerPath);
  const summary = summarizeLedger(ledger);
  const events = ledger.events.map(ev => ({
    event_id: ev.event_id,
    event_name: ev.event_name,
    sport_category: ev.sport_category,
    season: ev.season,
    metric_type: ev.metric_type,
    comparison_direction: ev.comparison_direction,
    human_record: ev.human_record,
    computed: computeStatus(ev),
  }));
  return { events, summary };
}

export default function HomePage() {
  const { events, summary } = loadData();
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
      <section className="mb-10 md:mb-14">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Bioparity<span className="text-robot">.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted max-w-3xl leading-relaxed">
          Tracking when humanoid bipedal robots match or surpass human Olympic world records.
          A canonical, public, auditable ledger.
        </p>
      </section>

      <section className="mb-10 md:mb-14">
        <ParityMeter summary={summary} />
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-dim mb-5">
          Events
        </h2>
        <FilterBar events={events} />
      </section>
    </div>
  );
}
