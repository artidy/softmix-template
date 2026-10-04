import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { Mail, MapPin, Menu, Phone, Search, ShoppingCart } from 'lucide-react';

import { AppRoute } from '../const';
import { cn } from '../lib/cn';
import { useAppSelector } from '../hooks';
import { getCartTotalItems } from '../store/cart-data/selectors';
import { getSettings } from '../store/settings-data/selectors';
import { Button } from '../ui/button';
import { Container } from '../ui/layout';
import { Logo } from '../ui/logo';
import { ThemeToggle } from '../ui/theme-toggle';
import { CartSheet } from './cart-sheet';
import { MobileMenu } from './mobile-menu';
import { MAIN_NAV, phoneHref } from './nav';
import { SearchForm } from './search-form';
import { UserMenu } from './user-menu';

function TopBar() {
  const settings = useAppSelector(getSettings);

  if (!settings?.phone && !settings?.email && !settings?.address) {
    return null;
  }

  return (
    <div className="hidden border-b bg-muted/60 text-[13px] text-muted-foreground md:block">
      <Container className="flex h-9 items-center gap-5">
        {settings?.phone && (
          <a href={phoneHref(settings.phone)} className="inline-flex items-center gap-1.5 hover:text-foreground">
            <Phone className="size-3.5" aria-hidden="true" />
            {settings.phone}
          </a>
        )}
        {settings?.email && (
          <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
            <Mail className="size-3.5" aria-hidden="true" />
            {settings.email}
          </a>
        )}
        {settings?.address && (
          <span className="hidden min-w-0 items-center gap-1.5 lg:inline-flex">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{settings.address}</span>
          </span>
        )}
      </Container>
    </div>
  );
}

export function SiteHeader() {
  const cartCount = useAppSelector(getCartTotalItems);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menu, setMenu] = useState<{ open: boolean; focusSearch: boolean }>({ open: false, focusSearch: false });

  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <Container className="flex h-16 items-center gap-3 lg:gap-5 xl:gap-8">
          <Link to={AppRoute.Main} className="shrink-0 rounded-lg" aria-label="Soft Mix — на главную">
            <Logo className="h-11" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Основное меню">
            {MAIN_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                    isActive && 'text-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            <SearchForm className="hidden w-56 md:block lg:w-48 xl:w-72" />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenu({ open: true, focusSearch: true })}
              aria-label="Поиск"
            >
              <Search />
            </Button>
            <ThemeToggle className="hidden sm:inline-flex" />
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
              aria-label={cartCount ? `Корзина, товаров: ${cartCount}` : 'Корзина'}
            >
              <ShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-highlight px-1 text-[11px] font-semibold tabular-nums text-highlight-foreground ring-2 ring-background">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Button>
            <div className="ml-1 hidden lg:block">
              <UserMenu />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMenu({ open: true, focusSearch: false })}
              aria-label="Открыть меню"
            >
              <Menu />
            </Button>
          </div>
        </Container>
      </header>

      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
      <MobileMenu
        open={menu.open}
        focusSearch={menu.focusSearch}
        onOpenChange={(open) => setMenu((current) => ({ ...current, open }))}
      />
    </>
  );
}
