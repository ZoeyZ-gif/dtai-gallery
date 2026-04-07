function setCorsHeaders(req, res) {
  const allowedOrigin = process.env.COZE_ALLOWED_ORIGIN || '*';
  const requestOrigin = req.headers.origin;
  const origin = allowedOrigin === '*' ? '*' : requestOrigin === allowedOrigin ? allowedOrigin : allowedOrigin;

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.COZE_API_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Missing COZE_API_TOKEN' });
  }

  return res.status(200).json({ token });
}
