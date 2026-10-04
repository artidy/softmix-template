import { ComponentType, SVGProps } from 'react';
import { Link } from 'react-router';
import { Mail, MapPin, Phone } from 'lucide-react';

import { AppRoute } from '../const';
import { useAppSelector } from '../hooks';
import { getSettings } from '../store/settings-data/selectors';
import { Container } from '../ui/layout';
import { Logo } from '../ui/logo';
import { FacebookIcon, InstagramIcon, PinterestIcon, XIcon } from '../ui/social-icons';
import { phoneHref } from './nav';

const SHOP_LINKS = [
  { to: AppRoute.Shop, label: 'Каталог товаров' },
  { to: AppRoute.Cart, label: 'Корзина' },
  { to: AppRoute.Checkout, label: 'Оформление заказа' },
];

const ACCOUNT_LINKS = [
  { to: AppRoute.Profile, label: 'Личный кабинет' },
  { to: AppRoute.Orders, label: 'Мои заказы' },
  { to: AppRoute.Register, label: 'Регистрация' },
];

const COMPANY_LINKS = [
  { to: AppRoute.About, label: 'О компании' },
  { to: AppRoute.Contacts, label: 'Контакты' },
];

function FooterColumn({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-4 grid gap-2.5 text-sm">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const settings = useAppSelector(getSettings);
  const copyright = settings?.copyright || 'Soft Mix';
  // Год добавляем, только если его нет в тексте из настроек («Soft Mix 2026»).
  const copyrightLine = /\d{4}/.test(copyright) ? `© ${copyright}` : `© ${new Date().getFullYear()} ${copyright}`;

  const socials: { href: string; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
    { href: settings?.socialInstagram ?? '', label: 'Instagram', Icon: InstagramIcon },
    { href: settings?.socialFacebook ?? '', label: 'Facebook', Icon: FacebookIcon },
    { href: settings?.socialTwitter ?? '', label: 'X (Twitter)', Icon: XIcon },
    { href: settings?.socialPinterest ?? '', label: 'Pinterest', Icon: PinterestIcon },
  ].filter((social) => social.href);

  return (
    <footer className="border-t bg-muted/50">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.4fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to={AppRoute.Main} aria-label="Soft Mix — на главную" className="inline-block rounded-lg">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {settings?.companyDescription ||
              'Компьютерная техника, серверное и сетевое оборудование и программное обеспечение для бизнеса.'}
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-lg border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <FooterColumn title="Магазин" links={SHOP_LINKS} />
        <FooterColumn title="Покупателям" links={ACCOUNT_LINKS} />
        <FooterColumn title="Компания" links={COMPANY_LINKS} />

        <div>
          <h3 className="text-sm font-semibold">Контакты</h3>
          <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
            {settings?.phone && (
              <li>
                <a href={phoneHref(settings.phone)} className="inline-flex items-center gap-2.5 hover:text-foreground">
                  <Phone className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  {settings.phone}
                </a>
              </li>
            )}
            {settings?.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2.5 break-all hover:text-foreground">
                  <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.address && (
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{settings.address}</span>
              </li>
            )}
          </ul>
        </div>
      </Container>

      <div className="border-t">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>{copyrightLine}</p>
          <p>Цены указаны в тенге (₸)</p>
        </Container>
      </div>
    </footer>
  );
}
