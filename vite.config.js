import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  root: '.', // Set the root directory to the current directory
  build: {
    outDir: 'dist', // Specify the output directory for the production build
  },
})