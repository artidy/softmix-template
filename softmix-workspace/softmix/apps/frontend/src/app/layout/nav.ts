import { AppRoute } from '../const';

export const MAIN_NAV = [
  { to: AppRoute.Main, label: 'Главная', end: true },
  { to: AppRoute.Shop, label: 'Каталог', end: false },
  { to: AppRoute.About, label: 'О компании', end: false },
  { to: AppRoute.Contacts, label: 'Контакты', end: false },
] as const;

export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
