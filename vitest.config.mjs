import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  cacheDir: '.vitest-cache',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    mockReset: true,
    restoreMocks: true,
    pool: 'vmThreads',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['.kiro/**', 'node_modules/**'],
  },
});
