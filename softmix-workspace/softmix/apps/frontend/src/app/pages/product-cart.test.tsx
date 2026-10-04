import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { apiProduct } from '../../test/fixtures';
import { mockHttp } from '../../test/mock-http';
import { guestState, renderWithProviders } from '../../test/render';
import { addItem } from '../services/guest-cart';
import CartPage from './cart.page';
import ProductDetailsPage from './product-details.page';

describe('Страница товара', () => {
  it('показывает товар и кладёт в корзину выбранное количество', async () => {
    mockHttp([
      { url: 'products/p1', reply: apiProduct({ id: 'p1', title: 'Монитор 22"', price: 44472, description: 'VA, 100 Гц' }) },
    ]);
    const { user, store } = renderWithProviders(<ProductDetailsPage />, {
      route: '/shop/p1',
      path: '/shop/:id',
      preloadedState: guestState,
    });

    expect(await screen.findByRole('heading', { level: 1, name: 'Монитор 22"' })).toBeInTheDocument();
    expect(screen.getByText('VA, 100 Гц')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Мониторы' })[0]).toHaveAttribute('href', '/shop?categoryId=cat-1');

    await user.click(screen.getByRole('button', { name: 'Увеличить количество' }));
    await user.click(screen.getByRole('button', { name: 'В корзину' }));

    expect(store.getState().CART.cart).toMatchObject({ totalItems: 2, totalPrice: 44472 * 2 });
  });

  it('несуществующий товар — сообщение и ссылка в каталог', async () => {
    mockHttp([{ url: 'products/missing', reply: {} }]);
    renderWithProviders(<ProductDetailsPage />, { route: '/shop/missing', path: '/shop/:id', preloadedState: guestState });

    expect(await screen.findByText('Товар не найден')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Перейти в каталог' })).toHaveAttribute('href', '/shop');
  });
});

describe('Корзина', () => {
  it('пустая корзина предлагает перейти в каталог', async () => {
    renderWithProviders(<CartPage />, { preloadedState: guestState });

    expect(await screen.findByText('Ваша корзина пуста')).toBeInTheDocument();
  });

  it('считает итог, меняет количество и очищается после подтверждения', async () => {
    addItem({ productId: 'm1', title: 'Монитор', price: 1000, quantity: 1, imageUrl: '' });
    addItem({ productId: 'p1', title: 'Принтер', price: 500, quantity: 2, imageUrl: '' });
    const { user, store } = renderWithProviders(<CartPage />, { preloadedState: guestState });

    expect(await screen.findByRole('link', { name: 'Монитор' })).toBeInTheDocument();
    expect(store.getState().CART.cart?.totalPrice).toBe(2000);

    const monitorRow = screen.getByRole('link', { name: 'Монитор' }).closest('li') as HTMLElement;
    await user.click(within(monitorRow).getByRole('button', { name: 'Увеличить количество' }));
    await waitFor(() => expect(store.getState().CART.cart?.totalPrice).toBe(3000));

    await user.click(screen.getByRole('button', { name: 'Очистить корзину' }));
    const dialog = await screen.findByRole('dialog', { name: 'Очистить корзину?' });
    await user.click(within(dialog).getByRole('button', { name: 'Очистить' }));

    expect(await screen.findByText('Ваша корзина пуста')).toBeInTheDocument();
  });

  it('удаляет отдельный товар', async () => {
    addItem({ productId: 'm1', title: 'Монитор', price: 1000, quantity: 1, imageUrl: '' });
    const { user } = renderWithProviders(<CartPage />, { preloadedState: guestState });

    await user.click(await screen.findByRole('button', { name: 'Удалить «Монитор» из корзины' }));

    expect(await screen.findByText('Ваша корзина пуста')).toBeInTheDocument();
  });
});
