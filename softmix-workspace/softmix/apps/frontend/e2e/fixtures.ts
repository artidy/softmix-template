import { expect, Locator, Page, test as base } from '@playwright/test';

/**
 * Общая проверка для всех сквозных тестов: на странице не должно быть ошибок JavaScript.
 * Запросы, которые сервер отклоняет намеренно (401 без входа), ошибками не считаются.
 */
export const test = base.extend<{ pageErrors: string[] }>({
  pageErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await use(errors);
      expect(errors, 'ошибки JavaScript на странице').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** Карточки товаров в сетке или списке. */
export function productCards(page: Page): Locator {
  return page.locator('main article');
}

/** Цена из текста вида «44 472 ₸». */
export function parsePrice(text: string): number {
  return Number(text.replace(/[^\d]/g, ''));
}

/** Страница не шире экрана — нет горизонтальной прокрутки. */
export async function expectNoHorizontalScroll(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, 'горизонтальная прокрутка страницы').toBeLessThanOrEqual(0);
}
