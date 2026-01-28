import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // For Vercel/Netlify we serve from the domain root, so base should be '/'
  // If you ever host under a sub-path (e.g. GitHub Pages), set VITE_BASE_URL to that path.
  base: process.env.VITE_BASE_URL || '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
