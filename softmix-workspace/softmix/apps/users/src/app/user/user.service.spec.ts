import { ConflictException } from '@nestjs/common';
import { UserExistsException, UserNotFoundException } from '@project-lib/core';

import { UserService } from './user.service';

function setup() {
  const order: string[] = [];
  const track = (name: string) => jest.fn(async () => {
    order.push(name);
  });
  const userRepository = {
    findByLogin: jest.fn().mockResolvedValue(null),
    findByEmail: jest.fn().mockResolvedValue(null),
    findById: jest.fn(),
    create: jest.fn(async (entity) => entity),
    update: jest.fn(async (_id, entity) => entity),
    destroy: track('destroy'),
    markEmailVerifiedForAll: jest.fn().mockResolvedValue(0),
  };
  const refreshTokenService = { deleteUserSessions: track('sessions') };
  const emailVerificationService = { deleteForUser: track('verification') };
  const cartService = { deleteCart: track('cart') };
  const service = new UserService(
    userRepository as never,
    refreshTokenService as never,
    emailVerificationService as never,
    cartService as never,
  );
  return { service, userRepository, refreshTokenService, emailVerificationService, cartService, order };
}

describe('UserService.delete', () => {
  it('сначала убирает сессии, ключи подтверждения и корзину, затем пользователя', async () => {
    const { service, order, refreshTokenService, emailVerificationService, cartService } = setup();

    await service.delete('u1');

    expect(refreshTokenService.deleteUserSessions).toHaveBeenCalledWith('u1');
    expect(emailVerificationService.deleteForUser).toHaveBeenCalledWith('u1');
    expect(cartService.deleteCart).toHaveBeenCalledWith('u1');
    expect(order.at(-1)).toBe('destroy');
  });

  it('если очистка не удалась, пользователь не удаляется', async () => {
    const { service, userRepository, cartService } = setup();
    cartService.deleteCart.mockRejectedValueOnce(new Error('Mongo недоступен'));

    await expect(service.delete('u1')).rejects.toThrow('Mongo недоступен');
    expect(userRepository.destroy).not.toHaveBeenCalled();
  });
});

describe('UserService.create', () => {
  it('занятый логин — ошибка', async () => {
    const { service, userRepository } = setup();
    userRepository.findByLogin.mockResolvedValue({ login: 'ivan' });

    await expect(service.create({ login: 'ivan', password: 'secret1', name: 'Иван' } as never)).rejects.toBeInstanceOf(
      UserExistsException,
    );
  });

  it('занятый email — ошибка', async () => {
    const { service, userRepository } = setup();
    userRepository.findByEmail.mockResolvedValue({ email: 'ivan@example.com' });

    await expect(
      service.create({ login: 'ivan', email: 'ivan@example.com', password: 'secret1', name: 'Иван' } as never),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('хранит email в нижнем регистре, пароль только хешем, почта не подтверждена', async () => {
    const { service } = setup();

    const created = (await service.create({
      login: 'ivan',
      email: 'Ivan@Example.COM',
      password: 'secret-123',
      name: 'Иван',
    } as never)) as unknown as Record<string, unknown>;

    expect(created.email).toBe('ivan@example.com');
    expect(created.emailVerified).toBe(false);
    expect(created).not.toHaveProperty('password');
    expect(String(created.passwordHash)).toMatch(/^\$2[aby]\$/);
  });
});

describe('UserService.update', () => {
  it('несуществующий пользователь — ошибка', async () => {
    const { service, userRepository } = setup();
    userRepository.findById.mockResolvedValue(null);

    await expect(service.update('nope', { name: 'X' } as never)).rejects.toBeInstanceOf(UserNotFoundException);
  });

  it('новый пароль сохраняется хешем', async () => {
    const { service, userRepository } = setup();
    userRepository.findById.mockResolvedValue({ _id: 'u1', login: 'ivan', name: 'Иван', passwordHash: 'old' });

    const updated = (await service.update('u1', { password: 'new-secret' } as never)) as unknown as Record<string, unknown>;

    expect(updated.passwordHash).not.toBe('old');
    expect(String(updated.passwordHash)).toMatch(/^\$2[aby]\$/);
  });
});
