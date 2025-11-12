import type { VercelRequest, VercelResponse } from '@vercel/node';
import { bad, methodNotAllowed, ok, setCommonHeaders, unauthorized } from './_lib/response';
import { store } from './_lib/store';
import { verifyToken } from './_lib/auth';
import { rateLimit } from './_lib/rateLimit';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCommonHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').toString();
  if (!rateLimit(`performance:${ip}`, 120, 60_000).ok) return bad(res, 'Rate limit exceeded');

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const user = token ? verifyToken(token) : null;
  if (!user) return unauthorized(res);

  if (req.method === 'GET') {
    const items = store.listPerformance();
    return ok(res, { items });
  }

  if (req.method === 'POST') {
    if (user.role === 'member') return unauthorized(res, 'Insufficient role');
    const { memberId, category, score } = req.body || {};
    if (!memberId || !category || typeof score !== 'number') return bad(res, 'memberId, category, score required');
    const item = store.addPerformance(memberId, category, Math.max(0, Math.min(100, score)));
    return ok(res, { item });
  }

  return methodNotAllowed(res);
}
