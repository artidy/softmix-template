import { expect, expectNoHorizontalScroll, productCards, test } from './fixtures';

test.describe('Телефон', () => {
  test('страницы не шире экрана', async ({ page }) => {
    for (const path of ['/', '/shop', '/about', '/contacts', '/login', '/register', '/cart']) {
      await page.goto(path);
      await expect(page.locator('main')).toBeVisible();
      await expectNoHorizontalScroll(page);
    }
  });

  test('меню открывается и ведёт в каталог', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Открыть меню' }).click();
    const menu = page.getByRole('dialog', { name: 'Меню' });
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: 'Каталог' }).click();

    await expect(page).toHaveURL(/\/shop$/);
    await expect(menu).toBeHidden();
  });

  test('категории в каталоге — выезжающая панель', async ({ page }) => {
    await page.goto('/shop');

    await page.getByRole('button', { name: 'Категории' }).click();
    const sheet = page.getByRole('dialog', { name: 'Категории' });
    await sheet.getByRole('link').nth(1).click();

    await expect(page).toHaveURL(/categoryId=/);
    await expect(sheet).toBeHidden();
    await expect(productCards(page).first()).toBeVisible();
  });

  test('корзина с товаром помещается в экран', async ({ page }) => {
    await page.goto('/shop');
    await productCards(page).first().getByRole('button', { name: /в корзину/ }).click();
    await page.goto('/cart');

    await expect(page.locator('main ul li')).toHaveCount(1);
    await expectNoHorizontalScroll(page);
  });
});
