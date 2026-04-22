import path from 'node:path';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { loadLedger } from '../../../lib/engine.js';
import { getAllBriefs, getBriefBySlug } from '../../../lib/briefs.js';
import { SignatureDot, SectionRule } from '../../../components/Brand.js';

export function generateStaticParams() {
  return getAllBriefs().map((b) => ({ slug: b.slug }));
}

export function generateMetadata({ params }) {
  const brief = getBriefBySlug(params.slug);
  if (!brief) return { title: 'Brief not found — Bioparity' };
  return {
    title: brief.title + ' — Bioparity',
    description: brief.abstract || brief.title,
  };
}

function loadEventLookup() {
  const ledger = loadLedger(path.join(process.cwd(), 'data', 'ledger.json'));
  const lookup = {};
  for (const ev of ledger.events) lookup[ev.event_id] = ev;
  return lookup;
}

const MD_COMPONENTS = {
  h1: (props) => <h1 className="text-h2 font-bold tracking-tight mt-10 mb-4" {...props} />,
  h2: (props) => <h2 className="text-h2 font-semibold tracking-tight mt-10 mb-3" {...props} />,
  h3: (props) => <h3 className="text-h3 font-semibold tracking-tight mt-8 mb-3" {...props} />,
  p: (props) => <p className="text-body text-muted leading-relaxed mt-3" {...props} />,
  ul: (props) => <ul className="list-disc pl-6 mt-3 text-muted space-y-1" {...props} />,
  ol: (props) => <ol className="list-decimal pl-6 mt-3 text-muted space-y-1" {...props} />,
  a: (props) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-paper"
    />
  ),
  code: (props) => <code className="text-paper font-mono text-[0.9em]" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-2 border-rule pl-4 mt-3 text-ink-muted italic" {...props} />
  ),
};

export default function BriefPage({ params }) {
  const brief = getBriefBySlug(params.slug);
  if (!brief) notFound();
  const eventLookup = loadEventLookup();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 md:py-14">
      <a href="/briefs" className="text-xs text-dim hover:text-paper">← All briefs</a>
      <h1 className="mt-4 font-bold tracking-tight text-3xl md:text-h1 inline-flex items-baseline gap-[0.08em]">
        {brief.title}<SignatureDot />
      </h1>
      <p className="text-ink-muted md:text-h3 mt-4">
        By{' '}
        {brief.author_url ? (
          <a
            href={brief.author_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-paper"
          >
            {brief.author}
          </a>
        ) : (
          brief.author
        )}{' '}
        · {brief.date}
      </p>
      {brief.event_tags && brief.event_tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {brief.event_tags.map((id) => {
            const ev = eventLookup[id];
            const href = '/event/' + id;
            return (
              <a
                key={id}
                href={href}
                className="text-micro uppercase px-2 py-0.5 rounded border border-rule text-ink-muted hover:text-paper hover:border-edge"
              >
                {ev ? ev.event_name : id}
              </a>
            );
          })}
        </div>
      )}
      {brief.status === 'draft' && (
        <div className="mt-4 text-micro uppercase tracking-wider inline-block px-2 py-0.5 rounded border border-rule text-ink-muted">
          Draft
        </div>
      )}
      <SectionRule className="mt-10" />
      <article className="mt-6">
        <ReactMarkdown components={MD_COMPONENTS}>{brief.body}</ReactMarkdown>
      </article>
    </div>
  );
}
