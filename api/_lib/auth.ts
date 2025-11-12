import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export type Role = 'admin' | 'instructor' | 'member';
export type User = { id: string; name: string; email: string; role: Role; passwordHash: string };

export const USERS: User[] = [
  { id: 'u1', name: 'Admin', email: 'admin@vinyasa.club', role: 'admin', passwordHash: bcrypt.hashSync('admin123', 8) },
  { id: 'u2', name: 'Instructor', email: 'instructor@vinyasa.club', role: 'instructor', passwordHash: bcrypt.hashSync('teach123', 8) },
  { id: 'u3', name: 'Member', email: 'member@vinyasa.club', role: 'member', passwordHash: bcrypt.hashSync('member123', 8) }
];

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-vinyasa';

export function signToken(payload: { sub: string; role: Role; name: string; email: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { sub: string; role: Role; name: string; email: string } | null {
  try { return jwt.verify(token, JWT_SECRET) as any; } catch { return null; }
}

export function findUserByEmail(email: string) { return USERS.find(u => u.email.toLowerCase() === email.toLowerCase()); }
export function comparePassword(plain: string, hash: string) { return bcrypt.compareSync(plain, hash); }
