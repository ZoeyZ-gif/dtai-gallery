import { CozeAPI, COZE_CN_BASE_URL } from '@coze/api';

const client = new CozeAPI({
  token: async () => {
    const token = process.env.COZE_API_TOKEN;
    if (!token) {
      throw new Error('Missing COZE_API_TOKEN');
    }
    return token;
  },
  baseURL: COZE_CN_BASE_URL,
});

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

  try {
    const result = await client.bots.listNew({
      page_num: 1,
      page_size: 100,
    });

    return res.status(200).json({
      total: result.total,
      items: (result.items || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        isPublished: item.is_published,
      })),
    });
  } catch (error) {
    console.error('Coze list bots error:', error);
    return res.status(500).json({
      error: 'Failed to list Coze bots',
    });
  }
}
