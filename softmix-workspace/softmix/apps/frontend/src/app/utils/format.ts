export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return `${Math.round(value).toLocaleString('ru-RU')} ₸`;
}

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const PHONE_DIGITS = 11;

export function digitsOnly(value: string): string {
  return value.replace(/\D+/g, '');
}

export function formatPhoneInput(value: string): string {
  let digits = digitsOnly(value);
  if (digits.length > 0 && digits[0] === '8') {
    digits = '7' + digits.slice(1);
  }
  if (digits.length === 0) return '+7 ';
  if (digits[0] !== '7') {
    digits = '7' + digits;
  }
  digits = digits.slice(0, PHONE_DIGITS);

  const parts = ['+7'];
  if (digits.length > 1) parts.push(' (' + digits.slice(1, 4));
  if (digits.length >= 4) parts[parts.length - 1] += ')';
  if (digits.length >= 5) parts.push(' ' + digits.slice(4, 7));
  if (digits.length >= 8) parts.push('-' + digits.slice(7, 9));
  if (digits.length >= 10) parts.push('-' + digits.slice(9, 11));

  return parts.join('');
}

export function phoneToE164(value: string): string {
  const digits = digitsOnly(value);
  if (digits.length === 0) return '';
  const normalized = digits[0] === '8' ? '7' + digits.slice(1) : digits;
  return `+${normalized}`;
}

export function isValidKzPhone(value: string): boolean {
  return /^\+7\d{10}$/.test(phoneToE164(value));
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
