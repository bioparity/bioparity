import AdminGate from './AdminGate.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata = {
  title: 'Scanner review — Bioparity admin',
  robots: { index: false, follow: false },
};

export default function AdminScannerPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <header className="mb-8">
        <div className="text-micro uppercase tracking-widest text-dim">Bioparity admin</div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">Scanner review</h1>
        <p className="text-muted text-small mt-2 leading-relaxed max-w-2xl">
          Claims written by the scanner Worker into{' '}
          <code className="text-paper">bioparity_scanner_claims</code>. Approve or reject items in the safety-valve queue; auto-approved entries can be revoked here as a safety net.
        </p>
      </header>
      <AdminGate />
    </div>
  );
}
