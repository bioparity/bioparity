import './globals.css';
import Footer from '../components/Footer.js';
import SiteNav from '../components/SiteNav.js';
import { SignatureDot } from '../components/Brand.js';

export const metadata = {
  metadataBase: new URL('https://bioparity.io'),
  title: 'Bioparity — Human vs Robot Track & Field Parity Ledger',
  description: 'A public, auditable ledger tracking when humanoid bipedal robots match or surpass human track and field world records (World Athletics–ratified).',
  alternates: {
    canonical: 'https://bioparity.io',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    url: 'https://bioparity.io',
    siteName: 'Bioparity',
    title: 'Bioparity — Human vs Robot Track & Field Parity Ledger',
    description: 'Tracking when humanoid robots match human track and field world records. A public ledger anchored on the World Athletics–ratified record list.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Bioparity — Tracking when humanoid robots match human track and field world records',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bioparity — Human vs Robot Track & Field Parity Ledger',
    description: 'Tracking when humanoid robots match human track and field world records. A public ledger.',
    images: ['/og.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-bg text-ink min-h-screen flex flex-col">
        <header className="border-b border-rule relative z-50 bg-bg">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="font-bold tracking-tight text-lg inline-flex items-baseline gap-[0.12em]">
              Bioparity<SignatureDot />
            </a>
            <SiteNav />
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
