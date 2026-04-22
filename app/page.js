import path from 'node:path';
import { loadLedger, computeStatus, summarizeLedger, computeEventPriority } from '../lib/engine.js';
import { buildLeaderboard } from '../lib/leaderboard.js';
import ParityMeter from '../components/ParityMeter.js';
import ParityLeaderboard from '../components/ParityLeaderboard.js';
import FilterBar from '../components/FilterBar.js';
import { SignatureDot, SectionRule } from '../components/Brand.js';
import { SprintGlyph, HurdlesGlyph, ArcheryGlyph } from '../lib/sport-glyphs.js';

function loadData() {
  const ledgerPath = path.join(process.cwd(), 'data', 'ledger.json');
  const ledger = loadLedger(ledgerPath);
  const summary = summarizeLedger(ledger);
  const leaderboard = buildLeaderboard(ledger);
  const events = ledger.events.map(ev => ({
    event_id: ev.event_id,
    event_name: ev.event_name,
    sport_category: ev.sport_category,
    season: ev.season,
    metric_type: ev.metric_type,
    comparison_direction: ev.comparison_direction,
    human_record: ev.human_record,
    computed: computeStatus(ev),
    priority: computeEventPriority(ev),
  }));
  events.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.event_name.localeCompare(b.event_name);
  });
  return { events, summary, leaderboard };
}

export default function HomePage() {
  const { events, summary, leaderboard } = loadData();
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
      <section className="mb-10 md:mb-14">
        <h1 className="font-bold tracking-tight mb-4 text-5xl md:text-display inline-flex items-baseline gap-[0.08em]">
          Bioparity<SignatureDot />
        </h1>
        <p className="text-ink-muted max-w-3xl md:text-h3">
          Tracking when humanoid bipedal robots match or surpass human track and field world records.
          A canonical, public, auditable ledger anchored on the World Athletics–ratified record list.
        </p>
      </section>

      <section className="mb-10 md:mb-14">
        <ParityMeter summary={summary} />
      </section>

      <SectionRule className="mb-10 md:mb-14" />

      <section className="mb-10 md:mb-14">
        <ParityLeaderboard rows={leaderboard} />
      </section>

      <SectionRule className="mb-10 md:mb-14" />

      <section>
        <h2 className="text-micro uppercase text-dim mb-5">
          Events
        </h2>
        <FilterBar events={events} />
      </section>

      <SectionRule className="mt-10 md:mt-14 mb-10 md:mb-14" />

      <section>
        <h2 className="text-micro uppercase text-dim mb-5">
          Explore
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/pipeline"
            className="block border border-rule rounded-lg p-5 bg-panel hover:border-edge transition-colors"
          >
            <SprintGlyph size={24} className="text-paper" />
            <h3 className="text-h3 font-semibold text-paper mt-3">Pipeline</h3>
            <p className="text-small text-ink-muted mt-2">
              Publicly declared targets from labs chasing parity. Sourced or skipped.
            </p>
          </a>
          <a
            href="/calendar"
            className="block border border-rule rounded-lg p-5 bg-panel hover:border-edge transition-colors"
          >
            <HurdlesGlyph size={24} className="text-paper" />
            <h3 className="text-h3 font-semibold text-paper mt-3">Sanctioned Events</h3>
            <p className="text-small text-ink-muted mt-2">
              Every humanoid competition Bioparity recognizes, past and upcoming.
            </p>
          </a>
          <a
            href="/briefs"
            className="block border border-rule rounded-lg p-5 bg-panel hover:border-edge transition-colors"
          >
            <ArcheryGlyph size={24} className="text-paper" />
            <h3 className="text-h3 font-semibold text-paper mt-3">Research Briefs</h3>
            <p className="text-small text-ink-muted mt-2">
              Short, sourced essays on specific parity questions. Contributors welcome.
            </p>
          </a>
        </div>
      </section>
    </div>
  );
}
