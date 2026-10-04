import { screen, waitFor, within } from '@testing-library/react';
import { toast } from 'sonner';
import { describe, expect, it, vi } from 'vitest';
import { DeliveryType, OrderStatus, PaymentMethod, PaymentStatus } from '@project-lib/shared-types';

import { mockHttp } from '../../test/mock-http';
import { authState, guestState, makeUser, renderWithProviders } from '../../test/render';
import { saveTokens } from '../services/token';
import { UserRole } from '../types/user';
import CheckoutPage from './checkout.page';
import CheckoutSuccessPage from './checkout-success.page';
import MyOrdersPage from './my-orders.page';
import OrderDetailsPage from './order-details.page';

const monitor = { productId: 'm1', title: 'Монитор', price: 44472, quantity: 2, imageUrl: '' };
const serverCart = { id: 'c1', userId: 'user-user', items: [monitor], totalItems: 2, totalPrice: 88944 };

function apiOrder(patch: Record<string, unknown> = {}) {
  return {
    id: 'o1',
    orderNumber: 'SM-20261004-1234',
    userId: 'user-user',
    items: [monitor],
    totalItems: 2,
    totalPrice: 88944,
    currency: 'KZT',
    status: OrderStatus.Pending,
    contact: { name: 'Иван', phone: '+77011234567', email: 'ivan@example.com' },
    delivery: { type: DeliveryType.Pickup, cost: 0 },
    payment: { method: PaymentMethod.CashOnDelivery, status: PaymentStatus.Pending },
    statusHistory: [{ status: OrderStatus.Pending, changedAt: '2026-10-04T09:00:00Z', comment: 'Заказ создан' }],
    createdAt: '2026-10-04T09:00:00Z',
    updatedAt: '2026-10-04T09:00:00Z',
    ...patch,
  };
}

function signIn() {
  saveTokens('access', 'refresh', String(Math.floor(Date.now() / 1000) + 3600));
}

describe('Оформление заказа', () => {
  it('гостя отправляет на вход и возвращает обратно', () => {
    renderWithProviders(<CheckoutPage />, {
      route: '/checkout',
      path: '/checkout',
      preloadedState: guestState,
    });

    expect(screen.getByTestId('location')).toHaveTextContent('/login');
  });

  it('подставляет данные профиля и оформляет самовывоз', async () => {
    signIn();
    const { calls } = mockHttp([
      { url: 'cart', reply: serverCart },
      { method: 'post', url: 'orders/checkout', reply: apiOrder() },
    ]);
    const { user } = renderWithProviders(<CheckoutPage />, {
      route: '/checkout',
      preloadedState: authState(makeUser(UserRole.User, { name: 'Иван', phone: '+77011234567', email: 'ivan@example.com' })),
    });

    expect(await screen.findByDisplayValue('Иван')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Телефон/)).toHaveValue('+7 (701) 123-45-67');

    await user.click(screen.getByRole('radio', { name: /Самовывоз/ }));
    expect(screen.queryByLabelText(/^Город/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Подтвердить заказ' }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/checkout/success?id=o1'));
    expect(calls.find((call) => call.path === 'orders/checkout')?.data).toEqual({
      contact: { name: 'Иван', phone: '+77011234567', email: 'ivan@example.com' },
      delivery: { type: DeliveryType.Pickup, cost: 0 },
      payment: { method: PaymentMethod.CashOnDelivery },
    });
  });

  it('для курьера требует адрес', async () => {
    signIn();
    const error = vi.spyOn(toast, 'error');
    const { calls } = mockHttp([{ url: 'cart', reply: serverCart }]);
    const { user } = renderWithProviders(<CheckoutPage />, {
      route: '/checkout',
      preloadedState: authState(makeUser(UserRole.User, { name: 'Иван', phone: '+77011234567', email: 'ivan@example.com' })),
    });

    await user.click(await screen.findByRole('radio', { name: /Курьер по городу/ }));
    await user.click(screen.getByRole('button', { name: 'Подтвердить заказ' }));

    expect(error).toHaveBeenCalledWith('Укажите город, улицу и дом для доставки');
    expect(calls.some((call) => call.path === 'orders/checkout')).toBe(false);
  });

  it('не принимает неполный телефон', async () => {
    signIn();
    const error = vi.spyOn(toast, 'error');
    mockHttp([{ url: 'cart', reply: serverCart }]);
    const { user } = renderWithProviders(<CheckoutPage />, {
      route: '/checkout',
      preloadedState: authState(makeUser(UserRole.User, { name: 'Иван', phone: '', email: 'ivan@example.com' })),
    });

    await user.type(await screen.findByLabelText(/^Телефон/), '701123');
    await user.click(screen.getByRole('button', { name: 'Подтвердить заказ' }));

    expect(error).toHaveBeenCalledWith('Телефон должен быть в формате +7 7XX XXX-XX-XX');
  });

  it('при онлайн-оплате уводит на страницу платёжной системы', async () => {
    signIn();
    const assign = vi.fn();
    vi.spyOn(window, 'location', 'get').mockReturnValue({ ...window.location, set href(value: string) { assign(value); } } as Location);
    mockHttp([
      { url: 'cart', reply: serverCart },
      { method: 'post', url: 'orders/checkout', reply: apiOrder({ payment: { method: PaymentMethod.FreedomPay, status: PaymentStatus.Pending } }) },
      { method: 'post', url: 'payments/init/o1', reply: { redirectUrl: 'https://pay.example.com/abc', providerTxId: 't', transactionId: 'tx' } },
    ]);
    const { user } = renderWithProviders(<CheckoutPage />, {
      route: '/checkout',
      preloadedState: authState(makeUser(UserRole.User, { name: 'Иван', phone: '+77011234567', email: 'ivan@example.com' })),
    });

    await user.click(await screen.findByRole('radio', { name: /Самовывоз/ }));
    await user.click(screen.getByRole('radio', { name: /Freedom Pay/ }));
    await user.click(screen.getByRole('button', { name: 'Подтвердить заказ' }));

    await waitFor(() => expect(assign).toHaveBeenCalledWith('https://pay.example.com/abc'));
  });
});

describe('Заказы покупателя', () => {
  it('страница «заказ оформлен» показывает номер и сумму', async () => {
    mockHttp([{ url: 'orders/o1', reply: apiOrder() }]);
    renderWithProviders(<CheckoutSuccessPage />, { route: '/checkout/success?id=o1', preloadedState: authState(makeUser()) });

    expect(await screen.findByText('SM-20261004-1234')).toBeInTheDocument();
    expect(screen.getByText('Принят')).toBeInTheDocument();
    expect(screen.getByText('Оплата при получении')).toBeInTheDocument();
  });

  it('список заказов ведёт на карточку заказа', async () => {
    mockHttp([{ url: 'orders/my', reply: { orders: [apiOrder()], total: 1 } }]);
    renderWithProviders(<MyOrdersPage />, { preloadedState: authState(makeUser()) });

    const link = await screen.findByRole('link', { name: /Заказ SM-20261004-1234/ });
    expect(link).toHaveAttribute('href', '/profile/orders/o1');
    expect(within(link).getByText('Принят')).toBeInTheDocument();
  });

  it('пустой список заказов', async () => {
    mockHttp([{ url: 'orders/my', reply: { orders: [], total: 0 } }]);
    renderWithProviders(<MyOrdersPage />, { preloadedState: authState(makeUser()) });

    expect(await screen.findByText('У вас пока нет заказов')).toBeInTheDocument();
  });

  it('карточка заказа: состав, история и кнопка оплаты для онлайн-способа', async () => {
    mockHttp([
      { url: 'orders/o1', reply: apiOrder({ payment: { method: PaymentMethod.FreedomPay, status: PaymentStatus.Pending } }) },
    ]);
    renderWithProviders(<OrderDetailsPage />, { route: '/profile/orders/o1', path: '/profile/orders/:id', preloadedState: authState(makeUser()) });

    expect(await screen.findByRole('heading', { level: 1, name: 'Заказ SM-20261004-1234' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Монитор' })).toBeInTheDocument();
    expect(screen.getByText('Заказ создан')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Оплатить сейчас' })).toBeInTheDocument();
  });
});
