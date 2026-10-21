import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  // HtmlService runs the sidebar in a sandboxed iframe. Keep the bundle
  // conservative so it parses consistently in the Docs host frame.
  // The AVIF worker is inlined as a blob worker, so it must be a self-contained classic script.
  worker: { format: 'iife' },
  build: {
    target: 'es2015',
    // Inline the font and texture into the CSS so Sidebar.html stays self-contained.
    assetsInlineLimit: Infinity,
    // Docs gets one inline script, so lazy chunks must be folded into it.
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
