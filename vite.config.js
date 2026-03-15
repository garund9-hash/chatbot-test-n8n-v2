import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/chat': {
        // During development, proxy /api/chat requests to the local backend server.
        // The backend holds the n8n webhook URL server-side and forwards requests.
        // Never proxy directly to the production webhook to ensure validation occurs.
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, ''),
      }
    }
  }
})
