import { randomBytes } from 'crypto';

import { EncryptionService } from './encryption.service';

function makeService(key = randomBytes(32).toString('hex')) {
  return new EncryptionService({ get: () => key } as never);
}

describe('EncryptionService', () => {
  it('шифрует и расшифровывает обратно', () => {
    const service = makeService();
    const secret = 'smtp-пароль: p@ss/w0rd';

    const encrypted = service.encrypt(secret);

    expect(encrypted).not.toContain(secret);
    expect(service.isEncrypted(encrypted)).toBe(true);
    expect(service.decrypt(encrypted)).toBe(secret);
  });

  it('один и тот же секрет каждый раз шифруется по-разному', () => {
    const service = makeService();
    expect(service.encrypt('secret')).not.toBe(service.encrypt('secret'));
  });

  it('подделанные данные не расшифровываются', () => {
    const service = makeService();
    const [iv, tag, data] = service.encrypt('secret').split(':');
    const tampered = `${iv}:${tag}:${data.slice(0, -2)}${data.endsWith('00') ? '01' : '00'}`;

    expect(() => service.decrypt(tampered)).toThrow();
  });

  it('чужим ключом не расшифровать', () => {
    const encrypted = makeService().encrypt('secret');
    expect(() => makeService().decrypt(encrypted)).toThrow();
  });

  it('пустые и неполные значения', () => {
    const service = makeService();
    expect(service.encrypt('')).toBe('');
    expect(service.decrypt('')).toBe('');
    expect(service.decrypt('abc')).toBe('');
    expect(service.isEncrypted('plain-text')).toBe(false);
    expect(service.isEncrypted('')).toBe(false);
  });

  it('маска для показа в админке', () => {
    expect(EncryptionService.MASKED_VALUE).toBe('******');
  });
});
