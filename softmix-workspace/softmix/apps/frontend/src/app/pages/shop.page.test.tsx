import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { apiCategory, apiProduct } from '../../test/fixtures';
import { MockRoute, mockHttp } from '../../test/mock-http';
import { guestState, renderWithProviders } from '../../test/render';
import ShopPage from './shop.page';

const categoriesRoute: MockRoute = {
  url: 'categories',
  reply: [
    apiCategory('pc', 'Компьютеры'),
    apiCategory('monitors', 'Мониторы', 'pc', 1),
    apiCategory('office', 'Офисная техника'),
  ],
};
const imagesRoute: MockRoute = { url: 'uploader/products', reply: [] };

describe('Каталог', () => {
  it('показывает товары и их количество', async () => {
    mockHttp([
      categoriesRoute,
      imagesRoute,
      { url: 'products', reply: { products: [apiProduct({ title: 'Монитор A' }), apiProduct({ title: 'Монитор B' })], total: 2 } },
    ]);
    renderWithProviders(<ShopPage />, { route: '/shop', preloadedState: guestState });

    expect(await screen.findByRole('link', { name: 'Монитор A' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Монитор B' })).toBeInTheDocument();
    expect(screen.getByText('2 товара')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Каталог' })).toBeInTheDocument();
  });

  it('в категории запрашивает и её подкатегории', async () => {
    const { calls } = mockHttp([categoriesRoute, imagesRoute, { url: 'products', reply: { products: [], total: 0 } }]);
    renderWithProviders(<ShopPage />, { route: '/shop?categoryId=pc', preloadedState: guestState });

    expect(await screen.findByRole('heading', { level: 1, name: 'Компьютеры' })).toBeInTheDocument();
    await waitFor(() => expect(calls.some((call) => call.path === 'products')).toBe(true));

    const request = calls.find((call) => call.path === 'products');
    expect(request?.params.getAll('categoryIds').sort()).toEqual(['monitors', 'pc']);
    // Пока дерево не загружено, неполный список не запрашивается.
    expect(calls.filter((call) => call.path === 'products')).toHaveLength(1);
  });

  it('пустая категория показывает понятное сообщение', async () => {
    mockHttp([categoriesRoute, imagesRoute, { url: 'products', reply: { products: [], total: 0 } }]);
    renderWithProviders(<ShopPage />, { route: '/shop?categoryId=office', preloadedState: guestState });

    expect(await screen.findByText('Товаров не найдено')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Вернуться в каталог' })).toHaveAttribute('href', '/shop');
  });

  it('поиск: заголовок, запрос к API и сброс', async () => {
    const { calls } = mockHttp([
      categoriesRoute,
      imagesRoute,
      { url: 'products', reply: { products: [apiProduct({ title: 'Монитор Dahua' })], total: 1 } },
    ]);
    const { user } = renderWithProviders(<ShopPage />, { route: '/shop?search=монитор', preloadedState: guestState });

    expect(await screen.findByRole('heading', { level: 1, name: 'Поиск по каталогу' })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Монитор Dahua' })).toBeInTheDocument();
    expect(calls.find((call) => call.path === 'products')?.params.get('search')).toBe('монитор');

    await user.click(screen.getByRole('button', { name: 'Сбросить поиск' }));
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/shop$/);
  });

  it('сортировка попадает в адрес и сбрасывает страницу', async () => {
    mockHttp([categoriesRoute, imagesRoute, { url: 'products', reply: { products: [apiProduct()], total: 1 } }]);
    const { user } = renderWithProviders(<ShopPage />, { route: '/shop?page=3', preloadedState: guestState });

    await user.selectOptions(await screen.findByRole('combobox', { name: 'Сортировка' }), 'price_asc');

    expect(screen.getByTestId('location')).toHaveTextContent('/shop?sortBy=price_asc');
  });

  it('при ошибке сервера предлагает повторить', async () => {
    mockHttp([categoriesRoute, imagesRoute, { url: 'products', status: 500, reply: { message: 'Ошибка' } }]);
    renderWithProviders(<ShopPage />, { route: '/shop', preloadedState: guestState });

    expect(await screen.findByText('Не удалось загрузить товары')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Повторить' })).toBeInTheDocument();
  });

  it('переключает вид на список', async () => {
    mockHttp([categoriesRoute, imagesRoute, { url: 'products', reply: { products: [apiProduct({ description: 'Подробное описание' })], total: 1 } }]);
    const { user } = renderWithProviders(<ShopPage />, { route: '/shop', preloadedState: guestState });

    await screen.findAllByRole('article');
    await user.click(screen.getByRole('button', { name: 'Списком' }));

    expect(screen.getByRole('button', { name: 'Списком' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Подробное описание')).toBeInTheDocument();
  });
});
