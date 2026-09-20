import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Deployed to GitHub Pages as a PROJECT site:
//   https://mdsium003.github.io/fahmida_protofolio/
// If this ever moves to a custom domain or a user site (mdsium003.github.io),
// change `base` to '/' — BASE_URL, the router basename and src/utils/assetUrl.js
// all derive from this one value.
const BASE = '/fahmida_protofolio/';

// https://vite.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['motion/react'],
          'vendor-icons': ['lucide-react'],
          'vendor-csv': ['papaparse'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
