import { expect, parsePrice, productCards, test } from './fixtures';

test.describe('Каталог', () => {
  test('показывает товары, количество и дерево категорий', async ({ page }) => {
    await page.goto('/shop');

    await expect(page.getByRole('heading', { level: 1, name: 'Каталог' })).toBeVisible();
    await expect(productCards(page).first()).toBeVisible();
    await expect(page.getByText(/^\d[\d\s ]* товар(а|ов)?$/)).toBeVisible();
    await expect(page.getByRole('complementary', { name: 'Категории каталога' }).getByRole('link', { name: 'Все товары' })).toBeVisible();
  });

  test('категория из дерева: адрес, заголовок и товары', async ({ page }) => {
    await page.goto('/shop');
    const tree = page.getByRole('complementary', { name: 'Категории каталога' });
    const category = tree.getByRole('link').nth(1);
    const title = (await category.textContent())?.trim() ?? '';

    await category.click();

    await expect(page).toHaveURL(/categoryId=/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(category).toHaveAttribute('aria-current', 'page');
    await expect(productCards(page).first()).toBeVisible();
  });

  test('сортировка по цене', async ({ page }) => {
    await page.goto('/shop');
    await expect(productCards(page).first()).toBeVisible();

    await page.getByRole('combobox', { name: 'Сортировка' }).selectOption('price_asc');

    await expect(page).toHaveURL(/sortBy=price_asc/);
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
    const priceOf = async (index: number) =>
      parsePrice((await productCards(page).nth(index).locator('span.font-semibold.tabular-nums').first().textContent()) ?? '');
    expect(await priceOf(0)).toBeLessThanOrEqual(await priceOf(1));
  });

  test('листает страницы', async ({ page }) => {
    await page.goto('/shop');
    const firstTitle = await productCards(page).first().getByRole('heading').textContent();

    await page.getByRole('link', { name: 'Следующая страница' }).click();

    await expect(page).toHaveURL(/page=2/);
    await expect(productCards(page).first().getByRole('heading')).not.toHaveText(firstTitle ?? '');
    await expect(page.getByRole('navigation', { name: 'Страницы' }).getByRole('link', { name: '2' })).toHaveAttribute('aria-current', 'page');
  });

  test('поиск из шапки находит товары по названию', async ({ page }) => {
    await page.goto('/');

    const search = page.getByRole('banner').getByPlaceholder('Поиск товаров');
    await search.fill('монитор');
    await search.press('Enter');

    await expect(page).toHaveURL(/\/shop\?search=/);
    await expect(page.getByRole('heading', { level: 1, name: 'Поиск по каталогу' })).toBeVisible();
    await expect(productCards(page).first().getByRole('heading')).toContainText(/монитор/i);
  });

  test('поиск без результатов и сброс поиска', async ({ page }) => {
    await page.goto('/shop?search=zzzzqqqq-нет-такого-товара');

    await expect(page.getByText('Товаров не найдено')).toBeVisible();
    await page.getByRole('button', { name: 'Сбросить поиск' }).first().click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(productCards(page).first()).toBeVisible();
  });

  test('вид списком показывает описание товаров', async ({ page }) => {
    await page.goto('/shop');
    await expect(productCards(page).first()).toBeVisible();

    await page.getByRole('button', { name: 'Списком' }).click();

    await expect(page.getByRole('button', { name: 'Списком' })).toHaveAttribute('aria-pressed', 'true');
    await expect(productCards(page).first().locator('p.line-clamp-2')).toBeVisible();
  });
});
