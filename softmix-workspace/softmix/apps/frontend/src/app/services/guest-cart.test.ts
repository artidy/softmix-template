import { beforeEach, describe, expect, it } from 'vitest';

import { addItem, clearGuestCart, getGuestCart, hasGuestItems, removeItem, takeGuestItems, updateItem } from './guest-cart';

const monitor = { productId: 'monitor', title: 'Монитор', price: 44472, quantity: 1, imageUrl: 'm.jpg' };
const printer = { productId: 'printer', title: 'Принтер', price: 120000, quantity: 2, imageUrl: 'p.jpg' };

describe('гостевая корзина', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('пустая по умолчанию', () => {
    expect(getGuestCart()).toMatchObject({ items: [], totalItems: 0, totalPrice: 0 });
    expect(hasGuestItems()).toBe(false);
  });

  it('добавляет товары и считает итог', () => {
    addItem(monitor);
    const cart = addItem(printer);
    expect(cart.items).toHaveLength(2);
    expect(cart.totalItems).toBe(3);
    expect(cart.totalPrice).toBe(44472 + 240000);
  });

  it('повторное добавление увеличивает количество, а не дублирует строку', () => {
    addItem(monitor);
    const cart = addItem({ ...monitor, quantity: 2 });
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(3);
  });

  it('меняет количество, а при нуле удаляет товар', () => {
    addItem(monitor);
    expect(updateItem('monitor', 5).totalItems).toBe(5);
    expect(updateItem('monitor', 0).items).toHaveLength(0);
  });

  it('удаляет товар', () => {
    addItem(monitor);
    addItem(printer);
    expect(removeItem('monitor').items.map((item) => item.productId)).toEqual(['printer']);
  });

  it('сохраняется между перезагрузками страницы', () => {
    addItem(monitor);
    expect(getGuestCart().items).toEqual([monitor]);
  });

  it('при входе отдаёт товары для переноса и очищается', () => {
    addItem(monitor);
    expect(takeGuestItems()).toEqual([monitor]);
    expect(hasGuestItems()).toBe(false);
  });

  it('переживает испорченные данные в хранилище', () => {
    localStorage.setItem('softmix-guest-cart', '{oops');
    expect(getGuestCart().items).toEqual([]);
    clearGuestCart();
    expect(hasGuestItems()).toBe(false);
  });
});
