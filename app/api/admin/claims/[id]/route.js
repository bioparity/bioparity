import { NextResponse } from 'next/server';
import { patchClaim } from '../../../../../lib/scanner-claims.js';
import { DISPOSITION } from '../../../../../lib/supabase.js';
import { requireAdmin } from '../../_auth.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ACTIONS = {
  approve: () => ({
    disposition: DISPOSITION.MANUALLY_APPROVED,
    reviewed_at: new Date().toISOString(),
    rejection_reason: null,
  }),
  reject: (body) => ({
    disposition: DISPOSITION.MANUALLY_REJECTED,
    reviewed_at: new Date().toISOString(),
    rejection_reason: (body.rejection_reason || 'rejected by admin').slice(0, 500),
  }),
  revoke: () => ({
    disposition: DISPOSITION.MANUALLY_REJECTED,
    reviewed_at: new Date().toISOString(),
    rejection_reason: 'revoked by admin after auto-approval',
  }),
};

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'missing id' }, { status: 400 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const action = body.action;
  const builder = ACTIONS[action];
  if (!builder) {
    return NextResponse.json(
      { error: `unknown action: ${action}` },
      { status: 400 }
    );
  }

  try {
    const updated = await patchClaim(id, builder(body));
    return NextResponse.json({ claim: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
