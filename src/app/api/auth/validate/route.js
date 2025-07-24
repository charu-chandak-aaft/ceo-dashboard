// app/api/auth/validate/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../../lib/utils/verifyToken';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Token missing' }, { status: 401 });
  }

  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
