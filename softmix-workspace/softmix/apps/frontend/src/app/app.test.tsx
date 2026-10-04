import { screen, waitFor, within } from '@testing-library/react';
import { toast } from 'sonner';
import { describe, expect, it, vi } from 'vitest';
import { DeliveryType, OrderStatus, PaymentMethod, PaymentStatus } from '@project-lib/shared-types';

import { MockRoute, mockHttp } from '../test/mock-http';
import { authState, guestState, makeUser, renderWithProviders } from '../test/render';
import { App } from './app';
import { UserRole } from './types/user';

const settingsRoute: MockRoute = { url: 'settings', reply: { phone: '78-72-06', email: 'support@softmix.kz', address: 'Астана' } };

describe('Маршруты', () => {
  it('неизвестный адрес показывает «Страница не найдена»', async () => {
    mockHttp([settingsRoute]);
    renderWithProviders(<App />, { route: '/no-such-page', preloadedState: guestState });

    expect(await screen.findByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'На главную' })).toHaveAttribute('href', '/');
  });

  it.each(['/profile', '/profile/orders', '/admin/orders'])('%s без входа ведёт на страницу входа', async (route) => {
    mockHttp([settingsRoute]);
    renderWithProviders(<App />, { route, preloadedState: guestState });

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent(/^\/login$/));
  });

  it('старая страница загрузок ведёт на импорт товаров', async () => {
    mockHttp([settingsRoute, { url: 'external-services', reply: [] }]);
    renderWithProviders(<App />, { route: '/downloads', preloadedState: authState(makeUser(UserRole.Manager)) });

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/admin/import'));
  });

  it('покупатель не попадает в панель управления', async () => {
    mockHttp([settingsRoute]);
    renderWithProviders(<App />, { route: '/admin/orders', preloadedState: authState(makeUser(UserRole.User)) });

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/));
  });
});

describe('Панель управления', () => {
  it('менеджер видит только раздел магазина, администратор — всё', async () => {
    mockHttp([settingsRoute, { url: 'orders', reply: { orders: [], total: 0 } }]);
    renderWithProviders(<App />, { route: '/admin/orders', preloadedState: authState(makeUser(UserRole.Manager)) });

    const nav = await screen.findByRole('navigation', { name: 'Разделы панели управления' });
    expect(within(nav).getByRole('link', { name: 'Заказы' })).toBeInTheDocument();
    expect(within(nav).queryByRole('link', { name: 'Пользователи' })).not.toBeInTheDocument();
  });

  it('менеджера не пускает в разделы администратора', async () => {
    mockHttp([settingsRoute, { url: 'external-services', reply: [] }]);
    renderWithProviders(<App />, { route: '/admin/users', preloadedState: authState(makeUser(UserRole.Manager)) });

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/admin/import'));
  });

  it('заказы: фильтр по статусу уходит в запрос', async () => {
    const order = {
      id: 'o1',
      orderNumber: 'SM-1',
      userId: 'u',
      items: [],
      totalItems: 1,
      totalPrice: 1000,
      currency: 'KZT',
      status: OrderStatus.Paid,
      contact: { name: 'Иван', phone: '+77011234567', email: 'i@example.com' },
      delivery: { type: DeliveryType.Pickup, cost: 0 },
      payment: { method: PaymentMethod.FreedomPay, status: PaymentStatus.Paid },
      statusHistory: [],
      createdAt: '2026-10-04T09:00:00Z',
      updatedAt: '2026-10-04T09:00:00Z',
    };
    const { calls } = mockHttp([settingsRoute, { url: 'orders', reply: { orders: [order], total: 1 } }]);
    const { user } = renderWithProviders(<App />, { route: '/admin/orders', preloadedState: authState(makeUser(UserRole.Admin)) });

    expect(await screen.findByText('SM-1')).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Статус'), OrderStatus.Paid);

    await waitFor(() => expect(calls.some((call) => call.path === 'orders' && call.params.get('status') === OrderStatus.Paid)).toBe(true));
  });

  it('пользователи: нельзя удалить себя, другого — после подтверждения', async () => {
    const admin = makeUser(UserRole.Admin, { id: 'me', login: 'admin' });
    const other = makeUser(UserRole.User, { id: 'other', login: 'buyer', name: 'Покупатель' });
    const error = vi.spyOn(toast, 'error');
    const { calls } = mockHttp([
      settingsRoute,
      { url: 'users', reply: [admin, other] },
      { method: 'delete', url: 'users/other', status: 204, reply: '' },
    ]);
    const { user } = renderWithProviders(<App />, { route: '/admin/users', preloadedState: authState(admin) });

    await user.click(await screen.findByRole('button', { name: 'Удалить admin' }));
    expect(error).toHaveBeenCalledWith('Нельзя удалить своего пользователя!');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Удалить buyer' }));
    const dialog = await screen.findByRole('dialog', { name: 'Удалить пользователя?' });
    await user.click(within(dialog).getByRole('button', { name: 'Удалить' }));

    await waitFor(() => expect(calls.some((call) => call.method === 'delete' && call.path === 'users/other')).toBe(true));
  });

  it('пользователи: кнопка «Редактировать» открывает форму с запретом смены логина', async () => {
    const admin = makeUser(UserRole.Admin, { id: 'me', login: 'admin' });
    const other = makeUser(UserRole.Manager, { id: 'other', login: 'manager', name: 'Менеджер' });
    mockHttp([settingsRoute, { url: 'users', reply: [admin, other] }, { url: 'users/other', reply: other }]);
    const { user } = renderWithProviders(<App />, { route: '/admin/users', preloadedState: authState(admin) });

    await user.click(await screen.findByRole('button', { name: 'Редактировать manager' }));
    const dialog = await screen.findByRole('dialog', { name: 'Редактировать пользователя' });

    const login = await within(dialog).findByLabelText(/^Логин/);
    expect(login).toHaveValue('manager');
    expect(login).toHaveAttribute('readonly');
    expect(within(dialog).getByRole('radio', { name: 'Менеджер' })).toBeChecked();
  });
});
