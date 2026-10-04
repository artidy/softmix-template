import { EmailVerificationService } from './email-verification.service';

function setup(shopUrl?: string) {
  const repository = {
    invalidateActiveForUser: jest.fn(),
    create: jest.fn(),
    findByToken: jest.fn(),
    markUsed: jest.fn(),
    deleteByUserId: jest.fn(),
  };
  const mailService = { sendEmailVerification: jest.fn().mockResolvedValue(undefined) };
  const mailSettingsService = { getDecrypted: jest.fn().mockResolvedValue(shopUrl === undefined ? null : { shopUrl }) };
  const service = new EmailVerificationService(repository as never, mailService as never, mailSettingsService as never);
  const sentUrl = () => mailService.sendEmailVerification.mock.calls[0]?.[2] as string;
  return { service, repository, mailService, sentUrl };
}

const user = { _id: 'u1', email: 'ivan@example.com', name: 'Иван' } as never;

describe('EmailVerificationService.issueAndSend', () => {
  it('ссылка ведёт на публичный адрес из настроек почты', async () => {
    const { service, sentUrl } = setup('https://softmix.kz/');
    await service.issueAndSend(user, 'https://evil.example.com');

    expect(sentUrl()).toMatch(/^https:\/\/softmix\.kz\/api\/auth\/verify-email\?token=[0-9a-f]{64}$/);
  });

  it('без настроек берёт адрес сайта, с которого регистрировались', async () => {
    const { service, sentUrl } = setup('');
    await service.issueAndSend(user, 'https://shop.example.kz/some/path');

    expect(sentUrl()).toMatch(/^https:\/\/shop\.example\.kz\/api\/auth\/verify-email\?token=/);
  });

  it.each(['javascript:alert(1)', 'ftp://files.example.com', 'не адрес', undefined])(
    'подозрительный Origin «%s» не используется',
    async (origin) => {
      const { service, sentUrl } = setup();
      await service.issueAndSend(user, origin);

      expect(sentUrl()).toMatch(/^http:\/\/localhost:4200\/api\/auth\/verify-email\?token=/);
    },
  );

  it('отменяет старые ссылки и выдаёт новую на 24 часа', async () => {
    const { service, repository } = setup('https://softmix.kz');
    const before = Date.now();
    await service.issueAndSend(user);

    expect(repository.invalidateActiveForUser).toHaveBeenCalledWith('u1');
    const record = repository.create.mock.calls[0][0];
    expect(record.userId).toBe('u1');
    expect(record.token).toMatch(/^[0-9a-f]{64}$/);
    const ttl = record.expiresAt.getTime() - before;
    expect(ttl).toBeGreaterThanOrEqual(24 * 60 * 60 * 1000 - 1000);
    expect(ttl).toBeLessThanOrEqual(24 * 60 * 60 * 1000 + 1000);
  });

  it('без email ничего не делает', async () => {
    const { service, repository, mailService } = setup();
    await service.issueAndSend({ _id: 'u1', email: '' } as never);

    expect(repository.create).not.toHaveBeenCalled();
    expect(mailService.sendEmailVerification).not.toHaveBeenCalled();
  });

  it('сбой почты не ломает регистрацию', async () => {
    const { service, mailService } = setup('https://softmix.kz');
    mailService.sendEmailVerification.mockRejectedValue(new Error('SMTP недоступен'));

    await expect(service.issueAndSend(user)).resolves.toBeUndefined();
  });
});

describe('EmailVerificationService.verifyToken', () => {
  it('неизвестная ссылка', async () => {
    const { service, repository } = setup();
    repository.findByToken.mockResolvedValue(null);
    await expect(service.verifyToken('x')).resolves.toEqual({ ok: false, reason: 'NOT_FOUND' });
  });

  it('уже использованная ссылка', async () => {
    const { service, repository } = setup();
    repository.findByToken.mockResolvedValue({ id: 'r1', usedAt: new Date(), expiresAt: new Date(Date.now() + 1000) });
    await expect(service.verifyToken('x')).resolves.toEqual({ ok: false, reason: 'USED' });
  });

  it('просроченная ссылка', async () => {
    const { service, repository } = setup();
    repository.findByToken.mockResolvedValue({ id: 'r1', usedAt: null, expiresAt: new Date(Date.now() - 1000) });
    await expect(service.verifyToken('x')).resolves.toEqual({ ok: false, reason: 'EXPIRED' });
  });

  it('действующая ссылка подтверждает и гасится', async () => {
    const { service, repository } = setup();
    repository.findByToken.mockResolvedValue({ id: 'r1', userId: 'u1', usedAt: null, expiresAt: new Date(Date.now() + 1000) });

    await expect(service.verifyToken('x')).resolves.toEqual({ ok: true, userId: 'u1' });
    expect(repository.markUsed).toHaveBeenCalledWith('r1');
  });
});
