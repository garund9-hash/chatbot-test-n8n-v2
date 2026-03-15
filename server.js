/**
 * Backend API Server
 * Security: Holds the n8n webhook URL server-side, never exposing it to the client.
 * The React app calls /api/chat, which forwards to the n8n webhook.
 *
 * This prevents the webhook URL from being embedded in the client JS bundle,
 * where it would be visible to any user inspecting DevTools or the source.
 *
 * To run in development:
 *   VITE_N8N_WEBHOOK_URL="https://..." node server.js
 *
 * To run in production, deploy this on a platform like:
 * - Vercel (serverless)
 * - Railway
 * - Heroku
 * - AWS Lambda
 * - Cloudflare Workers
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3001;

// The webhook URL is held server-side, never sent to the client
const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

if (!WEBHOOK_URL) {
  console.error('❌ N8N_WEBHOOK_URL environment variable is not set.');
  console.error('   Set it before starting the server: export N8N_WEBHOOK_URL="https://..."');
  process.exit(1);
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json());

// Rate limiter: 20 requests per IP per minute
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait before sending more messages.' },
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API endpoint: forward chat messages to n8n webhook
app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const MAX_MESSAGE_LENGTH = 2000;
    const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!message || typeof message !== 'string' || message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: 'Message must be a non-empty string under 2000 characters.' });
    }

    if (!sessionId || !UUID_V4_REGEX.test(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID.' });
    }

    // Forward the request to the n8n webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      return res.status(502).json({
        error: 'The AI service is temporarily unavailable. Please try again.',
      });
    }

    const data = await response.json();

    // Return the response from n8n to the client
    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`   - Chat endpoint: POST /api/chat`);
  console.log(`   - Health check: GET /health`);
});
