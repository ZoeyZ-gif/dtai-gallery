import { ChatStatus, CozeAPI, COZE_CN_BASE_URL, RoleType } from '@coze/api';

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

function extractAssistantReply(messages = []) {
  const assistantMessage = [...messages].reverse().find(message => (
    message.role === RoleType.Assistant
    && typeof message.content === 'string'
    && message.content.trim()
  ));

  return assistantMessage?.content?.trim() || '';
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const botId = process.env.COZE_BOT_ID;
  if (!botId || !process.env.COZE_API_TOKEN) {
    return res.status(500).json({ error: 'Coze server config is missing' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const userId = typeof body.userId === 'string' && body.userId.trim()
    ? body.userId.trim()
    : `dtai-${Date.now()}`;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const result = await client.chat.createAndPoll({
      bot_id: botId,
      user_id: userId,
      auto_save_history: true,
      additional_messages: [
        {
          role: RoleType.User,
          content: message,
          content_type: 'text',
        },
      ],
    });

    if (result.chat.status !== ChatStatus.COMPLETED) {
      return res.status(502).json({
        error: `Unexpected Coze chat status: ${result.chat.status}`,
      });
    }

    const reply = extractAssistantReply(result.messages);
    if (!reply) {
      return res.status(502).json({ error: 'Assistant reply is empty' });
    }

    return res.status(200).json({
      reply,
      chatId: result.chat.id || null,
      conversationId: result.chat.conversation_id || null,
    });
  } catch (error) {
    console.error('Coze proxy error:', error);
    return res.status(500).json({
      error: 'Failed to reach Coze agent',
    });
  }
}
