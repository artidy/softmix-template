/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/frontend',
  plugins: [react(), tailwindcss()],
  resolve: {
    // Тот же путь, что в tsconfig.base.json.
    alias: {
      '@project-lib/shared-types': resolve(__dirname, '../../libs/shared-types/src/index.ts'),
    },
  },
  server: {
    port: 4300,
    // В разработке запросы к API идут через Vite на локальный BFF — как nginx в проде.
    proxy: {
      '/api': 'http://localhost:5555',
      // Загруженные в панели управления фото раздаёт uploader.
      '/assets/img/products': 'http://localhost:7777',
    },
  },
  preview: {
    port: 4300,
  },
  // Модульные тесты: Vitest с той же конфигурацией сборки и браузерным окружением jsdom.
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    restoreMocks: true,
  },
  build: {
    outDir: '../../dist/apps/frontend',
    emptyOutDir: true,
    // Хешированные бандлы отдельно от статики из public/assets.
    assetsDir: 'static',
    rollupOptions: {
      output: {
        // Библиотеки отдельно от кода сайта: после деплоя браузер берёт их из кэша.
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }
          return /node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id) ? 'react' : 'vendor';
        },
      },
    },
  },
});
