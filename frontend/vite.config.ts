import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // The backend has no CORS headers, so proxy API calls through the dev server
    proxy: {
      '/auth': 'http://localhost:3000',
      '/tickets': 'http://localhost:3000',
    },
  },
})
