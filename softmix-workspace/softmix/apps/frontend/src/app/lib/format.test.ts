import { describe, expect, it } from 'vitest';

import { formatNumber, getInitials, pluralize } from './format';

describe('pluralize', () => {
  const forms: [string, string, string] = ['товар', 'товара', 'товаров'];

  it.each([
    [1, 'товар'],
    [21, 'товар'],
    [101, 'товар'],
    [2, 'товара'],
    [4, 'товара'],
    [22, 'товара'],
    [5, 'товаров'],
    [0, 'товаров'],
    [11, 'товаров'],
    [12, 'товаров'],
    [14, 'товаров'],
    [111, 'товаров'],
    [112, 'товаров'],
    [253, 'товара'],
    [788, 'товаров'],
  ])('%i → %s', (count, expected) => {
    expect(pluralize(count, forms)).toBe(expected);
  });
});

describe('formatNumber', () => {
  it('разбивает разряды по-русски', () => {
    expect(formatNumber(1234567)).toBe((1234567).toLocaleString('ru-RU'));
    expect(formatNumber(788)).toBe('788');
  });
});

describe('getInitials', () => {
  it('берёт первые буквы двух слов', () => {
    expect(getInitials('Иван Петров')).toBe('ИП');
    expect(getInitials('анна мария иванова')).toBe('АМ');
  });

  it('работает с одним словом и лишними пробелами', () => {
    expect(getInitials('  admin  ')).toBe('A');
    expect(getInitials('')).toBe('');
  });
});
