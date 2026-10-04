import { beforeEach, describe, expect, it } from 'vitest';

import { EXPIRES_IN, REFRESH_TOKEN, TOKEN } from '../const';
import { dropTokens, getActiveToken, getExpiresIn, saveTokens } from './token';

describe('токены', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('сохраняет и отдаёт токен доступа', () => {
    saveTokens('access', 'refresh', '1800000000');
    expect(getActiveToken()).toBe('access');
    expect(getExpiresIn()).toBe(1800000000);
  });

  it('без сохранённого срока возвращает null, а не 0', () => {
    expect(getExpiresIn()).toBeNull();
  });

  it('dropTokens очищает всё', () => {
    saveTokens('access', 'refresh', '1800000000');
    dropTokens();
    expect(localStorage.getItem(TOKEN)).toBeNull();
    expect(localStorage.getItem(REFRESH_TOKEN)).toBeNull();
    expect(localStorage.getItem(EXPIRES_IN)).toBeNull();
    expect(getActiveToken()).toBeNull();
  });
});
