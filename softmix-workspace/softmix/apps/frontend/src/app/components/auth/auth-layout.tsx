import { ReactNode } from 'react';

import { cn } from '../../lib/cn';
import { Card } from '../../ui/card';
import { Container } from '../../ui/layout';

type AuthLayoutProps = {
  icon?: ReactNode;
  tone?: 'primary' | 'success' | 'error';
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
};

const ICON_TONES = {
  primary: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  error: 'bg-destructive/10 text-destructive',
} as const;

/** Карточка по центру страницы — вход, регистрация, подтверждение почты. */
export function AuthLayout({ icon, tone = 'primary', title, description, children, footer }: AuthLayoutProps) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black_20%,transparent_75%)]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -left-32 top-0 size-[26rem] rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-[24rem] rounded-full bg-highlight/10 blur-3xl" aria-hidden="true" />

      <Container className="relative flex flex-col items-center py-12 sm:py-20">
        <Card className="w-full max-w-md p-6 shadow-elevated sm:p-8">
          {icon && (
            <div className={cn('mb-5 grid size-12 place-items-center rounded-xl [&_svg]:size-6', ICON_TONES[tone])} aria-hidden="true">
              {icon}
            </div>
          )}
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</div>}
          {children && <div className="mt-6">{children}</div>}
        </Card>
        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </Container>
    </section>
  );
}
