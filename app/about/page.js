export const metadata = {
  title: 'About — Bioparity',
  description: 'Why this ledger exists and who it is for.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">About</h1>

      <p className="text-muted text-lg mt-4 leading-relaxed">
        Bioparity is a public, auditable ledger that tracks one specific question:
        when do humanoid bipedal robots match or surpass human Olympic world records?
      </p>

      <p className="text-muted leading-relaxed mt-4">
        The project exists because the answer to that question is interesting, contested, and
        currently fragmented across press releases and demo videos. There is no canonical place to
        check who is ahead, by how much, on which event, and under which conditions. Bioparity is
        an attempt to be that place — and to do so with the same evidentiary discipline a
        sanctioning body would apply to a human record.
      </p>

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-widest text-dim mb-3">For sanctioning bodies</h2>
        <p className="text-muted leading-relaxed">
          Bioparity is MIT licensed and designed to be forked, integrated, or adopted. If your
          organization wants to use this format, take ownership of the data ingestion pipeline, or
          have your sanctioned events cited as the verification source, please reach out:{' '}
          <a href="mailto:hello@bioparity.io" className="underline hover:text-paper">hello@bioparity.io</a>.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-widest text-dim mb-3">For researchers and journalists</h2>
        <p className="text-muted leading-relaxed">
          Every value, source URL, and validation flag in the ledger is in plain JSON in the GitHub
          repository. Cite it, reuse it, fork it. The audit trail is the git history.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-widest text-dim mb-3">For builders</h2>
        <p className="text-muted leading-relaxed">
          The schema, validator, and projection engine are deliberately small. Read{' '}
          <a
            href="https://github.com/bioparity/bioparity/blob/main/lib/engine.js"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-paper"
          >
            lib/engine.js
          </a>
          {' '}and you have the entire model. Contributions to the methodology happen via PR; debate
          happens in the open.
        </p>
      </section>

      <section className="mt-10 text-xs text-faint">
        Maintained by Brandon Sterne. Contact: <a href="mailto:hello@bioparity.io" className="underline">hello@bioparity.io</a>.
      </section>
    </div>
  );
}
