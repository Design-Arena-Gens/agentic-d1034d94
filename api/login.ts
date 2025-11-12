import type { VercelRequest, VercelResponse } from '@vercel/node';
import { bad, methodNotAllowed, ok, setCommonHeaders } from './_lib/response';
import { comparePassword, findUserByEmail, signToken } from './_lib/auth';
import { rateLimit } from './_lib/rateLimit';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCommonHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').toString();
  if (!rateLimit(`login:${ip}`, 30, 60_000).ok) return bad(res, 'Rate limit exceeded');
  if (req.method !== 'POST') return methodNotAllowed(res);

  const { email, password } = req.body || {};
  if (!email || !password) return bad(res, 'Email and password are required');
  const user = findUserByEmail(email);
  if (!user || !comparePassword(password, user.passwordHash)) return bad(res, 'Invalid credentials');
  const token = signToken({ sub: user.id, role: user.role, name: user.name, email: user.email });
  return ok(res, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
