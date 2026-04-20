'use client';

import { useState, useMemo } from 'react';
import EventCard from './EventCard.js';

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'parity-or-better', label: 'Parity or Robot Lead' },
  { key: 'human-lead', label: 'Human Lead' },
  { key: 'no-attempts', label: 'No attempts' },
];

const SEASON_FILTERS = [
  { key: 'all', label: 'All seasons' },
  { key: 'summer', label: 'Summer' },
  { key: 'winter', label: 'Winter' },
];

function statusBucket(status) {
  if (status === 'Parity' || status === 'Robot Lead') return 'parity-or-better';
  if (status === 'Human Lead (no robot attempts)') return 'no-attempts';
  return 'human-lead';
}

export default function FilterBar({ events }) {
  const [statusKey, setStatusKey] = useState('all');
  const [seasonKey, setSeasonKey] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter(ev => {
      if (statusKey !== 'all' && statusBucket(ev.computed.status) !== statusKey) return false;
      if (seasonKey !== 'all' && ev.season !== seasonKey) return false;
      if (q && !(
        ev.event_name.toLowerCase().includes(q) ||
        ev.sport_category.toLowerCase().includes(q) ||
        (ev.computed.best_robot && ev.computed.best_robot.robot_model.toLowerCase().includes(q))
      )) return false;
      return true;
    });
  }, [events, statusKey, seasonKey, query]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setStatusKey(f.key)}
              className={
                'text-xs px-3 py-1.5 rounded border transition-colors ' +
                (statusKey === f.key
                  ? 'border-paper text-paper bg-edge'
                  : 'border-rule text-dim hover:text-paper hover:border-edge')
              }
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {SEASON_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setSeasonKey(f.key)}
              className={
                'text-xs px-3 py-1.5 rounded border transition-colors ' +
                (seasonKey === f.key
                  ? 'border-paper text-paper bg-edge'
                  : 'border-rule text-dim hover:text-paper hover:border-edge')
              }
            >
              {f.label}
            </button>
          ))}
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search…"
            className="text-xs px-3 py-1.5 rounded border border-rule bg-ink text-paper placeholder-faint focus:outline-none focus:border-paper w-40"
          />
        </div>
      </div>
      <div className="text-xs text-dim mb-4">
        Showing {filtered.length} of {events.length} events.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ev => (
          <EventCard key={ev.event_id} event={ev} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="border border-dashed border-rule rounded-lg p-12 text-center text-dim">
          No events match these filters.
        </div>
      )}
    </div>
  );
}
