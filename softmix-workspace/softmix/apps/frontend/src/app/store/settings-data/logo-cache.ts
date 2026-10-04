// Логотип из настроек запоминаем в браузере: при следующем открытии сайта он виден сразу,
// а не подменяет стандартный после загрузки настроек.
const LOGO_KEY = 'site-logo';

export function readCachedLogo(): string | null {
  try {
    return localStorage.getItem(LOGO_KEY);
  } catch {
    return null;
  }
}

export function rememberLogo(url: string | undefined): void {
  try {
    if (!url) {
      localStorage.removeItem(LOGO_KEY);
    } else if (localStorage.getItem(LOGO_KEY) !== url) {
      localStorage.setItem(LOGO_KEY, url);
    }
  } catch {
    // Приватный режим или переполненное хранилище — просто покажем логотип после загрузки.
  }
}
