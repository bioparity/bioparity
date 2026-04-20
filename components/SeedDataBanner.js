'use client';

import { useState } from 'react';

export default function SeedDataBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="border border-rule rounded-lg bg-panel/60 px-4 py-3 mb-8 flex items-start gap-4">
      <p className="text-xs md:text-sm text-muted leading-relaxed text-center flex-1">
        <span className="text-paper font-medium">Seed Data Release.</span>{' '}
        Robot performances in this ledger are illustrative placeholders pending sanctioning body
        integration. Human world records are real and cited. The infrastructure is ready; the data
        pipeline is open.{' '}
        <a href="/submit" className="underline hover:text-paper text-paper">
          Submit a verified performance →
        </a>
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss seed data notice"
        className="text-faint hover:text-paper text-lg leading-none -mt-0.5 px-1"
      >
        ×
      </button>
    </div>
  );
}
