export const metadata = {
  title: 'Submit a performance — Bioparity',
  description: 'How to add a verified robot performance to the ledger.',
};

export default function SubmitPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Submit a performance</h1>
      <p className="text-muted text-lg mt-3 leading-relaxed">
        Bioparity accepts performance submissions through pull requests. There is no form, no
        account, no API key. The same path applies whether you are an individual researcher or a
        sanctioning body.
      </p>

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-widest text-dim mb-3">For verified entries</h2>
        <p className="text-muted leading-relaxed">
          A performance is treated as <span className="text-robot">verified</span> only when it
          carries a <code className="text-paper">source_url</code> citing a recognized sanctioning body.
          See <a href="/methodology" className="underline hover:text-paper">the methodology</a> for
          the full list. Without a citation, the performance is recorded as <span className="text-warn">experimental</span> and clearly flagged as such.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-widest text-dim mb-3">Steps</h2>
        <ol className="list-decimal pl-6 mt-3 text-muted space-y-3 leading-relaxed">
          <li>
            Fork{' '}
            <a
              href="https://github.com/bioparity/bioparity"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-paper"
            >
              github.com/bioparity/bioparity
            </a>
            .
          </li>
          <li>
            Edit <code className="text-paper">data/ledger.json</code>. Add a <code className="text-paper">RobotPerformance</code> object to the appropriate event's <code className="text-paper">performances</code> array. The schema is documented in the file's existing entries.
          </li>
          <li>
            Run the test suite locally: <code className="text-paper">npm install &amp;&amp; npm test</code>. CI will run the same checks on your PR.
          </li>
          <li>
            Open the pull request. The PR template asks for the source URL, the sanctioning body, and confirmation that the conditions match the event's regulations.
          </li>
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-widest text-dim mb-3">Unsourced submissions</h2>
        <p className="text-muted leading-relaxed">
          Pull requests that claim <code className="text-paper">verified</code> status without a
          citation from a recognized sanctioning body will be closed. This is how the ledger stays
          defensible. If your performance is not yet sanctioned, submit it as <code className="text-paper">experimental</code> with a clear <code className="text-paper">notes</code> field —
          it will appear in the ledger with the appropriate flag.
        </p>
      </section>

      <section className="mt-10 flex flex-wrap gap-3">
        <a
          href="https://github.com/bioparity/bioparity/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-4 py-2 border border-rule rounded hover:border-paper hover:text-paper text-muted"
        >
          Read CONTRIBUTING.md →
        </a>
        <a
          href="https://github.com/bioparity/bioparity/compare"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-4 py-2 border border-rule rounded hover:border-paper hover:text-paper text-muted"
        >
          Open a pull request →
        </a>
        <a
          href="mailto:hello@bioparity.io"
          className="text-xs px-4 py-2 border border-rule rounded hover:border-paper hover:text-paper text-muted"
        >
          Email hello@bioparity.io
        </a>
      </section>
    </div>
  );
}
