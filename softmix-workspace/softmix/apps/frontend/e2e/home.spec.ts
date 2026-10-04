import { expect, productCards, test } from './fixtures';

test.describe('Главная', () => {
  test('показывает героя, направления и новинки', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Компьютеры, серверы и софт для вашего бизнеса');
    await expect(page.getByRole('banner').getByRole('link', { name: 'Soft Mix — на главную' }).getByRole('img')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Направления' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Новые поступления' })).toBeVisible();
    await expect(productCards(page).first()).toBeVisible();
    await expect(page).toHaveTitle(/Soft Mix/);
  });

  test('на главной нет обещаний доставки', async ({ page }) => {
    await page.goto('/');
    await expect(productCards(page).first()).toBeVisible();

    await expect(page.locator('body')).not.toContainText(/достав/i);
  });

  test('направление открывает каталог этой категории', async ({ page }) => {
    await page.goto('/');
    const direction = page.locator('section', { has: page.getByRole('heading', { name: 'Направления' }) }).getByRole('link').nth(1);
    const title = (await direction.locator('span.font-semibold').textContent())?.trim() ?? '';

    await direction.click();

    await expect(page).toHaveURL(/\/shop\?categoryId=/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
  });

  test('тема переключается и запоминается', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    await page.getByRole('button', { name: 'Включить тёмную тему' }).first().click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('«О компании» и «Контакты» открываются из меню', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('navigation', { name: 'Основное меню' }).getByRole('link', { name: 'О компании' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'О компании' })).toBeVisible();
    await expect(page.getByText('образовано 9 октября 2013 года')).toBeVisible();

    await page.getByRole('navigation', { name: 'Основное меню' }).getByRole('link', { name: 'Контакты' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Контакты' })).toBeVisible();
    await expect(page.getByText('Время работы')).toBeVisible();
  });

  test('несуществующий адрес — страница «не найдено»', async ({ page }) => {
    await page.goto('/такой-страницы-нет');

    await expect(page.getByRole('heading', { name: 'Страница не найдена' })).toBeVisible();
    await page.getByRole('link', { name: 'Перейти в каталог' }).click();
    await expect(page).toHaveURL(/\/shop$/);
  });
});
