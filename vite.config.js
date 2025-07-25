import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false // deaktiviert Source Maps im Build
  },
  server: {
    host: true, // ← wichtig!
    port: 5173, // oder anderer freier Port
  },
})