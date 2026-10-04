import { getCurrentSeconds, getPageOffset, isTokenData } from './helpers';

describe('shared-types helpers', () => {
  it('getPageOffset считает смещение страницы', () => {
    expect(getPageOffset(1, 21)).toBe(0);
    expect(getPageOffset(3, 21)).toBe(42);
  });

  it('isTokenData узнаёт ответ сервера с токенами', () => {
    expect(isTokenData({ accessToken: 'a', refreshToken: 'r', expiresIn: '1' })).toBe(true);
    expect(isTokenData({ accessToken: 'a' })).toBe(false);
    expect(isTokenData(null)).toBe(false);
    expect(isTokenData('token')).toBe(false);
  });

  it('getCurrentSeconds — время в секундах', () => {
    expect(Math.abs(getCurrentSeconds() - Date.now() / 1000)).toBeLessThan(2);
  });
});
