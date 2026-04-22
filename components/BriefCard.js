export default function BriefCard({ brief, eventLookup }) {
  return (
    <a
      href={'/briefs/' + brief.slug}
      className="block border border-rule rounded-lg p-5 bg-panel hover:border-edge transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-h3 font-semibold text-paper">{brief.title}</h3>
        {brief.status === 'draft' && (
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-rule text-ink-muted whitespace-nowrap">
            Draft
          </span>
        )}
      </div>
      {brief.abstract && (
        <p className="text-body text-paper mt-2 leading-relaxed">{brief.abstract}</p>
      )}
      <div className="text-micro text-dim mt-3">
        {brief.date} · {brief.author}
      </div>
      {brief.event_tags && brief.event_tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {brief.event_tags.map((id) => {
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
    </a>
  );
}
