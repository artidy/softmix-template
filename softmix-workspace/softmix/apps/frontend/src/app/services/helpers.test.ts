import { describe, expect, it } from 'vitest';

import { getImageUrl, getQueryString } from './helpers';

describe('getQueryString', () => {
  it('собирает строку запроса и пропускает пустые значения', () => {
    expect(getQueryString({ limit: 21, page: 2, categoryId: undefined, sortBy: null as never })).toBe('?limit=21&page=2');
  });

  it('массив превращает в повторяющиеся параметры — так их понимает бэкенд', () => {
    expect(getQueryString({ categoryIds: ['a', 'b'] })).toBe('?categoryIds=a&categoryIds=b');
  });

  it('кодирует кириллицу и спецсимволы', () => {
    expect(getQueryString({ search: 'монитор 27"' })).toBe(`?search=${encodeURIComponent('монитор 27"')}`);
  });

  it('исключает указанные параметры', () => {
    expect(getQueryString({ page: 3, limit: 21, categoryId: 'x' }, ['page', 'limit'])).toBe('?categoryId=x');
  });

  it('без параметров — пустая строка', () => {
    expect(getQueryString({})).toBe('');
  });
});

describe('getImageUrl', () => {
  const images = [{ id: '1', name: 'p1.jpg', ownerId: 'product-1', url: 'assets/img/products/p1.jpg' }];

  it('фото, загруженное сотрудником, важнее картинки поставщика', () => {
    expect(getImageUrl(images, 'product-1', 'https://supplier/p1.jpg')).toBe('assets/img/products/p1.jpg');
  });

  it('без своего фото берёт картинку поставщика', () => {
    expect(getImageUrl(images, 'product-2', 'https://supplier/p2.jpg')).toBe('https://supplier/p2.jpg');
  });
});
