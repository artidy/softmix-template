import { AuthController } from './auth.controller';

function setup(result: unknown) {
  const userService = { setEmailVerified: jest.fn() };
  const emailVerificationService = { verifyToken: jest.fn().mockResolvedValue(result) };
  const controller = new AuthController({} as never, userService as never, emailVerificationService as never);
  const res = { redirect: jest.fn() };
  return { controller, userService, res };
}

describe('AuthController.verifyEmail', () => {
  it('успешное подтверждение отмечает почту и ведёт на страницу результата того же сайта', async () => {
    const { controller, userService, res } = setup({ ok: true, userId: 'u1' });

    await controller.verifyEmail('token', res as never);

    expect(userService.setEmailVerified).toHaveBeenCalledWith('u1');
    // Относительный путь: браузер остаётся на домене, где открыли письмо.
    expect(res.redirect).toHaveBeenCalledWith('/verify-email?status=success');
  });

  it('ошибка передаёт причину', async () => {
    const { controller, userService, res } = setup({ ok: false, reason: 'EXPIRED' });

    await controller.verifyEmail('token', res as never);

    expect(userService.setEmailVerified).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/verify-email?status=failed&reason=EXPIRED');
  });

  it('без токена — «ссылка не найдена»', async () => {
    const { controller, res } = setup(undefined);

    await controller.verifyEmail('', res as never);

    expect(res.redirect).toHaveBeenCalledWith('/verify-email?status=failed&reason=NOT_FOUND');
  });
});
