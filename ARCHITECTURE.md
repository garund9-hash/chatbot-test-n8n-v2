# Architecture Documentation

## Overview

This document provides a high-level overview of the refactored architecture. For detailed implementation information, see [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md).

## Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│  (JSX rendering, user interaction, no state logic)             │
├─────────────────────────────────────────────────────────────────┤
│  App (Container)                                                │
│    └─ ChatWindow (Compound Component)                          │
│       ├─ ChatHeader (Presenter)                                │
│       ├─ MessageList (Presenter)                               │
│       │   └─ MessageItem (Presenter, Strategy pattern)        │
│       └─ ChatInput (Presenter)                                 │
│           └─ MarkdownRenderer (Presenter)                      │
├─────────────────────────────────────────────────────────────────┤
│                    HOOKS LAYER                                  │
│  (State management, side effects, reusable logic)              │
├─────────────────────────────────────────────────────────────────┤
│  useChat                                                        │
│    ├─ useSession                                               │
│    ├─ chatApi                                                  │
│    ├─ MessageFactory                                           │
│    └─ commandRegistry                                          │
│                                                                 │
│  useScrollToBottom                                              │
├─────────────────────────────────────────────────────────────────┤
│                   SERVICES LAYER                                │
│  (HTTP communication, external integrations)                    │
├─────────────────────────────────────────────────────────────────┤
│  chatApi.sendMessage(text, sessionId)                          │
│    ├─ fetch('/api/chat')   (local backend proxy)              │
│    └─ n8nResponseAdapter() (normalize response)               │
├─────────────────────────────────────────────────────────────────┤
│                 BACKEND PROXY LAYER                             │
│  (Security, rate limiting, protocol translation)              │
├─────────────────────────────────────────────────────────────────┤
│  server.js (Express)                                            │
│    └─ POST /api/chat                                           │
│        └─ forward to VITE_N8N_WEBHOOK_URL (server-side)       │
├─────────────────────────────────────────────────────────────────┤
│                    EXTERNAL SERVICES                            │
│  (Third-party APIs, webhooks, databases)                       │
├─────────────────────────────────────────────────────────────────┤
│  n8n Cloud Webhook (LLM, automation, memory)                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Message Sending Flow

```
User types "Hello"
  ↓
ChatInput.onChange → setInput("Hello")
  ↓
ChatInput.onSubmit(text)
  ↓
useChat.sendMessage(text)
  ├─ Check isCommand(text)
  ├─ If command: executeCommand() → done
  └─ If message:
      ├─ MessageFactory.userMessage(text)
      ├─ setMessages([...messages, userMessage])
      ├─ chatApi.sendMessage(text, sessionId)
      │   ├─ fetch('/api/chat', { message, sessionId })
      │   └─ Backend forwards to n8n
      │   └─ n8nResponseAdapter(response)
      └─ setMessages([...messages, botMessage])
```

### Rendering Flow

```
useChat hook manages state
  ↓
App (Container) receives state from useChat
  ↓
App passes props to ChatWindow (Presenter)
  ├─ messages, input, isLoading
  ├─ onInputChange, onSendMessage, onClearChat
  └─ ...passes to child components
      ↓
      ChatWindow (Compound Component)
      ├─ ChatHeader
      │  └─ Uses: onClear → clearChat()
      ├─ MessageList
      │  ├─ maps messages[] to MessageItem
      │  └─ MessageItem
      │     ├─ Uses Strategy pattern (renderStrategies[type])
      │     └─ Renders: plain text, markdown, error styling, system text
      └─ ChatInput
         ├─ Uses: value, onChange, onSubmit, isLoading
         └─ MarkdownRenderer
            └─ (Only used for message rendering, not input)
```

## State Management

### Global App State (in `useChat`)

```javascript
{
  messages: [
    { id, text, sender: 'user'|'bot', isError?: true, isSystem?: true },
    ...
  ],
  input: string,
  isLoading: boolean,
  sessionId: string,  // from useSession
}
```

### Local Component State

None. All state is in `useChat` hook and passed down as props. This is intentional to maintain a single source of truth.

## Design Patterns Used

### 1. Container/Presenter Pattern

**Container**: `App` and `useChat` hook
- Owns all state
- Handles async operations
- Manages side effects

**Presenters**: `ChatWindow`, `ChatHeader`, `ChatInput`, `MessageList`, `MessageItem`, `MarkdownRenderer`
- No state
- Receive props
- Render JSX
- Call handler props on user interaction

**Benefits**:
- Easy to test presenters (just pass props, assert JSX)
- Easy to swap container logic without changing UI
- Clear separation of concerns

### 2. Custom Hooks

**useChat**: Primary application logic
**useSession**: Session persistence
**useScrollToBottom**: Scroll behavior

**Benefits**:
- Encapsulate side effects
- Easily testable
- Reusable across components
- Follows React best practices

### 3. Adapter Pattern (GoF)

**n8nResponseAdapter**: Normalizes n8n API responses
- Input: varied response shapes from n8n
- Output: consistent string format

**Benefits**:
- Single place to handle API response variations
- Testable in isolation
- Easy to change if n8n API changes

### 4. Facade Pattern (GoF)

**chatApi.sendMessage()**: Simplifies HTTP communication
- Hides fetch details
- Handles headers, error checking
- Applies response adapter

**Benefits**:
- Simple interface to consumers
- Easy to swap HTTP implementation
- Centralized error handling

### 5. Factory Pattern (GoF)

**MessageFactory**: Creates message objects
- userMessage(text)
- botMessage(text)
- errorMessage(text)
- systemMessage(text)
- welcomeMessage()

**Benefits**:
- Centralized message schema
- Guarantees all messages have required fields
- UUIDs guaranteed unique (no collisions)

### 6. Command Pattern (GoF)

**commandRegistry**: Maps slash commands to handlers
- `/clear` → clearChat()
- `/help` → addSystemMessage("...")
- `/session` → addSystemMessage(`Session: ${sessionId}`)

**Benefits**:
- Extensible without modifying dispatch logic
- Easy to add new commands (just add to registry)
- Follows open/closed principle

### 7. Strategy Pattern (GoF)

**renderStrategies in MessageItem**: Different rendering per message type
```javascript
const renderStrategies = {
  user: (text) => <span>{text}</span>,
  bot: (text) => <MarkdownRenderer>{text}</MarkdownRenderer>,
  error: (text) => <span>{text}</span>,  // Could be styled differently
  system: (text) => <span>{text}</span>,
}
```

**Benefits**:
- Easy to add new message type rendering
- Rendering logic per-type (not scattered)
- Error messages now visually distinct

### 8. Compound Component Pattern (React)

**ChatWindow**: Assembles related sub-components

```jsx
<ChatWindow
  messages={...}
  input={...}
  isLoading={...}
  onInputChange={...}
  onSendMessage={...}
  onClearChat={...}
>
  // Internally:
  <ChatHeader />
  <MessageList />
  <ChatInput />
</ChatWindow>
```

**Benefits**:
- Single API for related components
- Implicit dependencies between header/input/list
- Easy to reorder or add sub-components

## Security Architecture

### Webhook URL Protection

**Problem**: Original design exposed `VITE_N8N_WEBHOOK_URL` in client bundle (visible in DevTools)

**Solution**: Backend proxy

```
                    ┌──────────────────────────────┐
                    │   Frontend (React, SPA)       │
                    │  - No secrets                 │
                    │  - Calls /api/chat            │
                    └─────────────┬──────────────────┘
                                  │
                    ┌─────────────▼──────────────────┐
                    │  Backend (Express)             │
                    │  - Holds WEBHOOK_URL secret    │
                    │  - Validates input             │
                    │  - Forwards to n8n             │
                    └─────────────┬──────────────────┘
                                  │
                    ┌─────────────▼──────────────────┐
                    │  n8n Cloud                     │
                    │  - Processes request           │
                    │  - Returns response            │
                    └────────────────────────────────┘
```

### Additional Security Measures

- **Input Validation**: Backend validates `{ message, sessionId }`
- **CORS Configuration**: Properly configured in Express
- **Error Messages**: Don't leak internal details
- **HTTPS in Production**: Required for secure communication

## Performance Considerations

### Bundle Size
- Current: 266.98 kB (84.43 kB gzipped)
- Main dependencies: React, Vite, lucide-react, react-markdown

### Rendering Performance
- Memoization not needed (component tree is small)
- No unnecessary re-renders (single source of truth in useChat)
- Scroll performance: native browser scrolling

### Network Performance
- `/api/chat` request: single round-trip
- Response parsing: fast JSON + Adapter
- No polling (request-response only)

## Extensibility

### Adding a New Slash Command

```javascript
// In lib/commandRegistry.js
export const commandRegistry = {
  '/clear': (context) => context.clearChat(),
  '/help': (context) => context.addSystemMessage('...'),
  '/new-command': (context) => {
    // Your new command logic here
  },
};
```

### Adding a New Message Type

```javascript
// In components/MessageItem.jsx
const renderStrategies = {
  user: (text) => <span>{text}</span>,
  bot: (text) => <MarkdownRenderer>{text}</MarkdownRenderer>,
  error: (text) => <span>{text}</span>,
  system: (text) => <span>{text}</span>,
  newType: (text) => <YourCustomRenderer>{text}</YourCustomRenderer>,
};
```

### Changing API Integration

Replace `chatApi.sendMessage()` implementation:

```javascript
// Current: calls /api/chat proxy
// Alternative: call OpenAI API directly
// Alternative: call LangChain backend
// Just change services/chatApi.js, no other files need updating
```

## Testing Strategy

### Unit Tests (add @testing-library/react)

```javascript
// hooks/useChat.test.js
test('sendMessage calls chatApi.sendMessage', async () => {
  const { result } = renderHook(() => useChat());
  await act(async () => {
    await result.current.sendMessage('hello');
  });
  expect(chatApi.sendMessage).toHaveBeenCalledWith('hello', expect.any(String));
});

// lib/n8nAdapter.test.js
test('throws on unrecognized response', () => {
  expect(() => n8nResponseAdapter({})).toThrow(UnrecognizedResponseError);
});

// components/MessageItem.test.jsx
test('error message renders with error class', () => {
  const { container } = render(
    <MessageItem message={{ id: '1', text: 'Error', sender: 'bot', isError: true }} />
  );
  expect(container.querySelector('.message-bubble.error')).toBeInTheDocument();
});
```

### Integration Tests

```javascript
// Test the full flow: input → sendMessage → response → render
test('full chat flow', async () => {
  const { getByPlaceholderText, getByText } = render(<App />);
  const input = getByPlaceholderText('Query the nexus...');
  await userEvent.type(input, 'hello');
  await userEvent.click(getByRole('button', { name: /send/i }));
  // Mock chatApi, assert message appears
});
```

### E2E Tests (add Playwright)

```javascript
// e2e/chat.spec.js
test('user can send message and see bot response', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.fill('input', 'What is React?');
  await page.click('button[type="submit"]');
  await page.waitForSelector('.message-item.bot');
  // Assert bot response visible
});
```

## Deployment Checklist

- [ ] Environment variable `VITE_N8N_WEBHOOK_URL` set on backend
- [ ] Frontend build: `npm run build`
- [ ] Backend running: `npm start`
- [ ] CORS properly configured for production domain
- [ ] HTTPS enabled in production
- [ ] Error logging/monitoring configured
- [ ] Rate limiting on `/api/chat` (if high traffic expected)
- [ ] Database for session persistence (if needed)

## Future Enhancements

### P1 (High Priority)
- TypeScript migration
- Unit test suite
- Component snapshot tests

### P2 (Medium Priority)
- Streaming responses (SSE)
- Message persistence (IndexedDB)
- User authentication
- Rate limiting

### P3 (Low Priority)
- Storybook component library
- Analytics
- Message search
- Theme switcher

---

For detailed implementation notes, see [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md).
For quick start, see [QUICK_START.md](QUICK_START.md).
