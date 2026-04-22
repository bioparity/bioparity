import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLedger, summarizeLedger } from '../lib/engine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(REPO_ROOT, 'public');

if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

const ledger = loadLedger(path.join(REPO_ROOT, 'data', 'ledger.json'));
const summary = summarizeLedger(ledger);
const primary = Math.round(summary.primary_pct);
const secondary = Math.round(summary.secondary_pct);

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect x="0" y="0" width="6" height="630" fill="#22c55e"/>
  <text x="80" y="118" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="44" font-weight="700" fill="#f5f5f5" letter-spacing="-1">Bioparity<tspan fill="#22c55e">.</tspan></text>
  <text x="80" y="168" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="22" fill="#a3a3a3">Tracking when humanoid robots match human track and field world records.</text>
  <text x="80" y="200" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="22" fill="#a3a3a3">A public ledger.</text>
  <text x="80" y="430" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="220" font-weight="700" fill="#22c55e" letter-spacing="-6">${primary}%</text>
  <text x="80" y="478" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="20" fill="#737373">Among events robots have attempted (${summary.parity_or_better}/${summary.events_with_attempts}) · ${secondary}% across all ${summary.total_events} tracked</text>
  <text x="80" y="560" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="18" fill="#525252">MIT licensed · audit trail at github.com/bioparity/bioparity · bioparity.io</text>
</svg>`;

const ogPng = new Resvg(ogSvg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
fs.writeFileSync(path.join(PUBLIC_DIR, 'og.png'), ogPng);
console.log('og.png written (' + ogPng.length + ' bytes, primary=' + primary + '%)');

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="10" fill="#0a0a0a"/>
  <text x="32" y="46" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="44" font-weight="700" fill="#22c55e" text-anchor="middle">B</text>
</svg>`;
const faviconPng = new Resvg(faviconSvg, { fitTo: { mode: 'width', value: 64 } }).render().asPng();
fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), faviconPng);
console.log('favicon.ico written (' + faviconPng.length + ' bytes, 64x64 PNG)');
