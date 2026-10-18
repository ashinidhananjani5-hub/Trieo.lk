import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Firebase services must share the same component registry, even when npm
  // installs multiple patch versions for SDK peer dependencies.
  resolve: {
    dedupe: ['@firebase/app', '@firebase/component'],
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
  },
})

