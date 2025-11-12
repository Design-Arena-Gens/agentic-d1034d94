import type { VercelRequest, VercelResponse } from '@vercel/node';
import { bad, methodNotAllowed, ok, setCommonHeaders, unauthorized } from './_lib/response';
import { store } from './_lib/store';
import { verifyToken } from './_lib/auth';
import { rateLimit } from './_lib/rateLimit';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCommonHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').toString();
  if (!rateLimit(`members:${ip}`, 120, 60_000).ok) return bad(res, 'Rate limit exceeded');

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const user = token ? verifyToken(token) : null;
  if (!user) return unauthorized(res);

  if (req.method === 'GET') {
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const items = store.listMembers(q);
    return ok(res, { items });
  }

  if (req.method === 'POST') {
    if (user.role === 'member') return unauthorized(res, 'Insufficient role');
    const { name, email } = req.body || {};
    if (!name || !email) return bad(res, 'name and email required');
    const item = store.addMember(name, email);
    return ok(res, { item });
  }

  if (req.method === 'DELETE') {
    if (user.role !== 'admin') return unauthorized(res, 'Admin only');
    const id = typeof req.query.id === 'string' ? req.query.id : '';
    if (!id) return bad(res, 'id required');
    store.deleteMember(id);
    return ok(res, { ok: true });
  }

  return methodNotAllowed(res);
}
