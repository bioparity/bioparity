import { SANCTIONING_BODIES } from '../lib/sanctioning-bodies.js';

const TIER_STYLES = {
  governing: 'bg-accent-verified/15 text-accent-verified border-accent-verified/40',
  league: 'bg-accent-data/15 text-accent-data border-accent-data/40',
  'event-organizer': 'bg-accent-experimental/15 text-accent-experimental border-accent-experimental/40',
};

function formatDateRange(start, end) {
  if (!start) return '—';
  if (!end || end === start) return start;
  return start + ' → ' + end;
}

function findBody(code) {
  return SANCTIONING_BODIES.find((b) => b.code === code) || null;
}

export default function CalendarEntry({ entry, eventLookup }) {
  const body = findBody(entry.sanctioning_body);
  const tierCls = body && TIER_STYLES[body.tier] ? TIER_STYLES[body.tier] : 'bg-rule text-ink-muted border-rule';
  const tierLabel = body ? body.tier : 'unlisted';
  return (
    <article className="border border-rule rounded-lg p-5 bg-panel">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-micro uppercase text-dim mb-1 tabular-nums">
            {formatDateRange(entry.start_date, entry.end_date)}
          </div>
          <h3 className="text-h3 font-semibold text-paper">{entry.name}</h3>
          <div className="text-small text-ink-muted mt-2 flex flex-wrap items-center gap-2">
            <span>{entry.sanctioning_body}</span>
            <span className={'text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border whitespace-nowrap ' + tierCls}>
              {tierLabel}
            </span>
          </div>
          {entry.venue && (
            <div className="text-small text-ink-muted mt-1">{entry.venue}</div>
          )}
        </div>
      </div>
      {entry.event_types && entry.event_types.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {entry.event_types.map((id) => {
            const ev = eventLookup[id];
            return (
              <span
                key={id}
                className="text-micro uppercase px-2 py-0.5 rounded border border-rule text-ink-muted"
              >
                {ev ? ev.event_name : id}
              </span>
            );
          })}
        </div>
      )}
      {entry.notes && (
        <p className="text-small text-ink-muted mt-3 leading-relaxed">{entry.notes}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-micro">
        {entry.rules_url && (
          <a
            href={entry.rules_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dim underline hover:text-paper"
          >
            Rules ↗
          </a>
        )}
        {entry.results_url && (
          <a
            href={entry.results_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dim underline hover:text-paper"
          >
            Results ↗
          </a>
        )}
      </div>
    </article>
  );
}
