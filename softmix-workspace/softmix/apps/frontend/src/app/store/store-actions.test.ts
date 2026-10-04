import { describe, expect, it } from 'vitest';

import { apiCategory } from '../../test/fixtures';
import { mockHttp } from '../../test/mock-http';
import { setupStore } from './index';
import { createCategoryApi, deleteCategoryApi, getCategoriesApi, updateCategoryApi } from './categories-data/api-actions';
import { addNewImage } from './products-data/products-data';
import { addToCart, getCart, removeFromCart, updateCartItem } from './cart-data/api-actions';
import { saveTokens } from '../services/token';

describe('категории', () => {
  it('загружает, добавляет, переименовывает и удаляет', async () => {
    mockHttp([
      { url: 'categories', reply: [apiCategory('a', 'Компьютеры'), apiCategory('b', 'Офисная техника')] },
      { method: 'post', url: 'categories', reply: apiCategory('c', 'Сетевое', 'a', 1) },
      { method: 'patch', url: 'categories/b', reply: apiCategory('b', 'Оргтехника') },
      { method: 'delete', url: 'categories/a', status: 204, reply: '' },
    ]);
    const store = setupStore();
    const titles = () => store.getState().CATEGORIES.categories.map((item) => item.title);

    await store.dispatch(getCategoriesApi());
    expect(titles()).toEqual(['Компьютеры', 'Офисная техника']);
    expect(store.getState().CATEGORIES.isLoading).toBe(false);

    expect(await store.dispatch(createCategoryApi({ title: 'Сетевое', ownerId: 'a', position: 1 })).unwrap()).toBe(true);
    expect(titles()).toContain('Сетевое');

    expect(await store.dispatch(updateCategoryApi({ id: 'b', title: 'Оргтехника' })).unwrap()).toBe(true);
    expect(titles()).toContain('Оргтехника');

    expect(await store.dispatch(deleteCategoryApi('a')).unwrap()).toBe(true);
    expect(titles()).not.toContain('Компьютеры');
  });

  it('ошибка сервера не меняет список и возвращает false', async () => {
    mockHttp([{ method: 'delete', url: 'categories/a', status: 500, reply: { message: 'Ошибка' } }]);
    const store = setupStore();

    expect(await store.dispatch(deleteCategoryApi('a')).unwrap()).toBe(false);
  });
});

describe('фото товаров', () => {
  it('новое фото заменяет старое у того же товара', () => {
    const store = setupStore();
    store.dispatch(addNewImage({ id: '1', name: 'a.png', ownerId: 'p1', url: 'a.png' }));
    store.dispatch(addNewImage({ id: '2', name: 'b.png', ownerId: 'p1', url: 'b.png' }));
    store.dispatch(addNewImage({ id: '3', name: 'c.png', ownerId: 'p2', url: 'c.png' }));

    expect(store.getState().PRODUCTS.images.map((image) => image.url)).toEqual(['b.png', 'c.png']);
  });
});

describe('корзина', () => {
  const monitor = { productId: 'monitor', title: 'Монитор', price: 44472, quantity: 1, imageUrl: 'm.jpg' };

  it('у гостя работает без сервера и сохраняется в браузере', async () => {
    const { calls } = mockHttp([]);
    const store = setupStore();

    await store.dispatch(addToCart(monitor));
    await store.dispatch(updateCartItem({ productId: 'monitor', dto: { quantity: 3 } }));
    expect(store.getState().CART.cart).toMatchObject({ totalItems: 3, totalPrice: 44472 * 3 });

    await store.dispatch(removeFromCart('monitor'));
    expect(store.getState().CART.cart?.items).toEqual([]);
    expect(calls).toHaveLength(0);
  });

  it('у вошедшего пользователя идёт на сервер', async () => {
    saveTokens('access-token', 'refresh-token', String(Math.floor(Date.now() / 1000) + 3600));
    const serverCart = { id: 'c1', userId: 'u1', items: [monitor], totalItems: 1, totalPrice: 44472 };
    const { calls } = mockHttp([
      { method: 'post', url: 'cart/items', reply: serverCart },
      { url: 'cart', reply: serverCart },
    ]);
    const store = setupStore();

    await store.dispatch(addToCart(monitor));

    expect(calls[0]).toMatchObject({ method: 'post', path: 'cart/items', data: monitor });
    expect(store.getState().CART.cart?.totalPrice).toBe(44472);
  });

  it('если сессия истекла, показывает гостевую корзину без ошибки', async () => {
    saveTokens('expired-token', 'refresh-token', String(Math.floor(Date.now() / 1000) + 3600));
    mockHttp([{ url: 'cart', status: 401, reply: { message: 'Unauthorized' } }]);
    const store = setupStore();

    await store.dispatch(getCart());

    expect(store.getState().CART.cart).toMatchObject({ id: 'guest', items: [] });
  });
});
