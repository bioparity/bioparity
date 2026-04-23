'use client';

import { useEffect, useState } from 'react';
import ClaimsBoard from './ClaimsBoard.js';

const STORAGE_KEY = 'bioparity_admin_password';

export default function AdminGate() {
  const [password, setPassword] = useState(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) setPassword(stored);
    } catch {
      // sessionStorage unavailable — leave gated
    }
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (!input) return;
    setError('');
    setVerifying(true);
    try {
      const res = await fetch('/api/admin/claims', {
        headers: { authorization: `Bearer ${input}` },
        cache: 'no-store',
      });
      if (res.status === 401) {
        setError('Incorrect password.');
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || `Server error ${res.status}`);
        return;
      }
      try {
        sessionStorage.setItem(STORAGE_KEY, input);
      } catch {
        // ignore
      }
      setPassword(input);
      setInput('');
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setVerifying(false);
    }
  }

  function signOut() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setPassword(null);
  }

  if (!hydrated) {
    return <div className="text-dim text-small">Loading…</div>;
  }

  if (!password) {
    return (
      <form
        onSubmit={submit}
        className="max-w-sm border border-rule rounded-lg bg-panel p-5"
      >
        <label className="block text-micro uppercase tracking-widest text-dim mb-2">
          Admin password
        </label>
        <input
          type="password"
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-bg border border-rule rounded px-3 py-2 text-paper text-small focus:outline-none focus:border-accent-data"
          placeholder="••••••••"
        />
        {error && (
          <div className="text-accent-ineligible text-micro mt-2">{error}</div>
        )}
        <button
          type="submit"
          disabled={verifying || !input}
          className="mt-3 w-full bg-accent-data text-bg font-medium text-small px-4 py-2 rounded hover:opacity-90 disabled:opacity-40"
        >
          {verifying ? 'Checking…' : 'Sign in'}
        </button>
      </form>
    );
  }

  return <ClaimsBoard password={password} onSignOut={signOut} />;
}
