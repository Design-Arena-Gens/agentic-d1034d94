import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ok, setCommonHeaders } from './_lib/response';
import { store } from './_lib/store';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  setCommonHeaders(res);
  const data = store.kpi();
  return ok(res, data);
}
