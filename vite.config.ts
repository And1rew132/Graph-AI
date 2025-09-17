import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  base: command === 'build' ? '/Graph-AI/' : '/'
}))