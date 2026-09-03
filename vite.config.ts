/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Isolation cross-origin : indispensable à SharedArrayBuffer, dont dépendra
// l'interruption du code Python (docs/TECH.md, décisions 2 et 5).
const entetesIsolation = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};

export default defineConfig({
  plugins: [svelte()],
  server: {
    headers: entetesIsolation,
    // Projet sur /mnt/c (Windows) : WSL ne reçoit pas les notifications de
    // fichiers — sans sondage, Vite sert des modules périmés.
    watch: { usePolling: true, interval: 300 },
  },
  preview: { headers: entetesIsolation },
  worker: { format: 'es' },
  optimizeDeps: { exclude: ['pyodide'] },
  test: { environment: 'node' },
});
