import { describe, expect, it } from 'vitest';

import { category } from '../../test/fixtures';
import { buildCategoryOptions, categoryLink, collectCategoryIds, getDirections, getDiscountPercent } from './catalog';

const NBSP = String.fromCharCode(0xa0);

describe('getDiscountPercent', () => {
  it('берёт скидку из поля discount, если она задана', () => {
    expect(getDiscountPercent({ discount: 15, price: 1000, pricePrev: 0 })).toBe(15);
    expect(getDiscountPercent({ discount: 12.6, price: 1000, pricePrev: 0 })).toBe(13);
  });

  it('считает скидку по старой цене', () => {
    expect(getDiscountPercent({ discount: 0, price: 750, pricePrev: 1000 })).toBe(25);
  });

  it('нет скидки, если старая цена не выше текущей', () => {
    expect(getDiscountPercent({ discount: 0, price: 1000, pricePrev: 1000 })).toBe(0);
    expect(getDiscountPercent({ discount: 0, price: 1000, pricePrev: 900 })).toBe(0);
    expect(getDiscountPercent({ discount: 0, price: 1000, pricePrev: 0 })).toBe(0);
  });
});

describe('getDirections', () => {
  it('возвращает только корневые категории по порядку', () => {
    const categories = [
      category('b', 'Офисная техника', null, 2),
      category('child', 'Мониторы', 'a', 1),
      category('a', 'Компьютеры', null, 1),
    ];
    expect(getDirections(categories).map((item) => item.id)).toEqual(['a', 'b']);
  });
});

describe('categoryLink', () => {
  it('ведёт в каталог с параметром categoryId', () => {
    expect(categoryLink('abc')).toBe('/shop?categoryId=abc');
  });

  it('без категории ведёт во весь каталог', () => {
    expect(categoryLink()).toBe('/shop');
  });
});

describe('collectCategoryIds', () => {
  const tree = [
    category('root', 'Компьютеры'),
    category('pc', 'Комплектующие', 'root'),
    category('gpu', 'Видеокарты', 'pc'),
    category('laptops', 'Ноутбуки', 'root'),
    category('other', 'Офисная техника'),
  ];

  it('собирает категорию и всех её потомков', () => {
    expect(collectCategoryIds('root', tree).sort()).toEqual(['gpu', 'laptops', 'pc', 'root']);
  });

  it('для листа возвращает только его', () => {
    expect(collectCategoryIds('gpu', tree)).toEqual(['gpu']);
  });

  it('не зацикливается на ошибочных данных', () => {
    const cyclic = [category('a', 'A', 'b'), category('b', 'B', 'a')];
    expect(collectCategoryIds('a', cyclic).sort()).toEqual(['a', 'b']);
  });

  it('работает, пока дерево не загружено', () => {
    expect(collectCategoryIds('root', [])).toEqual(['root']);
  });
});

describe('buildCategoryOptions', () => {
  it('выстраивает дерево с отступами по уровню', () => {
    const options = buildCategoryOptions([
      category('gpu', 'Видеокарты', 'pc'),
      category('root', 'Компьютеры'),
      category('pc', 'Комплектующие', 'root'),
    ]);
    expect(options).toEqual([
      { id: 'root', label: 'Компьютеры' },
      { id: 'pc', label: `${NBSP.repeat(3)}Комплектующие` },
      { id: 'gpu', label: `${NBSP.repeat(6)}Видеокарты` },
    ]);
  });

  it('категорию с несуществующим родителем показывает на верхнем уровне', () => {
    expect(buildCategoryOptions([category('orphan', 'Сирота', 'missing')])).toEqual([{ id: 'orphan', label: 'Сирота' }]);
  });
});
