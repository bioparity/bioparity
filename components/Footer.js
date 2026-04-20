export default function Footer() {
  return (
    <footer className="border-t border-rule mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8 text-xs text-dim leading-relaxed">
        <p className="mb-3">
          This ledger tracks verified human world records against cited robot performances.
          Seed robot entries are illustrative and flagged. Verified robot entries require a
          citation from a recognized sanctioning body. Full audit trail:{' '}
          <a
            href="https://github.com/bioparity/bioparity"
            className="underline hover:text-paper"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/bioparity/bioparity
          </a>{' '}
          — all changes via public PR.
        </p>
        <p className="text-faint">
          MIT licensed · contact{' '}
          <a href="mailto:hello@bioparity.io" className="underline hover:text-paper">
            hello@bioparity.io
          </a>
        </p>
      </div>
    </footer>
  );
}
