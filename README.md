# Nexus AI - n8n Powered Chat Service

A premium, production-grade chat interface built with React, Vite, and Vanilla CSS, featuring a "Hyper-Minimalist Glass-Futurism" aesthetic.

## Features

- **Direct n8n Integration**: Communicates via POST requests to a specified n8n webhook.
- **Session Management**: Automatically generates and persists `sessionId` for consistent conversations.
- **Glass-Futurism UI**: Features mesh gradients, noise textures, and smooth animations.
- **Responsive Design**: Optimized for both desktop and mobile viewports.
- **Powered by n8n**: Backend logic handled by n8n workflow automation.

## Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Custom tokens and glassmorphism)

## Integration Details

- **Webhook URL**: Configured via `VITE_N8N_WEBHOOK_URL` in `.env.local`.
- **Payload Format**:
  ```json
  {
    "message": "User input text",
    "sessionId": "Unique UUID for the session"
  }
  ```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
