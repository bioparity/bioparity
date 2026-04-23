import { createClient } from '@supabase/supabase-js';

let cached = null;

export function getServiceClient() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Supabase service client unavailable: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local'
    );
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      // Next.js 14 caches fetch by default; opt out so admin reads/writes hit Postgres live.
      fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }),
    },
  });
  return cached;
}

export const SCANNER_CLAIMS_TABLE = 'bioparity_scanner_claims';

export const DISPOSITION = {
  SAFETY_VALVE: 'safety_valve',
  AUTO_APPROVED: 'auto_approved',
  AUTO_REJECTED: 'auto_rejected',
  MANUALLY_APPROVED: 'manually_approved',
  MANUALLY_REJECTED: 'manually_rejected',
};
