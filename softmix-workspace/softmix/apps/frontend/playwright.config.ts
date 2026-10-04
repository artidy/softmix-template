import { defineConfig, devices } from '@playwright/test';

/**
 * Сквозные тесты гоняются против уже запущенного сайта — по умолчанию локальные контейнеры
 * (docker-compose.dev.yml, http://localhost:4200). Другой адрес: E2E_BASE_URL=https://… npx nx e2e frontend
 */
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:4200';

export default defineConfig({
  testDir: './e2e',
  outputDir: '../../dist/e2e/frontend',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    locale: 'ru-RU',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Локально берём установленный Chrome — отдельный браузер Playwright скачивать не нужно.
    // В CI: E2E_BROWSER_CHANNEL=chromium после `npx playwright install chromium`.
    channel: process.env.E2E_BROWSER_CHANNEL ?? 'chrome',
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: /mobile\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        // По умолчанию Playwright прячет полосы прокрутки, а у посетителей на ПК они обычные.
        // Без них браузер по-другому считает ширину страницы, и проверки раскладки врут.
        launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] },
      },
    },
    {
      name: 'mobile',
      testMatch: /mobile\.spec\.ts/,
      use: { ...devices['Pixel 7'] },
    },
  ],
});
