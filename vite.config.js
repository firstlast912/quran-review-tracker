import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/analytics']
        }
      }
    }
  },
  server: {
    port: 3000
  },
  publicDir: 'public', // Ensure public directory is properly handled
  // Ensure proper asset handling
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.svg', '**/*.ico', '**/*.json']
})