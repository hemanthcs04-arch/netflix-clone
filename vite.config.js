import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative paths so GitHub Pages works at https://user.github.io/repo-name/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
});
