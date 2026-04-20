import path from 'node:path';
import { loadLedger, summarizeLedger } from '../../lib/engine.js';

export const metadata = {
  title: 'Audit — Bioparity',
  description: 'Every change is a public commit. The audit trail is the git history.',
};

const BUILD_TIME = new Date().toISOString();

export default function AuditPage() {
  const ledger = loadLedger(path.join(process.cwd(), 'data', 'ledger.json'));
  const summary = summarizeLedger(ledger);
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Audit</h1>
      <p className="text-muted text-lg mt-3 leading-relaxed">
        Bioparity has no database. The ledger lives in a single committed file. Every change —
        a new world record, a new robot performance, a corrected source — is a public commit on GitHub.
        That's the audit trail.
      </p>

      <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-rule rounded-lg p-4 bg-panel">
          <div className="text-xs uppercase tracking-wider text-dim">Total events</div>
          <div className="text-2xl font-mono mt-1 tabular-nums">{summary.total_events}</div>
        </div>
        <div className="border border-rule rounded-lg p-4 bg-panel">
          <div className="text-xs uppercase tracking-wider text-dim">With attempts</div>
          <div className="text-2xl font-mono mt-1 tabular-nums">{summary.events_with_attempts}</div>
        </div>
        <div className="border border-rule rounded-lg p-4 bg-panel">
          <div className="text-xs uppercase tracking-wider text-dim">Parity-or-better</div>
          <div className="text-2xl font-mono mt-1 tabular-nums text-robot">{summary.parity_or_better}</div>
        </div>
        <div className="border border-rule rounded-lg p-4 bg-panel">
          <div className="text-xs uppercase tracking-wider text-dim">Schema</div>
          <div className="text-2xl font-mono mt-1 tabular-nums">{ledger.schema_version}</div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-widest text-dim mb-3">Sources</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href="https://github.com/bioparity/bioparity/commits/main"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-paper text-muted"
            >
              github.com/bioparity/bioparity/commits/main
            </a>
            <span className="text-faint"> — every change to the ledger</span>
          </li>
          <li>
            <a
              href="https://github.com/bioparity/bioparity/blob/main/data/ledger.json"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-paper text-muted"
            >
              data/ledger.json
            </a>
            <span className="text-faint"> — the canonical ledger file</span>
          </li>
          <li>
            <a
              href="https://github.com/bioparity/bioparity/blob/main/data/rejected-examples.json"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-paper text-muted"
            >
              data/rejected-examples.json
            </a>
            <span className="text-faint"> — performances the validator rejects</span>
          </li>
          <li>
            <a
              href="https://github.com/bioparity/bioparity/pulls"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-paper text-muted"
            >
              github.com/bioparity/bioparity/pulls
            </a>
            <span className="text-faint"> — open and merged pull requests</span>
          </li>
        </ul>
      </section>

      <section className="mt-10 text-xs text-faint">
        Last build: <span className="font-mono">{BUILD_TIME}</span>
      </section>
    </div>
  );
}
