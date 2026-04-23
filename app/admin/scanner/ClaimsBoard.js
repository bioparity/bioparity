'use client';

import { useCallback, useEffect, useState } from 'react';
import { PendingCard, ApprovedCard, RejectedCard } from './ClaimCard.js';

function StatBlock({ label, value, tone = '' }) {
  const toneClass =
    tone === 'verified'
      ? 'text-accent-verified'
      : tone === 'experimental'
      ? 'text-accent-experimental'
      : tone === 'ineligible'
      ? 'text-accent-ineligible'
      : 'text-paper';
  return (
    <div className="border border-rule rounded-lg p-4 bg-panel">
      <div className="text-[10px] uppercase tracking-widest text-dim">{label}</div>
      <div className={`text-2xl font-mono mt-1 tabular-nums ${toneClass}`}>{value}</div>
    </div>
  );
}

function SectionHeader({ count, label, tone }) {
  const dotTone =
    tone === 'verified'
      ? 'bg-accent-verified'
      : tone === 'experimental'
      ? 'bg-accent-experimental'
      : tone === 'ineligible'
      ? 'bg-accent-ineligible'
      : 'bg-dim';
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotTone}`} />
      <h2 className="text-xs uppercase tracking-widest text-dim">{label}</h2>
      <span className="text-faint text-micro tabular-nums">({count})</span>
    </div>
  );
}

function EmptyState({ children }) {
  return (
    <div className="border border-dashed border-rule rounded-lg p-6 text-center text-dim text-small">
      {children}
    </div>
  );
}

export default function ClaimsBoard({ password, onSignOut }) {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/claims', {
        headers: { authorization: `Bearer ${password}` },
        cache: 'no-store',
      });
      if (res.status === 401) {
        onSignOut?.();
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error ${res.status}`);
      }
      const data = await res.json();
      setBoard(data);
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  }, [password, onSignOut]);

  useEffect(() => {
    load();
  }, [load]);

  function applyUpdate(updated) {
    if (!updated) return;
    load();
  }

  if (loading && !board) {
    return <div className="text-dim text-small">Loading claims…</div>;
  }

  if (error && !board) {
    return (
      <div className="border border-rule rounded-lg bg-panel p-5">
        <div className="text-accent-ineligible text-small">{error}</div>
        <button
          type="button"
          onClick={load}
          className="mt-3 text-micro px-3 py-1.5 border border-rule rounded hover:text-paper"
        >
          Retry
        </button>
      </div>
    );
  }

  const { pending = [], approved = [], rejected = [], stats = {} } = board || {};
  const breakdown = Object.entries(stats.rejection_breakdown || {}).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="text-micro px-3 py-1.5 border border-rule rounded text-muted hover:text-paper disabled:opacity-40"
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="text-micro px-3 py-1.5 border border-rule rounded text-faint hover:text-paper"
        >
          Sign out
        </button>
      </div>

      <section>
        <SectionHeader
          label="Pending review"
          count={pending.length}
          tone="experimental"
        />
        {pending.length === 0 ? (
          <EmptyState>No pending claims.</EmptyState>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((c) => (
              <PendingCard
                key={c.id}
                claim={c}
                password={password}
                onUpdated={applyUpdate}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader
          label="Recent auto-approved (30d)"
          count={approved.length}
          tone="verified"
        />
        {approved.length === 0 ? (
          <EmptyState>No recent activity.</EmptyState>
        ) : (
          <div className="flex flex-col gap-3">
            {approved.map((c) => (
              <ApprovedCard
                key={c.id}
                claim={c}
                password={password}
                onUpdated={applyUpdate}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader
          label="Recent rejections (30d)"
          count={rejected.length}
          tone="ineligible"
        />
        {rejected.length === 0 ? (
          <EmptyState>No recent activity.</EmptyState>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rejected.map((c) => (
              <RejectedCard key={c.id} claim={c} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader label="Stats (all time)" count={stats.total ?? 0} tone="" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatBlock label="Total" value={stats.total ?? 0} />
          <StatBlock
            label="Auto-approved"
            value={stats.auto_approved ?? 0}
            tone="verified"
          />
          <StatBlock
            label="Manually approved"
            value={stats.manually_approved ?? 0}
            tone="verified"
          />
          <StatBlock
            label="Safety valve"
            value={stats.safety_valve ?? 0}
            tone="experimental"
          />
          <StatBlock
            label="Rejected"
            value={(stats.auto_rejected ?? 0) + (stats.manually_rejected ?? 0)}
            tone="ineligible"
          />
        </div>
        {breakdown.length > 0 && (
          <div className="mt-5 border border-rule rounded-lg bg-panel p-4">
            <div className="text-[10px] uppercase tracking-widest text-dim mb-3">
              Rejection breakdown
            </div>
            <ul className="flex flex-col gap-1.5">
              {breakdown.map(([rule, count]) => (
                <li
                  key={rule}
                  className="flex items-center justify-between text-small"
                >
                  <span className="text-muted truncate pr-3">{rule}</span>
                  <span className="text-paper font-mono tabular-nums">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
