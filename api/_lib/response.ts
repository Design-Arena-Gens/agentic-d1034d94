export function json(res: any, status: number, data: any) {
  setCommonHeaders(res);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export function ok(res: any, data: any) { json(res, 200, data); }
export function bad(res: any, message = 'Bad Request') { json(res, 400, { message }); }
export function unauthorized(res: any, message = 'Unauthorized') { json(res, 401, { message }); }
export function methodNotAllowed(res: any) { json(res, 405, { message: 'Method Not Allowed' }); }

export function setCommonHeaders(res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
}
