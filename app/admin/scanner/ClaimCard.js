'use client';

import { useState } from 'react';

const RULE_GLYPH = {
  PASS: { ch: '✓', cls: 'text-accent-verified' },
  WARN: { ch: '⚠', cls: 'text-accent-experimental' },
  FAIL: { ch: '✕', cls: 'text-accent-ineligible' },
};

function formatTimestamp(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function MetaPair({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-widest text-faint">{label}</span>
      <span className="text-small text-paper tabular-nums break-words">
        {value || <span className="text-faint">—</span>}
      </span>
    </div>
  );
}

function RuleResults({ results }) {
  if (!results || results.length === 0) {
    return <div className="text-micro text-faint">No rule results recorded.</div>;
  }
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1">
      {results.map((r, i) => {
        const result = (r.result || '').toUpperCase();
        const glyph = RULE_GLYPH[result] || { ch: '·', cls: 'text-dim' };
        return (
          <li key={i} className="flex items-center gap-1.5 text-micro">
            <span className={`font-bold ${glyph.cls}`}>{glyph.ch}</span>
            <span className="text-muted">{r.rule || r.name || 'rule'}</span>
            {r.detail && <span className="text-faint">— {r.detail}</span>}
          </li>
        );
      })}
    </ul>
  );
}

function CardHeader({ claim }) {
  const headline = [claim.robot, claim.event, claim.time].filter(Boolean).join(' · ');
  return (
    <div className="flex flex-col gap-1">
      <div className="text-base md:text-lg text-paper font-semibold leading-snug">
        {headline || <span className="text-dim">Unparsed claim</span>}
      </div>
      {claim.article_title && (
        <a
          href={claim.article_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-small text-muted underline decoration-rule hover:text-paper hover:decoration-paper"
        >
          {claim.article_title}
        </a>
      )}
      {claim.source && (
        <div className="text-micro text-faint uppercase tracking-wider">{claim.source}</div>
      )}
    </div>
  );
}

export function PendingCard({ claim, password, onUpdated }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  async function dispatch(action, extra = {}) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/claims/${claim.id}`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ action, ...extra }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error ${res.status}`);
      }
      const body = await res.json();
      onUpdated?.(body.claim);
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="border border-rule rounded-lg bg-panel p-4 md:p-5 flex flex-col gap-4">
      <CardHeader claim={claim} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MetaPair label="Robot" value={claim.robot} />
        <MetaPair label="Event" value={claim.event} />
        <MetaPair label="Time" value={claim.time} />
        <MetaPair label="Autonomy" value={claim.autonomy} />
        <MetaPair label="Date" value={claim.date} />
      </div>

      {claim.safety_valve_reason && (
        <div className="text-micro">
          <span className="uppercase tracking-widest text-faint mr-2">Safety valve:</span>
          <span className="text-accent-experimental font-medium">{claim.safety_valve_reason}</span>
        </div>
      )}

      <div>
        <div className="text-[10px] uppercase tracking-widest text-faint mb-1">Rules</div>
        <RuleResults results={claim.rule_results} />
      </div>

      {error && <div className="text-accent-ineligible text-micro">{error}</div>}

      {!showReject ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => dispatch('approve')}
            className="px-4 py-2 text-small font-medium rounded bg-accent-verified text-bg hover:opacity-90 disabled:opacity-40"
          >
            Approve
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => setShowReject(true)}
            className="px-4 py-2 text-small font-medium rounded bg-accent-ineligible text-bg hover:opacity-90 disabled:opacity-40"
          >
            Reject
          </button>
          <span className="text-faint text-micro self-center ml-1">
            Received {formatTimestamp(claim.created_at)}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            autoFocus
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Why is this rejected?"
            className="bg-bg border border-rule rounded px-3 py-2 text-paper text-small focus:outline-none focus:border-accent-ineligible"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy || !rejectReason.trim()}
              onClick={() => dispatch('reject', { rejection_reason: rejectReason.trim() })}
              className="px-4 py-2 text-small font-medium rounded bg-accent-ineligible text-bg hover:opacity-90 disabled:opacity-40"
            >
              Confirm reject
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setShowReject(false);
                setRejectReason('');
              }}
              className="px-4 py-2 text-small font-medium rounded border border-rule text-muted hover:text-paper"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export function ApprovedCard({ claim, password, onUpdated }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function revoke() {
    if (!confirm('Revoke this auto-approved claim? It will be marked rejected.')) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/claims/${claim.id}`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ action: 'revoke' }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error ${res.status}`);
      }
      const body = await res.json();
      onUpdated?.(body.claim);
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="border border-rule rounded-lg bg-panel p-4 flex flex-col gap-3">
      <CardHeader claim={claim} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MetaPair label="Robot" value={claim.robot} />
        <MetaPair label="Event" value={claim.event} />
        <MetaPair label="Time" value={claim.time} />
        <MetaPair label="Autonomy" value={claim.autonomy} />
        <MetaPair label="Date" value={claim.date} />
      </div>

      <RuleResults results={claim.rule_results} />

      {error && <div className="text-accent-ineligible text-micro">{error}</div>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={revoke}
          className="px-3 py-1.5 text-micro font-medium rounded border border-accent-ineligible/60 text-accent-ineligible hover:bg-accent-ineligible/10 disabled:opacity-40"
        >
          Revoke
        </button>
        <span className="text-faint text-micro">
          Auto-approved {formatTimestamp(claim.created_at)}
        </span>
      </div>
    </article>
  );
}

export function RejectedCard({ claim }) {
  return (
    <article className="border border-rule rounded-lg bg-panel/60 p-4 flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-small text-muted truncate">
          {claim.article_title || claim.robot || 'Untitled claim'}
        </div>
        <span className="text-[10px] uppercase tracking-widest text-faint">
          {claim.disposition === 'manually_rejected' ? 'manual' : 'auto'}
        </span>
      </div>
      {claim.article_url && (
        <a
          href={claim.article_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-micro text-faint underline truncate hover:text-muted"
        >
          {claim.article_url}
        </a>
      )}
      <div className="text-micro text-accent-ineligible">
        {claim.rejection_reason || 'No reason recorded'}
      </div>
      <div className="text-[10px] text-faint">
        {formatTimestamp(claim.reviewed_at || claim.created_at)}
      </div>
    </article>
  );
}
