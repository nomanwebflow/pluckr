import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  envDir: resolve(__dirname, '..'),
  base: './',
  plugins: [react()],
  // HtmlService runs the sidebar in a sandboxed iframe. Keep the bundle
  // conservative so it parses consistently in the Docs host frame.
  // The AVIF worker is inlined as a blob worker, so it must be a self-contained classic script.
  worker: { format: 'iife' },
  build: {
    target: 'es2015',
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    // Inline the font and texture into the CSS so Sidebar.html stays self-contained.
    assetsInlineLimit: Infinity,
    // Docs gets one inline script, so lazy chunks must be folded into it.
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
