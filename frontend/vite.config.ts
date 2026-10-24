/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Em desenvolvimento, /api e /imagens são encaminhados para a API .NET local.
    proxy: {
      '/api': { target: process.env.VITE_PROXY_API ?? 'http://localhost:5080', changeOrigin: true },
      '/imagens': { target: process.env.VITE_PROXY_API ?? 'http://localhost:5080', changeOrigin: true },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
