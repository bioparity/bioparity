import { getServiceClient, SCANNER_CLAIMS_TABLE, DISPOSITION } from './supabase.js';

const RECENT_WINDOW_DAYS = 30;

function recentCutoffISO() {
  const cutoff = new Date(Date.now() - RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  return cutoff.toISOString();
}

function normalizeRow(row) {
  if (!row) return row;
  return {
    id: row.id,
    created_at: row.created_at,
    reviewed_at: row.reviewed_at ?? null,
    disposition: row.disposition,
    rejection_reason: row.rejection_reason ?? null,
    safety_valve_reason: row.safety_valve_reason ?? null,
    article_title: row.article_title ?? null,
    article_url: row.article_url ?? null,
    source: row.source_id ?? null,
    robot: row.extracted_robot ?? null,
    event: row.extracted_event ?? null,
    time: row.extracted_time_raw ?? formatSeconds(row.extracted_time_seconds),
    autonomy: row.extracted_autonomy ?? null,
    date: row.extracted_date ?? null,
    extraction_confidence: row.extraction_confidence ?? null,
    ledger_committed: row.ledger_committed ?? false,
    rule_results: Array.isArray(row.rule_results) ? row.rule_results : [],
    raw: row,
  };
}

function formatSeconds(seconds) {
  if (seconds === null || seconds === undefined) return null;
  const n = Number(seconds);
  if (!Number.isFinite(n)) return null;
  if (n < 60) return `${n.toFixed(2)}s`;
  const m = Math.floor(n / 60);
  const s = n - m * 60;
  if (m < 60) return `${m}:${s.toFixed(2).padStart(5, '0')}`;
  const h = Math.floor(m / 60);
  const mm = m - h * 60;
  return `${h}:${String(mm).padStart(2, '0')}:${s.toFixed(2).padStart(5, '0')}`;
}

export async function fetchClaimsBoard() {
  const supabase = getServiceClient();
  const cutoff = recentCutoffISO();

  const [pendingRes, approvedRes, rejectedRes, allRes] = await Promise.all([
    supabase
      .from(SCANNER_CLAIMS_TABLE)
      .select('*')
      .eq('disposition', DISPOSITION.SAFETY_VALVE)
      .order('created_at', { ascending: false }),
    supabase
      .from(SCANNER_CLAIMS_TABLE)
      .select('*')
      .in('disposition', [DISPOSITION.AUTO_APPROVED, DISPOSITION.MANUALLY_APPROVED])
      .gte('created_at', cutoff)
      .order('created_at', { ascending: false }),
    supabase
      .from(SCANNER_CLAIMS_TABLE)
      .select('*')
      .in('disposition', [DISPOSITION.AUTO_REJECTED, DISPOSITION.MANUALLY_REJECTED])
      .gte('created_at', cutoff)
      .order('created_at', { ascending: false }),
    supabase.from(SCANNER_CLAIMS_TABLE).select('disposition, rejection_reason'),
  ]);

  for (const r of [pendingRes, approvedRes, rejectedRes, allRes]) {
    if (r.error) throw new Error(`Supabase: ${r.error.message}`);
  }

  const stats = computeStats(allRes.data ?? []);

  return {
    pending: (pendingRes.data ?? []).map(normalizeRow),
    approved: (approvedRes.data ?? []).map(normalizeRow),
    rejected: (rejectedRes.data ?? []).map(normalizeRow),
    stats,
  };
}

function computeStats(rows) {
  const stats = {
    total: rows.length,
    auto_approved: 0,
    manually_approved: 0,
    safety_valve: 0,
    auto_rejected: 0,
    manually_rejected: 0,
    rejection_breakdown: {},
  };
  for (const r of rows) {
    switch (r.disposition) {
      case DISPOSITION.AUTO_APPROVED:
        stats.auto_approved += 1;
        break;
      case DISPOSITION.MANUALLY_APPROVED:
        stats.manually_approved += 1;
        break;
      case DISPOSITION.SAFETY_VALVE:
        stats.safety_valve += 1;
        break;
      case DISPOSITION.AUTO_REJECTED:
        stats.auto_rejected += 1;
        if (r.rejection_reason) {
          stats.rejection_breakdown[r.rejection_reason] =
            (stats.rejection_breakdown[r.rejection_reason] ?? 0) + 1;
        }
        break;
      case DISPOSITION.MANUALLY_REJECTED:
        stats.manually_rejected += 1;
        if (r.rejection_reason) {
          stats.rejection_breakdown[r.rejection_reason] =
            (stats.rejection_breakdown[r.rejection_reason] ?? 0) + 1;
        }
        break;
      default:
        break;
    }
  }
  return stats;
}

export async function patchClaim(id, patch) {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from(SCANNER_CLAIMS_TABLE)
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(`Supabase: ${error.message}`);
  return normalizeRow(data);
}
