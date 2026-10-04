import { describe, expect, it } from 'vitest';

import { digitsOnly, formatDate, formatPhoneInput, formatPrice, isValidEmail, isValidKzPhone, phoneToE164 } from './format';

describe('formatPrice', () => {
  it('округляет и добавляет знак тенге', () => {
    expect(formatPrice(44472)).toBe(`${(44472).toLocaleString('ru-RU')} ₸`);
    expect(formatPrice(999.6)).toBe(`${(1000).toLocaleString('ru-RU')} ₸`);
  });

  it('пустое значение — пустая строка', () => {
    expect(formatPrice(null)).toBe('');
    expect(formatPrice(undefined)).toBe('');
  });

  it('ноль показывает как цену', () => {
    expect(formatPrice(0)).toBe('0 ₸');
  });
});

describe('formatDate', () => {
  it('пустое значение — пустая строка', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate('')).toBe('');
  });

  it('принимает строку и Date одинаково', () => {
    const iso = '2026-10-04T09:30:00Z';
    expect(formatDate(iso)).toBe(formatDate(new Date(iso)));
    expect(formatDate(iso)).toMatch(/04\.10\.2026/);
  });
});

describe('телефон', () => {
  it('digitsOnly оставляет только цифры', () => {
    expect(digitsOnly('+7 (701) 123-45-67')).toBe('77011234567');
  });

  // Поле в форме всегда начинается с «+7 », номер набирают после него.
  it.each([
    ['', '+7 '],
    ['+7 ', '+7'],
    ['+7 701', '+7 (701)'],
    ['8701', '+7 (701)'],
    ['+7 (701) 1', '+7 (701) 1'],
    ['77011', '+7 (701) 1'],
    ['7701123', '+7 (701) 123'],
    ['770112345', '+7 (701) 123-45'],
    ['77011234567', '+7 (701) 123-45-67'],
    ['7701123456789', '+7 (701) 123-45-67'],
  ])('formatPhoneInput(%s) → %s', (input, expected) => {
    expect(formatPhoneInput(input)).toBe(expected);
  });

  it('phoneToE164 приводит к +7XXXXXXXXXX, заменяя 8 на 7', () => {
    expect(phoneToE164('+7 (701) 123-45-67')).toBe('+77011234567');
    expect(phoneToE164('8 701 123 45 67')).toBe('+77011234567');
    expect(phoneToE164('')).toBe('');
  });

  it('isValidKzPhone принимает только полный номер', () => {
    expect(isValidKzPhone('+7 (701) 123-45-67')).toBe(true);
    expect(isValidKzPhone('8 701 123 45 67')).toBe(true);
    expect(isValidKzPhone('+7 (701) 123-45')).toBe(false);
    expect(isValidKzPhone('+1 555 123 4567')).toBe(false);
  });
});

describe('isValidEmail', () => {
  it.each([
    ['user@example.com', true],
    ['first.last@mail.softmix.kz', true],
    ['user@example', false],
    ['user example@mail.kz', false],
    ['@mail.kz', false],
    ['', false],
  ])('%s → %s', (value, expected) => {
    expect(isValidEmail(value)).toBe(expected);
  });
});
