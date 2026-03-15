# Getting Started: chatbot-test-n8n-v2

A quick-start guide for developers getting up and running with the React chatbot + n8n webhook integration.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Development Setup](#development-setup)
5. [Running the Application](#running-the-application)
6. [Running Tests](#running-tests)
7. [Building for Production](#building-for-production)
8. [Common Development Tasks](#common-development-tasks)
9. [Troubleshooting](#troubleshooting)
10. [Project Structure Quick Reference](#project-structure-quick-reference)

---

## Project Overview

**chatbot-test-n8n-v2** is a modern React chatbot application that:

- Provides a clean, user-friendly chat interface
- Integrates with n8n workflows for AI-powered responses
- Implements comprehensive security hardening (rate limiting, CORS, input validation, XSS prevention)
- Includes 91 unit tests for reliability and maintainability
- Uses React hooks for state management and TypeScript-ready patterns
- Deployed as a full-stack application (React frontend + Express backend)

### Key Technologies

| Component | Technology | Version |
|-----------|-----------|---------|
| **Frontend** | React | 18.3.1 |
| **Build Tool** | Vite | 5.4.10 |
| **Testing** | Vitest | 4.1.0 |
| **Backend** | Express | 4.18.2 |
| **Styling** | CSS Modules + CSS-in-JS | Native |
| **Markdown** | react-markdown | 8.0.7 |
| **Icons** | lucide-react | 0.454.0 |
| **HTTP** | Native fetch + cors, helmet | Latest |

---

## Prerequisites

### System Requirements

- **Node.js:** Version 16.x or higher (we recommend 18.x or 20.x)
- **npm:** Version 8.x or higher (included with Node.js)
- **Git:** For cloning the repository

### Verify Installation

```bash
node --version    # Should show v16.x.x or higher
npm --version     # Should show 8.x.x or higher
```

### External Service

- **n8n Account:** A running n8n instance with a webhook URL configured
  - Create a webhook endpoint in n8n that accepts POST requests with `message` and `sessionId`
  - The webhook should return a JSON response with `output` or `message` field

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/chatbot-test-n8n-v2.git
cd chatbot-test-n8n-v2
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all dependencies listed in `package.json`:
- Frontend: React, Vite, Testing libraries
- Backend: Express, CORS, rate limiting, security middleware
- Dev tools: Vitest, TypeScript, CSS-in-JS

**Installation Time:** ~2-5 minutes (depending on connection speed)

### Step 3: Create Environment Configuration

Create a `.env.local` file in the project root:

```bash
# Backend (Express Server)
# This is the n8n webhook URL that the backend will call
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chat-endpoint

# Optional: CORS allowed origin (default: http://localhost:5173)
ALLOWED_ORIGIN=http://localhost:5173

# Optional: Node environment (default: development)
NODE_ENV=development
```

**Important:**
- The webhook URL must be accessible from your backend server
- During development, use `http://localhost:5173` (Vite default port)
- For production, set `ALLOWED_ORIGIN` to your deployed frontend URL

### Step 4: Verify Installation

```bash
npm test -- --run
```

You should see:
```
Test Files  6 passed (6)
Tests      91 passed (91)
```

All 91 tests should pass with zero failures.

---

## Development Setup

### Project Layout

```
chatbot-test-n8n-v2/
├── src/                    # Frontend source code (React)
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── services/          # API service layer
│   ├── test/              # Test setup
│   ├── App.jsx            # Root component
│   ├── main.jsx           # DOM render entry
│   └── index.css          # Global styles
├── server.js              # Backend (Express)
├── vite.config.js         # Vite configuration
├── package.json           # Project metadata and scripts
├── docs/
│   ├── ADR.md            # Architecture Decision Records
│   ├── Walkthrough.md    # Technical deep-dive
│   └── Getting_started.md # This file
└── dist/                  # Build output (generated)
```

### Key Files to Know

| File | Purpose |
|------|---------|
| `server.js` | Express backend (proxy to n8n) |
| `src/App.jsx` | Root React component |
| `src/hooks/useChat.js` | Main chat logic hook |
| `src/services/chatApi.js` | HTTP API client |
| `src/lib/n8nAdapter.js` | n8n response normalization |
| `vite.config.js` | Build and dev server config |
| `.env.local` | Local environment variables |

---

## Running the Application

### Option 1: Frontend Only (with Backend Proxy)

If you have the backend running separately or on a hosted server:

```bash
npm run dev
```

Opens browser at `http://localhost:5173`

**Configuration:**
- Frontend runs on port 5173 (Vite dev server)
- Vite proxies `/api/chat` to `http://localhost:3001` (see `vite.config.js`)

### Option 2: Backend Only

For testing the backend API with tools like curl, Postman, or Insomnia:

```bash
N8N_WEBHOOK_URL="https://your-n8n-webhook-url" npm run dev:backend
```

Starts Express server on port 3001

**Test with curl:**
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "sessionId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### Option 3: Full Development (Frontend + Backend)

To run both simultaneously in one terminal:

```bash
npm run dev:full
```

This uses `concurrently` to start:
- Frontend on port 5173 (Vite)
- Backend on port 3001 (Express)

**Output:**
```
[0] vite v5.4.10 starting dev server...
[1] ✅ Server is running on http://localhost:3001
```

Open browser: `http://localhost:5173`

---

## Running Tests

### Run All Tests (Watch Mode)

```bash
npm test
```

**Features:**
- Re-runs tests automatically when files change
- Shows passing/failing tests in real-time
- Press `q` to quit

### Run Tests Once

```bash
npm test -- --run
```

Useful for:
- CI/CD pipelines
- Pre-commit hooks
- Verifying before pushing

### Run Tests with Coverage

```bash
npm run test:coverage
```

Generates coverage report showing:
- Lines covered
- Branch coverage
- Function coverage
- Statement coverage

### Run Tests for Specific File

```bash
npm test -- useChat        # Run useChat.test.js
npm test -- chatApi        # Run chatApi.test.js
npm test -- MessageItem    # Run MessageItem.test.jsx
```

### Test Structure

Tests are organized as:
- `src/hooks/useChat.test.js` - Chat logic tests
- `src/hooks/useSession.test.js` - Session management tests
- `src/services/chatApi.test.js` - API client tests
- `src/lib/n8nAdapter.test.js` - Response normalization tests
- `src/lib/commandRegistry.test.js` - Command dispatch tests
- `src/lib/messageFactory.test.js` - Message creation tests
- `src/components/MessageItem.test.jsx` - Component rendering tests

Each test file is independent and can be run in any order.

---

## Building for Production

### Step 1: Build Frontend

```bash
npm run build
```

Outputs optimized build to `dist/` directory:
- JavaScript minified and bundled
- CSS extracted and optimized
- Source maps generated (optional)
- Assets hashed for caching

**Build Output:**
```
dist/
├── index.html        # HTML entry point
├── assets/
│   ├── index-HASH.js # Main bundle
│   └── index-HASH.css # Styles
└── vite.svg          # Asset example
```

### Step 2: Preview Build Locally

```bash
npm run preview
```

Starts a local web server serving the built files from `dist/`

Useful to verify build works before deployment.

### Step 3: Deploy Backend

Backend deployment depends on your platform:

#### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Set environment variable:
```
N8N_WEBHOOK_URL=https://your-n8n-webhook-url
```

#### Railway

```bash
npm i -g railway
railway login
railway link
railway up
```

#### Heroku

```bash
# Create Procfile
echo "web: node server.js" > Procfile

heroku create
heroku config:set N8N_WEBHOOK_URL=https://your-n8n-webhook-url
git push heroku main
```

#### AWS Lambda

Use a serverless handler to wrap Express (requires adapter).

### Step 4: Verify Production Deployment

Test the API endpoint:

```bash
curl https://your-domain.com/health
# Should return: { "status": "ok" }

curl -X POST https://your-domain.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test message",
    "sessionId": "550e8400-e29b-41d4-a716-446655440000"
  }'
# Should return: { "output": "response from n8n" }
```

---

## Common Development Tasks

### Add a New Custom Hook

**Example: `useAuth()` for authentication**

1. Create `src/hooks/useAuth.js`:
```javascript
import { useState, useCallback } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(async (username, password) => {
    // ... authentication logic
    setIsAuthenticated(true);
  }, []);

  return { isAuthenticated, login };
}
```

2. Create `src/hooks/useAuth.test.js`:
```javascript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth.js';

describe('useAuth', () => {
  it('initially returns isAuthenticated=false', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('sets isAuthenticated=true after login', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login('user', 'pass');
    });
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

3. Use in `App.jsx`:
```javascript
import { useAuth } from './hooks/useAuth.js';

export function App() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <ChatWindow /> : <LoginForm />;
}
```

4. Run tests:
```bash
npm test -- useAuth
```

### Add a New Command

**Example: Add `/info` command**

1. Update `src/lib/commandRegistry.js`:
```javascript
export const commandRegistry = {
  '/clear': (context) => {
    context.clearChat();
  },
  '/help': (context) => {
    const available = Object.keys(commandRegistry).join(', ');
    context.addSystemMessage(`Available commands: ${available}`);
  },
  '/info': (context) => {
    context.addSystemMessage(`Using session: ${context.sessionId}`);
  },
};
```

2. Update tests in `src/lib/commandRegistry.test.js`:
```javascript
it('/info shows session ID', () => {
  const context = {
    sessionId: 'test-uuid',
    addSystemMessage: vi.fn(),
  };
  executeCommand('/info', context);
  expect(context.addSystemMessage).toHaveBeenCalledWith('Using session: test-uuid');
});
```

3. Run tests:
```bash
npm test -- commandRegistry
```

4. Manually test in browser:
   - Start dev server: `npm run dev:full`
   - Type `/info` in chat
   - See session ID displayed

### Update n8n Response Shape

If n8n changes its response format:

1. Update `src/lib/n8nAdapter.js`:
```javascript
export function n8nResponseAdapter(data) {
  // ... existing code

  // Add new response shape support
  if (hasUsableValue(data, 'response')) {
    return String(data.response);
  }

  throw new UnrecognizedResponseError(data);
}
```

2. Add test to `src/lib/n8nAdapter.test.js`:
```javascript
it('extracts response key', () => {
  const result = n8nResponseAdapter({ response: 'hello' });
  expect(result).toBe('hello');
});
```

3. Run tests to verify:
```bash
npm test -- n8nAdapter
```

### Change Rate Limiting

Edit `server.js`:

```javascript
// Current: 20 requests per minute per IP
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,      // 1 minute window
  max: 20,                  // Max 20 requests
});

// Example: 10 requests per minute
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
});

// Example: 100 requests per 5 minutes
const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
});
```

### Modify Message Validation

Edit `server.js`:

```javascript
// Current: max 2000 characters
const MAX_MESSAGE_LENGTH = 2000;

// Change to 5000 characters
const MAX_MESSAGE_LENGTH = 5000;

// Also update the JSON body limit if needed
app.use(express.json({ limit: '10kb' })); // Default 10KB

// For larger payloads
app.use(express.json({ limit: '100kb' }));
```

### Add Custom Styling

1. Update `src/index.css`:
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
}

.message.bot {
  background-color: var(--primary-color);
  /* ... */
}
```

2. Or use inline styles in components:
```javascript
const MESSAGE_STYLE = { backgroundColor: '#007bff', color: '#fff' };

export function MessageItem({ message }) {
  return <div style={MESSAGE_STYLE}>{message.text}</div>;
}
```

### Debug a Failing Test

1. Run test in isolation:
```bash
npm test -- messageFactory
```

2. Use `it.only()` to run single test:
```javascript
it.only('should create message with unique ID', () => {
  // Test code
});
```

3. Add debug logging:
```javascript
it('should work', () => {
  const result = myFunction(input);
  console.log('Result:', result); // Will print in test output
  expect(result).toBe(expected);
});
```

4. Use `it.skip()` to skip tests:
```javascript
it.skip('should X (not ready yet)', () => {
  // Test code
});
```

---

## Troubleshooting

### Issue: "Cannot find module" errors

**Symptom:**
```
Error: Cannot find module './src/hooks/useChat.js'
```

**Solution:**
- Ensure all import paths are correct and relative
- Check file names match (case-sensitive on Linux/macOS)
- Run `npm install` to ensure dependencies installed

```bash
npm install
npm test -- --run
```

---

### Issue: Tests fail with "fetch is not defined"

**Symptom:**
```
ReferenceError: fetch is not defined
```

**Solution:**
This is normal in jsdom environment. Tests should mock fetch:

```javascript
import { vi } from 'vitest';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});
```

The codebase already handles this in all test files.

---

### Issue: Port 5173 already in use

**Symptom:**
```
EADDRINUSE: address already in use :::5173
```

**Solution 1:** Kill existing process
```bash
# macOS/Linux
lsof -i :5173
kill -9 <PID>

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

**Solution 2:** Use different port
```bash
npm run dev -- --port 5174
```

---

### Issue: Port 3001 already in use (backend)

**Symptom:**
```
EADDRINUSE: address already in use :::3001
```

**Solution 1:** Kill existing process
```bash
# macOS/Linux
lsof -i :3001
kill -9 <PID>
```

**Solution 2:** Change port
```bash
PORT=3002 npm run dev:backend
```

Then update `vite.config.js`:
```javascript
proxy: {
  '/api/chat': {
    target: 'http://localhost:3002', // Changed from 3001
  }
}
```

---

### Issue: N8N_WEBHOOK_URL not set

**Symptom:**
```
❌ N8N_WEBHOOK_URL environment variable is not set.
Server failed to start
```

**Solution:**
Set the environment variable before starting backend:

```bash
# macOS/Linux
export N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/chat"
npm run dev:backend

# Windows (Command Prompt)
set N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chat
npm run dev:backend

# Windows (PowerShell)
$env:N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/chat"
npm run dev:backend

# Or use .env.local file
# Create file: .env.local
# Add line: N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chat
npm run dev:backend
```

---

### Issue: "Origin not allowed" CORS error

**Symptom:**
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource
```

**Solution:**
Update `ALLOWED_ORIGIN` in `.env.local`:

```bash
# If running frontend on different port
ALLOWED_ORIGIN=http://localhost:5174

# For production
ALLOWED_ORIGIN=https://your-domain.com
```

Then restart backend:
```bash
npm run dev:backend
```

---

### Issue: "Too many requests" error

**Symptom:**
```
{ error: "Too many requests. Please wait before sending more messages." }
```

**Solution 1:** Wait 60 seconds (rate limit resets)

**Solution 2:** Increase rate limit in `server.js`:
```javascript
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,  // Increased from 20
});
```

**Solution 3:** Disable rate limiting for development:
```javascript
const chatLimiter = (req, res, next) => next(); // No-op

// Or conditionally:
const chatLimiter = process.env.NODE_ENV === 'development'
  ? (req, res, next) => next()
  : rateLimit({ windowMs: 60 * 1000, max: 20 });
```

---

### Issue: "Unrecognized n8n response shape"

**Symptom:**
```
Error: Unrecognized n8n response shape: {"unknown":"value"}
```

**Solution:**
The n8n webhook returned an unexpected response format. Check:

1. n8n workflow is returning correct format:
   ```javascript
   // Expected: { output: "..." } or { message: "..." }
   // Got: { unknown: "..." }
   ```

2. Update n8n workflow to return `output` field

3. Or update adapter in `src/lib/n8nAdapter.js` to handle new shape:
   ```javascript
   if (hasUsableValue(data, 'unknown')) {
     return String(data.unknown);
   }
   ```

---

### Issue: Tests fail with "localStorage is not defined"

**Symptom:**
```
ReferenceError: localStorage is not defined
```

**Solution:**
This shouldn't happen; `vite.config.js` uses jsdom environment which provides localStorage. Check:

1. Vitest is using jsdom:
```javascript
// vite.config.js
test: {
  environment: 'jsdom', // ← This enables localStorage
}
```

2. Run tests:
```bash
npm test -- --run
```

---

### Issue: Build fails with "cannot find src/App.jsx"

**Symptom:**
```
Error: Cannot resolve 'src/App.jsx'
```

**Solution:**
1. Check file exists:
```bash
ls -la src/App.jsx
```

2. Ensure all imports use correct paths (case-sensitive):
```javascript
// ✓ Correct
import { App } from './App.jsx';

// ✗ Wrong (if filename is App.jsx)
import { App } from './app.jsx';
```

3. Rebuild:
```bash
npm run build
```

---

## Project Structure Quick Reference

### Frontend Structure

```
src/
├── App.jsx                      # Root component (container)
├── main.jsx                     # React DOM entry point
├── index.css                    # Global styles
│
├── components/                  # React presenter components
│   ├── ChatWindow.jsx          # Main layout component
│   ├── ChatHeader.jsx          # Header with clear button
│   ├── MessageList.jsx         # Message list wrapper
│   ├── MessageItem.jsx         # Single message renderer
│   ├── ChatInput.jsx           # Input form
│   ├── MarkdownRenderer.jsx    # Markdown with security
│   ├── TypingIndicator.jsx     # Loading spinner
│   └── MessageItem.test.jsx    # Component tests
│
├── hooks/                       # Custom React hooks
│   ├── useChat.js              # Main chat logic
│   ├── useSession.js           # Session management
│   ├── useScrollToBottom.js    # Auto-scroll behavior
│   ├── useChat.test.js         # Chat hook tests
│   └── useSession.test.js      # Session tests
│
├── services/                    # API clients
│   ├── chatApi.js              # Backend API facade
│   └── chatApi.test.js         # API tests
│
├── lib/                         # Utilities
│   ├── messageFactory.js       # Message creation factory
│   ├── n8nAdapter.js           # Response normalization
│   ├── commandRegistry.js      # Command dispatcher
│   ├── messageFactory.test.js  # Factory tests
│   ├── n8nAdapter.test.js      # Adapter tests
│   └── commandRegistry.test.js # Command tests
│
└── test/
    └── setup.js                # Vitest configuration
```

### Scripts Reference

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run dev` | `vite` | Start frontend dev server (port 5173) |
| `npm run dev:backend` | `node server.js` | Start backend dev server (port 3001) |
| `npm run dev:full` | `concurrently ...` | Start both frontend + backend |
| `npm run build` | `vite build` | Build frontend for production |
| `npm run preview` | `vite preview` | Preview production build locally |
| `npm run start` | `node server.js` | Start backend (production) |
| `npm test` | `vitest` | Run tests in watch mode |
| `npm run test:coverage` | `vitest run --coverage` | Generate coverage report |

### Key Environment Variables

| Variable | Usage | Example |
|----------|-------|---------|
| `N8N_WEBHOOK_URL` | Backend | `https://n8n.example.com/webhook/chat` |
| `ALLOWED_ORIGIN` | Backend | `http://localhost:5173` |
| `NODE_ENV` | Backend | `development` or `production` |
| `PORT` | Backend | `3001` (default) |
| `VITE_N8N_WEBHOOK_URL` | Frontend (doc only) | Not used in code |

---

## Next Steps

1. **Understand the Architecture:**
   - Read `docs/Walkthrough.md` for technical deep-dive
   - Read `docs/ADR.md` for design decisions

2. **Make a Code Change:**
   - Follow "Common Development Tasks" section above
   - Run tests to verify: `npm test`
   - Test manually in browser: `npm run dev:full`

3. **Add a Feature:**
   - Create new hook/component in appropriate directory
   - Write tests alongside (test-driven development)
   - Run full test suite before committing

4. **Deploy to Production:**
   - Follow "Building for Production" section
   - Set `N8N_WEBHOOK_URL` environment variable
   - Use `npm start` to run backend
   - Verify with `GET /health` endpoint

---

## Getting Help

### Useful Resources

- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **Vitest Docs:** https://vitest.dev
- **Express Docs:** https://expressjs.com
- **n8n Docs:** https://docs.n8n.io

### Common Issues

See the [Troubleshooting](#troubleshooting) section above for solutions to:
- Port already in use
- Environment variables not set
- Module not found errors
- CORS errors
- Rate limiting

### Questions?

1. Check this document for quick answers
2. Read `docs/Walkthrough.md` for architectural questions
3. Review test files for code examples
4. Check browser DevTools for client-side errors
5. Check server console for backend errors

---

## Summary

You're now ready to:

✅ Run the application locally
✅ Run tests and understand test patterns
✅ Make code changes with confidence
✅ Add new features following the architecture
✅ Build and deploy to production

Happy coding!

