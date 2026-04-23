import { NextResponse } from 'next/server';
import { fetchClaimsBoard } from '../../../../lib/scanner-claims.js';
import { requireAdmin } from '../_auth.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const board = await fetchClaimsBoard();
    return NextResponse.json(board);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
