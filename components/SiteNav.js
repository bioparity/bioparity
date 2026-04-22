'use client';

import { useState } from 'react';

// Home is the logo/wordmark click target in the header (app/layout.js), so it
// is not duplicated here. Final order matches the 8a-final spec.
const LINKS = [
  { href: '/pipeline', label: 'Pipeline' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/briefs', label: 'Briefs' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/submit', label: 'Submit' },
  { href: '/audit', label: 'Audit' },
  { href: '/about', label: 'About' },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="hidden lg:flex gap-6 text-sm text-muted">
        {LINKS.map(l => (
          <a key={l.href} href={l.href} className="hover:text-paper">{l.label}</a>
        ))}
      </nav>

      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="lg:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 text-paper"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 top-[57px] z-40 bg-bg/95 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <nav
            className="flex flex-col border-t border-rule"
            onClick={e => e.stopPropagation()}
          >
            {LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-6 py-5 text-base text-paper border-b border-rule hover:bg-panel min-h-[44px] flex items-center"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
