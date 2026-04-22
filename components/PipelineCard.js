import { glyphForEvent } from '../lib/sport-glyphs.js';

const STATUS_STYLES = {
  announced: { label: 'Announced', cls: 'bg-accent-data/15 text-accent-data border-accent-data/40' },
  'in progress': { label: 'In progress', cls: 'bg-accent-experimental/15 text-accent-experimental border-accent-experimental/40' },
  achieved: { label: 'Achieved', cls: 'bg-accent-verified/15 text-accent-verified border-accent-verified/40' },
  silent: { label: 'Silent', cls: 'bg-rule text-ink-muted border-rule' },
  abandoned: { label: 'Abandoned', cls: 'bg-accent-ineligible/15 text-accent-ineligible border-accent-ineligible/40' },
};

export default function PipelineCard({ entry, eventLookup }) {
  const targetEvent = eventLookup[entry.target_event_id];
  const Glyph = targetEvent ? glyphForEvent(targetEvent) : null;
  const status = STATUS_STYLES[entry.last_verified_status] || STATUS_STYLES.silent;
  return (
    <article className="border border-rule rounded-lg p-5 bg-panel flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {Glyph && <Glyph size={24} className="shrink-0 text-paper" />}
          <h3 className="text-h3 font-semibold text-paper truncate">{entry.lab}</h3>
        </div>
        <span className={'text-[10px] uppercase tracking-wider px-2 py-1 rounded border whitespace-nowrap ' + status.cls}>
          {status.label}
        </span>
      </div>
      <div>
        <div className="text-body text-paper">{entry.target_metric}</div>
        <div className="text-small text-ink-muted mt-1">
          Target{targetEvent ? ' · ' + targetEvent.event_name : ''} · by {entry.declared_timeline}
        </div>
      </div>
      <div className="mt-auto pt-3 border-t border-rule flex items-center justify-between text-micro text-dim gap-3">
        <a
          href={entry.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-paper truncate"
        >
          {entry.source_type} ↗ {entry.source_date}
        </a>
        <span className="shrink-0">Verified {entry.last_verified_date}</span>
      </div>
    </article>
  );
}
