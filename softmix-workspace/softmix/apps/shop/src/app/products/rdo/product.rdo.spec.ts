import { fillObject } from '@project-lib/core';

import { ProductRdo } from './product.rdo';

describe('ProductRdo', () => {
  const entity = {
    id: 'p1',
    title: 'Монитор',
    price: 44472,
    pricePrev: 0,
    imageUrl: 'https://img/1.jpg',
    description: 'VA, 100 Гц',
    discount: 0,
    categoryId: 'cat-1',
    isHot: false,
    downloadId: 1,
    downloadCompany: 'Al style',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-02'),
    secretInternalField: 'не должно уйти наружу',
    category: {
      id: 'cat-1',
      title: 'Мониторы',
      ownerId: 'root',
      position: 1,
      products: ['циклическая связь не нужна в ответе'],
      createdAt: new Date('2025-12-09'),
      updatedAt: new Date('2025-12-09'),
    },
  };

  it('отдаёт категорию товара с её полями (раньше приходил пустой объект)', () => {
    const rdo = fillObject(ProductRdo, entity);

    expect(rdo.category).toMatchObject({ id: 'cat-1', title: 'Мониторы', ownerId: 'root', position: 1 });
    expect(rdo.category).not.toHaveProperty('products');
  });

  it('не пропускает лишние поля', () => {
    const rdo = fillObject(ProductRdo, entity);

    expect(rdo).not.toHaveProperty('secretInternalField');
    expect(rdo).toMatchObject({ id: 'p1', title: 'Монитор', price: 44472, categoryId: 'cat-1' });
  });

  it('товар без категории не ломает ответ', () => {
    const rdo = fillObject(ProductRdo, { ...entity, category: null });
    expect(rdo.category).toBeNull();
  });
});
