import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { apiCategory, apiProduct, category } from '../../../test/fixtures';
import { mockHttp } from '../../../test/mock-http';
import { authState, guestState, makeUser, renderWithProviders } from '../../../test/render';
import { productAdapt } from '../../services/adapters/products.adapter';
import { shopApi } from '../../store/shop-api';
import { UserRole } from '../../types/user';
import { ProductCard } from './product-card';
import { ProductForm } from './product-form';

const categoriesState = {
  CATEGORIES: { categories: [category('cat-1', 'Мониторы')], isLoading: false },
};

describe('ProductCard', () => {
  it('показывает название, категорию, цену и бейджи', () => {
    const product = productAdapt(apiProduct({ title: 'Монитор 27"', price: 80000, pricePrev: 100000, isHot: true }));
    renderWithProviders(<ProductCard product={product} />, { preloadedState: guestState });

    expect(screen.getByRole('link', { name: 'Монитор 27"' })).toHaveAttribute('href', `/shop/${product.id}`);
    expect(screen.getByText('Мониторы')).toBeInTheDocument();
    expect(screen.getByText('−20%')).toBeInTheDocument();
    expect(screen.getByText('Хит')).toBeInTheDocument();
  });

  it('кладёт товар в корзину гостя', async () => {
    const product = productAdapt(apiProduct({ title: 'Принтер', price: 120000 }));
    const { user, store } = renderWithProviders(<ProductCard product={product} />, { preloadedState: guestState });

    await user.click(screen.getByRole('button', { name: 'Добавить «Принтер» в корзину' }));

    expect(store.getState().CART.cart).toMatchObject({ totalItems: 1, totalPrice: 120000 });
  });

  it('открывает страницу товара сразу, без загрузки', async () => {
    const product = productAdapt(apiProduct({ id: 'p-fast' }));
    const { user, store } = renderWithProviders(<ProductCard product={product} />, { preloadedState: guestState });

    await user.click(screen.getByRole('link', { name: product.title }));

    expect(screen.getByTestId('location')).toHaveTextContent('/shop/p-fast');
    expect(shopApi.endpoints.getProduct.select('p-fast')(store.getState()).data?.title).toBe(product.title);
  });

  it('меню сотрудника видно только сотрудникам', async () => {
    const product = productAdapt(apiProduct());
    renderWithProviders(<ProductCard product={product} />, { preloadedState: guestState });
    expect(screen.queryByRole('button', { name: 'Действия с товаром' })).not.toBeInTheDocument();

    renderWithProviders(<ProductCard product={product} />, { preloadedState: authState(makeUser(UserRole.Manager)) });
    expect(await screen.findByRole('button', { name: 'Действия с товаром' })).toBeInTheDocument();
  });
});

describe('ProductForm', () => {
  it('без обязательных полей показывает ошибки и ничего не отправляет', async () => {
    const { calls } = mockHttp([]);
    const { user } = renderWithProviders(<ProductForm onDone={vi.fn()} />, { preloadedState: categoriesState });

    await user.click(screen.getByRole('button', { name: 'Добавить товар' }));

    expect(screen.getByText('Введите название товара')).toBeInTheDocument();
    expect(screen.getByText('Введите описание')).toBeInTheDocument();
    expect(screen.getByText('Выберите категорию')).toBeInTheDocument();
    expect(screen.getByText('Цена должна быть больше нуля')).toBeInTheDocument();
    expect(calls.filter((call) => call.method === 'post')).toHaveLength(0);
  });

  it('создаёт товар и закрывается', async () => {
    const onDone = vi.fn();
    const { calls } = mockHttp([{ method: 'post', url: 'products', reply: apiProduct() }]);
    const { user } = renderWithProviders(<ProductForm onDone={onDone} />, { preloadedState: categoriesState });

    await user.type(screen.getByLabelText(/Название/), 'Монитор Dahua');
    await user.type(screen.getByLabelText(/Описание/), 'Хороший монитор');
    await user.selectOptions(screen.getByLabelText(/Категория/), 'cat-1');
    await user.clear(screen.getByLabelText(/^Цена, ₸/));
    await user.type(screen.getByLabelText(/^Цена, ₸/), '44472');
    await user.click(screen.getByLabelText(/Популярный товар/));
    await user.click(screen.getByRole('button', { name: 'Добавить товар' }));

    await waitFor(() => expect(onDone).toHaveBeenCalled());
    expect(calls.find((call) => call.method === 'post')?.data).toEqual({
      title: 'Монитор Dahua',
      description: 'Хороший монитор',
      price: 44472,
      pricePrev: 0,
      discount: 0,
      categoryId: 'cat-1',
      isHot: true,
    });
  });

  it('при ошибке сервера окно остаётся открытым', async () => {
    const onDone = vi.fn();
    mockHttp([{ method: 'post', url: 'products', status: 400, reply: { message: 'Ошибка' } }]);
    const { user } = renderWithProviders(<ProductForm defaultCategoryId="cat-1" onDone={onDone} />, {
      preloadedState: categoriesState,
    });

    await user.type(screen.getByLabelText(/Название/), 'Товар');
    await user.type(screen.getByLabelText(/Описание/), 'Описание');
    await user.type(screen.getByLabelText(/^Цена, ₸/), '100');
    await user.click(screen.getByRole('button', { name: 'Добавить товар' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'Добавить товар' })).toBeEnabled());
    expect(onDone).not.toHaveBeenCalled();
  });

  it('при редактировании отправляет только изменённые поля', async () => {
    const onDone = vi.fn();
    const product = productAdapt(apiProduct({ id: 'p1', title: 'Старое', price: 1000 }));
    const { calls } = mockHttp([{ method: 'patch', url: 'products/p1', reply: apiProduct({ id: 'p1' }) }]);
    const { user } = renderWithProviders(<ProductForm product={product} onDone={onDone} />, { preloadedState: categoriesState });

    const price = screen.getByLabelText(/^Цена, ₸/);
    await user.clear(price);
    await user.type(price, '1500');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    await waitFor(() => expect(onDone).toHaveBeenCalled());
    expect(calls.find((call) => call.method === 'patch')?.data).toEqual({ id: 'p1', price: 1500 });
  });

  it('без изменений закрывается без запроса', async () => {
    const onDone = vi.fn();
    const { calls } = mockHttp([]);
    const product = productAdapt(apiProduct({ id: 'p1' }));
    const { user } = renderWithProviders(<ProductForm product={product} onDone={onDone} />, { preloadedState: categoriesState });

    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(onDone).toHaveBeenCalled();
    expect(calls).toHaveLength(0);
  });

  it('сама загружает категории, если их ещё нет', async () => {
    mockHttp([{ url: 'categories', reply: [apiCategory('cat-9', 'Серверы')] }]);
    renderWithProviders(<ProductForm onDone={vi.fn()} />);

    const select = screen.getByLabelText(/Категория/);
    expect(await within(select).findByRole('option', { name: 'Серверы' })).toBeInTheDocument();
  });
});
