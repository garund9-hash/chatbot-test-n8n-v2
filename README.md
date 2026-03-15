# Nexus AI - Production-Grade Chat Interface

A modern, fully-refactored React chat application with n8n backend integration, featuring clean architecture, design patterns, and comprehensive security practices.

## 🎨 Features

- **Container/Presenter Architecture**: Clean separation of concerns with smart/dumb components
- **Custom Hooks**: Extracted logic (`useChat`, `useSession`, `useScrollToBottom`)
- **Design Patterns**: Adapter, Facade, Strategy, Factory, and Command patterns
- **Markdown Rendering**: Bot responses render markdown with syntax highlighting
- **Session Management**: UUID-based persistent conversations
- **Error Handling**: Proper error messages with distinct visual styling
- **Security**: Backend proxy prevents webhook URL exposure in client bundle
- **Glass-Futurism UI**: Modern glassmorphism design with gradients and animations
- **Responsive Design**: Mobile and desktop optimized

## 🏗️ Architecture

### Project Structure

```
src/
├── components/              # Presenter (dumb) components
│   ├── ChatHeader.jsx       # Header with avatar and controls
│   ├── ChatInput.jsx        # Message input form
│   ├── ChatWindow.jsx       # Compound root component
│   ├── MessageItem.jsx      # Single message with Strategy rendering
│   ├── MessageList.jsx      # Message list with scroll
│   └── MarkdownRenderer.jsx # Markdown rendering wrapper
│
├── hooks/                   # Custom React hooks
│   ├── useChat.js           # Primary application hook
│   ├── useSession.js        # Session persistence
│   └── useScrollToBottom.js # Scroll-to-bottom behavior
│
├── lib/                     # Utility functions
│   ├── messageFactory.js    # Message builders (Template Method)
│   ├── n8nAdapter.js        # Response normalization (Adapter)
│   └── commandRegistry.js   # Slash commands (Command pattern)
│
├── services/
│   └── chatApi.js           # HTTP facade for API communication
│
├── App.jsx                  # Container component
├── main.jsx                 # React entry point
└── index.css                # Design tokens and styles
```

### Design Patterns Applied

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Container/Presenter** | App.jsx + ChatWindow | Separate state logic from rendering |
| **Custom Hooks** | hooks/ | Encapsulate reusable logic |
| **Adapter** | lib/n8nAdapter.js | Normalize varied API responses |
| **Facade** | services/chatApi.js | Simplify HTTP communication |
| **Factory** | lib/messageFactory.js | Centralize message creation |
| **Command** | lib/commandRegistry.js | Extensible slash command dispatch |
| **Strategy** | components/MessageItem.jsx | Per-type message rendering |
| **Compound Component** | components/ChatWindow.jsx | Compose related sub-components |

## 🔧 Tech Stack

- **Frontend**: React 18 with Vite
- **Icons**: Lucide React
- **Markdown**: react-markdown
- **Backend**: Express.js (proxy server)
- **Build**: Vite with React plugin
- **Styling**: Vanilla CSS with design tokens

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

**Option 1: Frontend only (with Vite proxy)**
```bash
npm run dev
```
The dev server will proxy `/api/chat` requests to the backend.

**Option 2: Frontend + Backend together**
```bash
VITE_N8N_WEBHOOK_URL="https://your-n8n-webhook.com/webhook/xyz" npm run dev:full
```

### Backend Configuration

The backend server (`server.js`) handles the security-critical webhook forwarding.

**Set the webhook URL:**
```bash
export VITE_N8N_WEBHOOK_URL="https://yourname.app.n8n.cloud/webhook/..."
```

**Run the backend separately:**
```bash
npm run dev:backend
```

### Production Build

```bash
npm run build
npm run preview  # Preview the production build
```

## 📋 API Specification

### Client → Backend

**Endpoint**: `POST /api/chat`

**Request**:
```json
{
  "message": "What is machine learning?",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response**:
```json
{
  "output": "Machine learning is...",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Slash Commands

- `/clear` — Clear message history and start a new session
- `/help` — Show available commands
- `/session` — Display current session ID

## 🔒 Security Considerations

### Webhook URL Protection

The original design exposed the n8n webhook URL in the client bundle (`VITE_N8N_WEBHOOK_URL`). This refactoring fixes it:

**Before** (Unsafe):
```
Browser JS → n8n Webhook (URL visible in DevTools)
```

**After** (Secure):
```
Browser JS → Backend Proxy → n8n Webhook (URL server-side only)
```

The backend (`server.js`) holds the webhook URL as a server-side environment variable, preventing it from reaching the browser.

### Markdown Safety

Bot responses are rendered as markdown. The current implementation assumes n8n responses are trusted (from an LLM). For user-generated content, add DOMPurify sanitization:

```javascript
import DOMPurify from 'dompurify';
// In MarkdownRenderer.jsx
<ReactMarkdown>{DOMPurify.sanitize(children)}</ReactMarkdown>
```

## 🧪 Testing & Validation

### Manual QA Checklist

- [ ] Messages appear in the correct order (user right, bot left)
- [ ] Typing indicator shows while waiting for bot response
- [ ] Error messages render with red styling
- [ ] `/clear` resets the conversation and generates new session
- [ ] Markdown formatting (bold, code) renders correctly
- [ ] Scroll auto-advances to latest message
- [ ] Mobile layout is full-screen without padding

### Debugging

- **Enable React DevTools**: Install React Developer Tools browser extension
- **Network Inspector**: Monitor `/api/chat` requests in DevTools Network tab
- **Console Logs**: Errors and warnings appear in browser console
- **Local Storage**: Session ID stored under key `chat_session_id`

## 📊 Code Quality Improvements

### Before Refactoring

- ✗ Monolithic 195-line component with 9 concerns
- ✗ `isError` flag unused (dead code)
- ✗ Webhook URL exposed in client bundle
- ✗ `Date.now()` ID collisions possible
- ✗ Mixed inline styles + CSS
- ✗ No markdown rendering
- ✗ Ad-hoc response parsing

### After Refactoring

- ✓ Modular architecture with 13 focused files
- ✓ Error messages render distinctly
- ✓ Webhook URL held server-side
- ✓ UUIDs guarantee unique IDs
- ✓ All styles in CSS (no inline style={{}} blocks)
- ✓ Full markdown support with syntax highlighting
- ✓ Formal Adapter pattern for API responses
- ✓ Comprehensive documentation

## 🛠️ Deployment

### Option 1: Vercel (Recommended)

**Frontend** (Vercel):
```bash
npm run build
# Deploy dist/ folder to Vercel
```

**Backend** (Vercel Serverless Function):
Create `api/chat.js` with similar logic to `server.js`.

### Option 2: Self-Hosted

1. Deploy frontend (`dist/`) to static hosting (Nginx, Cloudflare, etc.)
2. Deploy backend (`server.js`) to a Node.js host (Railway, Heroku, AWS, etc.)
3. Set environment variable: `VITE_N8N_WEBHOOK_URL=...`

### Option 3: Docker

```dockerfile
# Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 📝 Environment Variables

### `.env.local` (Development)

```env
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

Note: With the new proxy architecture, this is only needed on the backend server.

## 🎓 Learning Resources

- [Design Patterns (GoF)](https://en.wikipedia.org/wiki/Design_Patterns)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [n8n Webhook Documentation](https://docs.n8n.io/)

## 📄 License

This project is provided as-is for educational and development purposes.
