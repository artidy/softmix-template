import { ReactNode } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';

import { cn } from '../lib/cn';
import { Container } from './layout';

export type Crumb = {
  label: ReactNode;
  to?: string;
};

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Навигационная цепочка" className={cn('text-sm text-muted-foreground', className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex min-w-0 items-center gap-1.5">
              {item.to && !isLast ? (
                <Link to={item.to} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className={cn('truncate', isLast && 'text-foreground')}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  className?: string;
};

/** Шапка внутренней страницы: цепочка ссылок, заголовок, пояснение и действия справа. */
export function PageHeader({ title, description, breadcrumbs, actions, className }: PageHeaderProps) {
  return (
    <section className={cn('relative overflow-hidden border-b', className)}>
      <div
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_120%_at_30%_0%,black_10%,transparent_70%)]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -left-40 -top-48 size-[28rem] rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 -top-40 size-[22rem] rounded-full bg-highlight/10 blur-3xl" aria-hidden="true" />
      <Container className="relative py-8 sm:py-10">
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} className="mb-4" />}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
            {description && <div className="mt-2 max-w-2xl text-muted-foreground">{description}</div>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </Container>
    </section>
  );
}
