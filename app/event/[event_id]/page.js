import path from 'node:path';
import { notFound } from 'next/navigation';
import { loadLedger, computeStatus } from '../../../lib/engine.js';
import { project } from '../../../lib/predict.js';
import { formatValue, formatDelta, formatPercent, formatDate } from '../../../lib/format.js';
import PerformanceTable from '../../../components/PerformanceTable.js';
import ProjectionChart from '../../../components/ProjectionChart.js';
import ValidationBadge from '../../../components/ValidationBadge.js';

function getLedger() {
  return loadLedger(path.join(process.cwd(), 'data', 'ledger.json'));
}

export function generateStaticParams() {
  const ledger = getLedger();
  return ledger.events.map(e => ({ event_id: e.event_id }));
}

export function generateMetadata({ params }) {
  const ledger = getLedger();
  const event = ledger.events.find(e => e.event_id === params.event_id);
  if (!event) return { title: 'Event not found — Bioparity' };
  return {
    title: event.event_name + ' — Bioparity',
    description:
      'Human record: ' +
      formatValue(event.human_record.value, event.metric_type) +
      ' by ' +
      event.human_record.holder +
      '. Track parity progress on Bioparity.',
  };
}

function fractionalYear(iso) {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const start = Date.UTC(y, 0, 1);
  const end = Date.UTC(y + 1, 0, 1);
  return y + (d.getTime() - start) / (end - start);
}

const STATUS_BADGE = {
  'Robot Lead': 'bg-robot/15 text-robot border-robot/40',
  'Parity': 'bg-parity/15 text-parity border-parity/40',
  'Human Lead': 'bg-human/15 text-human border-human/40',
  'Human Lead (no eligible robot performance)': 'bg-rule text-dim border-rule',
  'Human Lead (no robot attempts)': 'bg-rule text-faint border-rule',
};

export default function EventPage({ params }) {
  const ledger = getLedger();
  const event = ledger.events.find(e => e.event_id === params.event_id);
  if (!event) notFound();

  const computed = computeStatus(event);
  const projection = project(event);

  const histPoints = (event.performances || [])
    .filter(p => p.value !== null && p.value !== undefined)
    .map(p => ({ year: fractionalYear(p.date), value: Number(p.value) }));

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 md:py-14">
      <a href="/" className="text-xs text-dim hover:text-paper">← All events</a>
      <div className="flex items-start justify-between gap-4 mt-3 mb-2">
        <div>
          <div className="text-xs uppercase tracking-widest text-dim mb-2">
            {event.sport_category} · {event.season}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{event.event_name}</h1>
        </div>
        <span className={'text-[10px] uppercase tracking-wider px-3 py-1.5 rounded border ' + (STATUS_BADGE[computed.status] || STATUS_BADGE['Human Lead'])}>
          {computed.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="border border-rule rounded-lg p-5 bg-panel">
          <div className="text-xs uppercase tracking-wider text-dim mb-2">Human world record</div>
          <div className="text-3xl font-mono tabular-nums">{formatValue(event.human_record.value, event.metric_type)}</div>
          <div className="text-sm text-muted mt-2">{event.human_record.holder}</div>
          <div className="text-xs text-dim mt-1">
            {formatDate(event.human_record.date)} ·{' '}
            <a href={event.human_record.source_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-paper">
              {event.human_record.verified_by}
            </a>
          </div>
        </div>
        <div className="border border-rule rounded-lg p-5 bg-panel">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="text-xs uppercase tracking-wider text-dim">Best robot performance</div>
            {computed.best_robot && computed.best_robot.validation_status !== 'verified' && (
              <ValidationBadge status={computed.best_robot.validation_status} />
            )}
          </div>
          {computed.best_robot ? (
            <>
              <div className="text-3xl font-mono tabular-nums">{formatValue(computed.best_robot.value, event.metric_type)}</div>
              <div className="text-sm text-muted mt-2">{computed.best_robot.robot_model}</div>
              <div className="text-xs text-dim mt-1">
                {formatDate(computed.best_robot.date)} · {computed.best_robot.manufacturer}
              </div>
              <div className="text-xs mt-3">
                <span className="text-faint">Δ to parity:</span>{' '}
                <span className="text-paper font-mono">{formatDelta(computed.delta_to_parity, event.metric_type)}</span>{' '}
                <span className="text-dim">({formatPercent(computed.percent_to_parity)})</span>
              </div>
              {computed.fallback && (
                <div className="text-[10px] uppercase tracking-wider text-warn mt-2">
                  Fallback: experimental
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-faint italic">No selectable performance.</div>
          )}
        </div>
      </div>

      {computed.best_robot && computed.best_robot.validation_status !== 'verified' && (
        <p className="text-xs text-dim italic mt-3 leading-relaxed">
          This performance is illustrative seed data, not a cited event. Real robot attempts
          require a citation from a recognized sanctioning body — see{' '}
          <a href="/methodology" className="underline hover:text-paper not-italic">methodology</a>{' '}
          or{' '}
          <a href="/submit" className="underline hover:text-paper not-italic">submit a verified performance</a>.
        </p>
      )}

      {projection.projected_year && (
        <section className="mt-10">
          <h2 className="text-xs uppercase tracking-widest text-dim mb-3">Projection</h2>
          <ProjectionChart
            historical={histPoints}
            humanRecord={event.human_record.value}
            projection={projection}
            metricType={event.metric_type}
            comparisonDirection={event.comparison_direction}
          />
          <div className="text-sm text-muted mt-3">
            Linear-trend extrapolation projects parity around{' '}
            <span className="text-paper font-mono">{Math.round(projection.projected_year)}</span>
            {' '}(confidence: <span className="text-paper">{projection.confidence}</span>).
            This is a naive least-squares fit, not a forecast — actual progress depends on hardware and software step-changes the model does not capture.
          </div>
        </section>
      )}

      {!projection.projected_year && projection.reason && (
        <section className="mt-10">
          <h2 className="text-xs uppercase tracking-widest text-dim mb-3">Projection</h2>
          <div className="border border-dashed border-rule rounded-lg p-5 text-sm text-dim">
            No projection: <span className="text-paper">{projection.reason.replace(/_/g, ' ')}</span>.
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-widest text-dim mb-3">Performance history</h2>
        <PerformanceTable event={event} />
      </section>

      <section className="mt-10">
        <a
          href={'https://github.com/bioparity/bioparity/issues/new?template=data-correction.md&title=Cite+source+for+' + encodeURIComponent(event.event_id)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs px-4 py-2 border border-rule rounded hover:border-paper hover:text-paper text-dim"
        >
          Cite a source · open an issue →
        </a>
      </section>
    </div>
  );
}
