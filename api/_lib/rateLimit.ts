type Entry = { count: number; resetAt: number };
const store: Record<string, Entry> = {};

export function rateLimit(id: string, limit = 60, windowMs = 60_000) {
  const now = Date.now();
  const entry = store[id];
  if (!entry || entry.resetAt < now) {
    store[id] = { count: 1, resetAt: now + windowMs };
    return { ok: true };
  }
  entry.count += 1;
  if (entry.count > limit) return { ok: false };
  return { ok: true };
}
