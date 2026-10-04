import { expect, parsePrice, productCards, test } from './fixtures';

test.describe('Товар и корзина', () => {
  test('из карточки — на страницу товара, оттуда — в корзину', async ({ page }) => {
    await page.goto('/shop');
    const card = productCards(page).first();
    const title = ((await card.getByRole('heading').textContent()) ?? '').trim();

    await card.getByRole('link', { name: title }).click();

    await expect(page).toHaveURL(/\/shop\/[\w-]+$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.getByRole('navigation', { name: 'Навигационная цепочка' }).getByRole('link', { name: 'Каталог' })).toBeVisible();

    const price = parsePrice((await page.locator('main span.tabular-nums').first().textContent()) ?? '');
    await page.getByRole('button', { name: 'Увеличить количество' }).click();
    await page.getByRole('button', { name: 'В корзину', exact: true }).click();
    await expect(page.getByText('Товар добавлен в корзину')).toBeVisible();

    await page.goto('/cart');
    await expect(page.getByRole('link', { name: title }).first()).toBeVisible();
    await expect(page.getByText('2 товара')).toBeVisible();
    const total = parsePrice((await page.getByText('Сумма').locator('xpath=following-sibling::dd').textContent()) ?? '');
    expect(total).toBe(price * 2);
  });

  test('корзина: количество, удаление и очистка', async ({ page }) => {
    await page.goto('/shop');
    await productCards(page).nth(0).getByRole('button', { name: /в корзину/ }).click();
    await productCards(page).nth(1).getByRole('button', { name: /в корзину/ }).click();

    await page.goto('/cart');
    const rows = page.locator('main ul li');
    await expect(rows).toHaveCount(2);

    await rows.first().getByRole('button', { name: 'Увеличить количество' }).click();
    await expect(page.getByText('3 товара')).toBeVisible();

    await rows.first().getByRole('button', { name: /Удалить «/ }).click();
    await expect(rows).toHaveCount(1);

    await page.getByRole('button', { name: 'Очистить корзину' }).click();
    await page.getByRole('dialog', { name: 'Очистить корзину?' }).getByRole('button', { name: 'Очистить' }).click();
    await expect(page.getByText('Ваша корзина пуста')).toBeVisible();
  });

  test('корзина гостя сохраняется после перезагрузки', async ({ page }) => {
    await page.goto('/shop');
    await productCards(page).first().getByRole('button', { name: /в корзину/ }).click();

    await page.reload();
    await page.goto('/cart');

    await expect(page.locator('main ul li')).toHaveCount(1);
  });

  test('окна не сдвигают страницу, затемнение — на весь экран', async ({ page }) => {
    await page.goto('/shop');
    await productCards(page).first().getByRole('button', { name: /в корзину/ }).click();
    const headerLeft = () => page.locator('header .mx-auto').evaluate((element) => element.getBoundingClientRect().left);
    const overlayWidth = () => page.locator('div[data-state="open"][class*="bg-black/45"]').evaluate((element) => element.getBoundingClientRect().width);
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    // Боковая шторка корзины.
    const before = await headerLeft();
    await page.getByRole('banner').getByRole('button', { name: /^Корзина/ }).click();
    await expect(page.getByRole('dialog', { name: /Корзина/ })).toBeVisible();
    expect(await headerLeft()).toBe(before);
    expect(await overlayWidth()).toBe(viewportWidth);
    await page.keyboard.press('Escape');

    // Окно подтверждения по центру экрана.
    await page.goto('/cart');
    const cartBefore = await headerLeft();
    await page.getByRole('button', { name: 'Очистить корзину' }).click();
    await expect(page.getByRole('dialog', { name: 'Очистить корзину?' })).toBeVisible();
    expect(await headerLeft()).toBe(cartBefore);
    expect(await overlayWidth()).toBe(viewportWidth);
  });

  test('оформление заказа без входа ведёт на страницу входа', async ({ page }) => {
    await page.goto('/shop');
    await productCards(page).first().getByRole('button', { name: /в корзину/ }).click();
    await page.goto('/cart');

    await page.getByRole('link', { name: 'Оформить заказ' }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Вход в аккаунт' })).toBeVisible();
  });
});
