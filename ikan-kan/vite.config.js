import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ikan-kan/',
  plugins: [react()],
  esbuild: {
    // Match all .js files in the src directory
    // and treat them as jsx
    loader: "jsx",
    include: [
      "src/**/*.js"
    ],
    exclude: []
  }
}); 