import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadLedger } from '../lib/engine.js';
import { buildCoverageSeries } from '../lib/coverage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEDGER_PATH = path.join(__dirname, '..', 'data', 'ledger.json');

test('30. buildCoverageSeries produces one entry per unique compliance-valid performance date, sorted ascending', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const series = buildCoverageSeries(ledger);
  assert.ok(series.length > 0, 'expected at least one coverage datapoint');
  for (let i = 1; i < series.length; i++) {
    assert.ok(
      series[i - 1].date < series[i].date,
      'coverage dates not strictly ascending: ' + series[i - 1].date + ' >= ' + series[i].date
    );
  }
});

test('30. buildCoverageSeries final entry matches current ledger summary (25% = 1 of 4)', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const series = buildCoverageSeries(ledger);
  const last = series[series.length - 1];
  assert.equal(last.attempted, 4, 'expected 4 attempted events at final date, got ' + last.attempted);
  assert.equal(last.parity_or_better, 1, 'expected 1 parity_or_better at final date, got ' + last.parity_or_better);
  assert.equal(last.pct, 25, 'expected 25% at final date, got ' + last.pct);
});

test('30. buildCoverageSeries is monotonic in parity_or_better and attempted (both only grow)', () => {
  const ledger = loadLedger(LEDGER_PATH);
  const series = buildCoverageSeries(ledger);
  for (let i = 1; i < series.length; i++) {
    assert.ok(
      series[i].attempted >= series[i - 1].attempted,
      'attempted regressed at ' + series[i].date
    );
    assert.ok(
      series[i].parity_or_better >= series[i - 1].parity_or_better,
      'parity_or_better regressed at ' + series[i].date
    );
  }
});
