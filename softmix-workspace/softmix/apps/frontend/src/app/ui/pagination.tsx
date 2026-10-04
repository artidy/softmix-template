import { ReactNode } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '../lib/cn';

const SIBLINGS = 1; // сколько страниц показывать слева и справа от текущей

function buildPageList(current: number, total: number): (number | 'dots')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, total]);
  for (let page = current - SIBLINGS; page <= current + SIBLINGS; page++) {
    if (page >= 1 && page <= total) {
      pages.add(page);
    }
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | 'dots')[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      result.push('dots');
    }
    result.push(page);
  });
  return result;
}

const ITEM =
  'grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm font-medium tabular-nums transition-colors [&_svg]:size-4';

type PaginationProps = {
  page: number;
  totalPages: number;
  className?: string;
};

/** Постраничная навигация: номер страницы хранится в адресе (?page=), остальные параметры сохраняются. */
export function Pagination({ page, totalPages, className }: PaginationProps) {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  if (totalPages <= 1) {
    return null;
  }

  const hrefFor = (target: number) => {
    const params = new URLSearchParams(searchParams);
    params.delete('limit');
    if (target <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(target));
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const scrollTop = () => window.scrollTo({ top: 0 });

  const arrow = (target: number, label: string, icon: ReactNode) =>
    target >= 1 && target <= totalPages ? (
      <Link to={hrefFor(target)} onClick={scrollTop} className={cn(ITEM, 'hover:bg-accent')} aria-label={label}>
        {icon}
      </Link>
    ) : (
      <span className={cn(ITEM, 'opacity-40')} aria-hidden="true">
        {icon}
      </span>
    );

  return (
    <nav aria-label="Страницы" className={cn('flex justify-center', className)}>
      <ul className="flex flex-wrap items-center gap-1">
        <li>{arrow(page - 1, 'Предыдущая страница', <ChevronLeft />)}</li>
        {buildPageList(page, totalPages).map((item, index) => (
          <li key={item === 'dots' ? `dots-${index}` : item}>
            {item === 'dots' ? (
              <span className={cn(ITEM, 'text-muted-foreground')}>…</span>
            ) : (
              <Link
                to={hrefFor(item)}
                onClick={scrollTop}
                aria-current={item === page ? 'page' : undefined}
                className={cn(ITEM, item === page ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent')}
              >
                {item}
              </Link>
            )}
          </li>
        ))}
        <li>{arrow(page + 1, 'Следующая страница', <ChevronRight />)}</li>
      </ul>
    </nav>
  );
}
