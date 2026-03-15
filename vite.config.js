import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/chat': {
        // During development, proxy /api/chat requests to the n8n webhook
        // In production, you would run a separate backend server (Node.js, Python, etc.)
        // that holds the WEBHOOK_URL server-side and forwards requests.
        target: process.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, ''),
      }
    }
  }
})
