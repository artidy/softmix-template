import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { mockHttp } from '../../test/mock-http';
import { authState, guestState, makeUser, renderWithProviders } from '../../test/render';
import { UserMenu } from '../layout/user-menu';
import { AuthorizationStatus, UserRole } from '../types/user';
import LoginPage from './login.page';
import RegisterPage from './register.page';
import VerifyEmailPage from './verify-email.page';

describe('Вход', () => {
  it('отправляет логин и пароль, после входа возвращает на исходную страницу', async () => {
    const user = makeUser(UserRole.User);
    const { calls } = mockHttp([
      {
        method: 'post',
        url: 'auth/login',
        reply: { accessToken: 'access', refreshToken: 'refresh', expiresIn: String(Math.floor(Date.now() / 1000) + 3600) },
      },
      { url: 'users/auth/jwt/verify', reply: user },
      { url: 'cart', reply: { id: 'c', userId: user.id, items: [], totalItems: 0, totalPrice: 0 } },
    ]);
    const { user: actor } = renderWithProviders(<LoginPage />, {
      route: { pathname: '/login', state: { from: '/checkout' } },
      path: '/login',
      preloadedState: guestState,
    });

    await actor.type(screen.getByLabelText('Логин или email'), '  ivan  ');
    await actor.type(screen.getByLabelText('Пароль'), 'secret-123');
    await actor.click(screen.getByRole('button', { name: 'Войти' }));

    expect(calls.find((call) => call.path === 'auth/login')?.data).toEqual({ login: 'ivan', password: 'secret-123' });
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/checkout'));
  });

  it('пока проверяется сохранённый вход, форму не показывает', () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: { USERS: { ...guestState.USERS!, authorizationStatus: AuthorizationStatus.Unknown } },
    });

    expect(screen.queryByLabelText('Логин или email')).not.toBeInTheDocument();
    expect(screen.getByText('Загрузка…')).toBeInTheDocument();
  });
});

describe('Регистрация', () => {
  it('проверяет поля до отправки', async () => {
    const { calls } = mockHttp([]);
    const { user } = renderWithProviders(<RegisterPage />, { preloadedState: guestState });

    await user.type(screen.getByLabelText(/^Email/), 'not-an-email');
    await user.type(screen.getByLabelText(/^Пароль/), '12345');
    await user.type(screen.getByLabelText(/Подтвердите пароль/), '54321');
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    expect(screen.getByText('Имя должно содержать минимум 2 символа')).toBeInTheDocument();
    expect(screen.getByText('Логин должен содержать минимум 3 символа')).toBeInTheDocument();
    expect(screen.getByText('Некорректный email')).toBeInTheDocument();
    expect(screen.getByText('Пароль должен содержать минимум 6 символов')).toBeInTheDocument();
    expect(screen.getByText('Пароли не совпадают')).toBeInTheDocument();
    expect(calls).toHaveLength(0);
  });

  it('после регистрации просит проверить почту', async () => {
    const { calls } = mockHttp([{ method: 'post', url: 'auth/register', reply: {} }]);
    const { user } = renderWithProviders(<RegisterPage />, { preloadedState: guestState });

    await user.type(screen.getByLabelText(/^Имя/), 'Иван');
    await user.type(screen.getByLabelText(/^Логин/), 'ivan');
    await user.type(screen.getByLabelText(/^Email/), 'Ivan@Example.com ');
    await user.type(screen.getByLabelText(/^Пароль/), 'secret-123');
    await user.type(screen.getByLabelText(/Подтвердите пароль/), 'secret-123');
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    expect(await screen.findByRole('heading', { name: 'Проверьте почту' })).toBeInTheDocument();
    expect(screen.getByText('Ivan@Example.com')).toBeInTheDocument();
    expect(calls[0].data).toMatchObject({ name: 'Иван', login: 'ivan', email: 'Ivan@Example.com', role: 'user' });
  });

  it('вошедшего пользователя отправляет на главную', () => {
    renderWithProviders(<RegisterPage />, { route: '/register', preloadedState: authState(makeUser()) });

    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/);
  });
});

describe('Подтверждение почты', () => {
  it('успех предлагает войти', () => {
    renderWithProviders(<VerifyEmailPage />, { route: '/verify-email?status=success' });

    expect(screen.getByRole('heading', { name: 'Email подтверждён' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Войти' })).toHaveAttribute('href', '/login');
  });

  it('при устаревшей ссылке объясняет причину и даёт запросить новую', async () => {
    const { calls } = mockHttp([{ method: 'post', url: 'auth/resend-verification', reply: { message: 'Письмо отправлено' } }]);
    const { user } = renderWithProviders(<VerifyEmailPage />, { route: '/verify-email?status=failed&reason=EXPIRED' });

    expect(screen.getByText('Срок действия ссылки истёк (24 часа).')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Отправить ссылку повторно' })).toBeDisabled();

    await user.type(screen.getByPlaceholderText('Логин или email'), 'ivan');
    await user.click(screen.getByRole('button', { name: 'Отправить ссылку повторно' }));

    await waitFor(() => expect(calls[0]).toMatchObject({ path: 'auth/resend-verification', data: { identifier: 'ivan' } }));
  });
});

describe('Меню пользователя в шапке', () => {
  it('пока проверяется вход — нейтральная заглушка вместо «Войти»', () => {
    renderWithProviders(<UserMenu />, {
      preloadedState: { USERS: { ...guestState.USERS!, authorizationStatus: AuthorizationStatus.Unknown } },
    });
    expect(screen.queryByRole('link', { name: 'Войти' })).not.toBeInTheDocument();
  });

  it('гостю — кнопка входа', () => {
    renderWithProviders(<UserMenu />, { preloadedState: guestState });
    expect(screen.getByRole('link', { name: 'Войти' })).toHaveAttribute('href', '/login');
  });

  it('сотруднику — пункт «Панель управления»', async () => {
    const { user } = renderWithProviders(<UserMenu />, { preloadedState: authState(makeUser(UserRole.Manager)) });

    await user.click(screen.getByRole('button', { name: 'Меню аккаунта' }));

    expect(await screen.findByRole('menuitem', { name: 'Панель управления' })).toHaveAttribute('href', '/admin');
    expect(screen.getByRole('menuitem', { name: 'Мои заказы' })).toHaveAttribute('href', '/profile/orders');
  });

  it('покупателю панель управления не показывается', async () => {
    const { user } = renderWithProviders(<UserMenu />, { preloadedState: authState(makeUser(UserRole.User)) });

    await user.click(screen.getByRole('button', { name: 'Меню аккаунта' }));

    expect(await screen.findByRole('menuitem', { name: 'Профиль' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Панель управления' })).not.toBeInTheDocument();
  });
});
