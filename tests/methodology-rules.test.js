import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const METHODOLOGY_PATH = path.join(__dirname, '..', 'app', 'methodology', 'page.js');

// Commit 10 codified three Recording Rules on the methodology page. The exact
// strings are load-bearing — contributors reference them by name from brief
// sources and event-detail copy. These tests lock the verbatim headings.

test('29. methodology page contains Rule 1 heading verbatim', () => {
  const src = fs.readFileSync(METHODOLOGY_PATH, 'utf8');
  assert.ok(
    src.includes('Teleoperation is automatically ineligible'),
    'methodology page missing Rule 1 heading "Teleoperation is automatically ineligible"'
  );
});

test('29. methodology page contains Rule 2 heading verbatim', () => {
  const src = fs.readFileSync(METHODOLOGY_PATH, 'utf8');
  assert.ok(
    src.includes('Large-field events are capped at five entries per autonomy tier'),
    'methodology page missing Rule 2 heading "Large-field events are capped at five entries per autonomy tier"'
  );
});

test('29. methodology page contains Rule 3 heading verbatim', () => {
  const src = fs.readFileSync(METHODOLOGY_PATH, 'utf8');
  assert.ok(
    src.includes('Approximate or category-mismatched events are not treated as parity attempts'),
    'methodology page missing Rule 3 heading "Approximate or category-mismatched events are not treated as parity attempts"'
  );
});
