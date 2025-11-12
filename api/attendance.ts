import type { VercelRequest, VercelResponse } from '@vercel/node';
import { bad, methodNotAllowed, ok, setCommonHeaders, unauthorized } from './_lib/response';
import { store } from './_lib/store';
import { verifyToken } from './_lib/auth';
import { rateLimit } from './_lib/rateLimit';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCommonHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').toString();
  if (!rateLimit(`attendance:${ip}`, 120, 60_000).ok) return bad(res, 'Rate limit exceeded');

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const user = token ? verifyToken(token) : null;
  if (!user) return unauthorized(res);

  if (req.method === 'GET') {
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const items = store.getAttendance(date);
    return ok(res, { items });
  }

  if (req.method === 'POST') {
    if (user.role === 'member') return unauthorized(res, 'Insufficient role');
    const { items } = req.body || {};
    if (!Array.isArray(items)) return bad(res, 'items[] required');
    store.saveAttendance(items);
    return ok(res, { ok: true });
  }

  return methodNotAllowed(res);
}
