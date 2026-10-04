import { describe, expect, it } from 'vitest';

import { apiProduct } from '../../test/fixtures';
import { mockHttp } from '../../test/mock-http';
import { setupStore } from './index';
import { shopApi } from './shop-api';
import { createProductApi, deleteProductApi, updateProductApi } from './products-data/api-actions';

describe('shopApi.getProducts', () => {
  it('передаёт фильтры каталога в запрос и адаптирует ответ', async () => {
    const product = apiProduct({ imageUrl: '' });
    const { calls } = mockHttp([{ url: 'products', reply: { products: [product], total: 1 } }]);
    const store = setupStore();

    const result = await store.dispatch(
      shopApi.endpoints.getProducts.initiate({ limit: 21, page: 2, categoryIds: ['a', 'b'], sortBy: 'price_asc', search: 'монитор' }),
    );

    expect(result.data?.total).toBe(1);
    // Пустая картинка заменяется заглушкой «нет фото».
    expect(result.data?.products[0].imageUrl).toBe('/assets/img/no-photo.svg');

    const params = calls[0].params;
    expect(params.get('limit')).toBe('21');
    expect(params.get('page')).toBe('2');
    expect(params.getAll('categoryIds')).toEqual(['a', 'b']);
    expect(params.get('sortBy')).toBe('price_asc');
    expect(params.get('search')).toBe('монитор');
  });

  it('одинаковый запрос берёт из кэша, не ходя на сервер второй раз', async () => {
    const { calls } = mockHttp([{ url: 'products', reply: { products: [], total: 0 } }]);
    const store = setupStore();

    await store.dispatch(shopApi.endpoints.getProducts.initiate({ limit: 21, page: 1 }));
    await store.dispatch(shopApi.endpoints.getProducts.initiate({ limit: 21, page: 1 }));

    expect(calls.filter((call) => call.path === 'products')).toHaveLength(1);
  });
});

describe('shopApi.getProduct', () => {
  it('отдаёт товар и запоминает фото, загруженное сотрудником', async () => {
    const product = apiProduct({ id: 'p1' });
    mockHttp([
      { url: 'products/p1', reply: product },
      { url: 'uploader/products/p1', reply: { id: 'f1', name: 'p1.png', ownerId: 'p1', url: 'assets/img/products/p1.png' } },
    ]);
    const store = setupStore();

    const result = await store.dispatch(shopApi.endpoints.getProduct.initiate('p1'));

    expect(result.data?.title).toBe(product.title);
    expect(store.getState().PRODUCTS.images).toEqual([
      { id: 'f1', name: 'p1.png', ownerId: 'p1', url: 'assets/img/products/p1.png' },
    ]);
  });

  it('без своего фото не падает', async () => {
    mockHttp([{ url: 'products/p2', reply: apiProduct({ id: 'p2' }) }]);
    const store = setupStore();

    const result = await store.dispatch(shopApi.endpoints.getProduct.initiate('p2'));

    expect(result.data?.id).toBe('p2');
    expect(store.getState().PRODUCTS.images).toEqual([]);
  });

  it('пустой ответ сервера считает «товар не найден»', async () => {
    mockHttp([{ url: 'products/missing', reply: {} }]);
    const store = setupStore();

    const result = await store.dispatch(shopApi.endpoints.getProduct.initiate('missing'));

    expect(result.error).toMatchObject({ status: 404 });
  });
});

describe('shopApi.getShowcase', () => {
  it('берёт по одному свежему товару с фото из каждого направления', async () => {
    const byGroup: Record<string, unknown> = {
      // В первом направлении у самого нового товара нет фото — берётся следующий.
      'pc,parts': { products: [apiProduct({ id: 'pc-no-photo', imageUrl: '' }), apiProduct({ id: 'pc-photo' })], total: 2 },
      office: { products: [apiProduct({ id: 'office-photo' })], total: 1 },
      // В направлении без фото ничего не берётся.
      soft: { products: [apiProduct({ id: 'soft-no-photo', imageUrl: '' })], total: 1 },
    };
    const { calls } = mockHttp([
      {
        url: 'products',
        reply: (config) => {
          const key = new URLSearchParams(String(config.url).split('?')[1]).getAll('categoryIds').join(',');
          if (key === 'broken') {
            throw new Error('сбой одного направления');
          }
          return byGroup[key];
        },
      },
    ]);
    const store = setupStore();

    const result = await store.dispatch(shopApi.endpoints.getShowcase.initiate([['pc', 'parts'], ['office'], ['soft'], ['broken']]));

    expect(result.data?.map((product) => product.id)).toEqual(['pc-photo', 'office-photo']);
    expect(calls).toHaveLength(4);
    expect(calls[0].params.get('sortBy')).toBe('newest');
    expect(calls[0].params.get('limit')).toBe('6');
  });
});

describe('изменение товаров обновляет списки', () => {
  it('после создания, правки и удаления каталог перезапрашивается', async () => {
    const product = apiProduct({ id: 'p1' });
    const { calls } = mockHttp([
      { url: 'products', reply: { products: [product], total: 1 } },
      { method: 'post', url: 'products', reply: product },
      { method: 'patch', url: 'products/p1', reply: product },
      { method: 'delete', url: 'products/p1', status: 204, reply: '' },
    ]);
    const store = setupStore();
    const subscription = store.dispatch(shopApi.endpoints.getProducts.initiate({ limit: 21, page: 1 }));
    await subscription;
    const listRequests = () => calls.filter((call) => call.method === 'get' && call.path === 'products').length;
    expect(listRequests()).toBe(1);

    expect(await store.dispatch(createProductApi({ title: 'Новый' } as never)).unwrap()).toBe(true);
    await waitForRequests(() => listRequests() === 2);

    expect(await store.dispatch(updateProductApi({ id: 'p1', title: 'Новое имя' })).unwrap()).toBe(true);
    await waitForRequests(() => listRequests() === 3);

    expect(await store.dispatch(deleteProductApi('p1')).unwrap()).toBe(true);
    await waitForRequests(() => listRequests() === 4);

    subscription.unsubscribe();
  });

  it('при ошибке сервера возвращает false', async () => {
    mockHttp([{ method: 'post', url: 'products', status: 400, reply: { message: 'Ошибка' } }]);
    const store = setupStore();

    expect(await store.dispatch(createProductApi({ title: '' } as never)).unwrap()).toBe(false);
  });
});

async function waitForRequests(condition: () => boolean) {
  for (let attempt = 0; attempt < 50 && !condition(); attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  expect(condition()).toBe(true);
}
