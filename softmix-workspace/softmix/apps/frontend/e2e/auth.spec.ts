import { expect, test } from './fixtures';

// Тесты не создают аккаунты и не отправляют писем: только проверки форм и доступа.
test.describe('Вход, регистрация и доступ', () => {
  test('неверный логин — понятное сообщение', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Логин или email').fill('e2e-нет-такого-пользователя');
    await page.getByLabel('Пароль', { exact: true }).fill('wrong-password');
    await page.getByRole('button', { name: 'Войти' }).click();

    await expect(page.getByText(/не зарегистрирован|неверн/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('пароль можно показать', async ({ page }) => {
    await page.goto('/login');
    const password = page.getByLabel('Пароль', { exact: true });
    await password.fill('secret');

    await page.getByRole('button', { name: 'Показать пароль' }).click();

    await expect(password).toHaveAttribute('type', 'text');
  });

  test('регистрация проверяет поля до отправки', async ({ page }) => {
    await page.goto('/register');

    await page.getByRole('button', { name: 'Зарегистрироваться' }).click();

    await expect(page.getByText('Имя должно содержать минимум 2 символа')).toBeVisible();
    await expect(page.getByText('Некорректный email')).toBeVisible();
    await expect(page.getByText('Пароль должен содержать минимум 6 символов')).toBeVisible();
  });

  for (const path of ['/profile', '/profile/orders', '/checkout', '/admin', '/admin/users', '/downloads']) {
    test(`${path} без входа ведёт на вход`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login$/);
    });
  }

  test('ссылка подтверждения почты с неверным токеном', async ({ page }) => {
    await page.goto('/api/auth/verify-email?token=e2e-invalid-token');

    await expect(page).toHaveURL(/\/verify-email\?status=failed&reason=NOT_FOUND/);
    await expect(page.getByRole('heading', { name: 'Не удалось подтвердить email' })).toBeVisible();
    await expect(page.getByText('Ссылка недействительна или устарела.')).toBeVisible();
  });
});
