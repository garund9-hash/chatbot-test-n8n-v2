# Quick Start Guide

## One-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Webhook URL
```bash
export VITE_N8N_WEBHOOK_URL="https://yourname.app.n8n.cloud/webhook/your-webhook-id"
```
(Get this from your n8n instance)

### 3. Run Frontend + Backend
```bash
npm run dev:full
```

### 4. Open Browser
```
http://localhost:5173
```

---

## Individual Commands

### Frontend Only (with dev proxy)
```bash
npm run dev
```
Runs on http://localhost:5173. Proxies `/api/chat` to the backend.

### Backend Only
```bash
npm run dev:backend
```
Runs on http://localhost:3001

### Production Build
```bash
npm run build
npm run start
```
Builds `dist/` and runs backend for serving.

---

## Testing the Chat

1. Type a message: "Hello"
2. See bot respond (if n8n webhook is configured correctly)
3. Try `/help` to see available slash commands
4. Try `/clear` to reset the conversation

---

## File Organization

```
src/
├── App.jsx              ← Container component (state logic)
├── components/          ← Presenter components (JSX only)
├── hooks/               ← Custom React hooks (reusable logic)
├── lib/                 ← Utility functions (adapters, factories, etc.)
├── services/            ← API communication (fetch wrapper)
└── index.css            ← All styles (no inline style={{}} blocks)

server.js               ← Backend proxy (keeps webhook URL safe)
```

---

## Key Features Enabled

✅ **Container/Presenter Pattern** — Clean separation of concerns
✅ **Custom Hooks** — Reusable logic (`useChat`, `useSession`)
✅ **Design Patterns** — Adapter, Facade, Factory, Command, Strategy
✅ **Markdown Rendering** — Bot responses support **bold**, *italic*, `code`
✅ **Error Styling** — Error messages appear in red
✅ **Secure Webhook** — URL not exposed in client bundle
✅ **Slash Commands** — `/clear`, `/help`, `/session`

---

## Troubleshooting

### Chat not responding?
1. Check that `VITE_N8N_WEBHOOK_URL` is set
2. Verify the webhook URL is correct in n8n
3. Check browser console for error messages (F12 → Console tab)

### Port already in use?
```bash
# Change port in server.js or use:
PORT=3002 npm run dev:backend
```

### Build fails?
```bash
rm -rf node_modules dist
npm install
npm run build
```

---

## Next Steps

- Read [README.md](README.md) for full documentation
- Read [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for architecture details
- Deploy to production (see README.md → Deployment section)
- Add TypeScript (dev setup in place, just run: `npm install --save-dev typescript`)

---

## Support

For issues or questions, check the README.md documentation or the code comments in each file.
