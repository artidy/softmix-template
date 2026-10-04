import { HTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

import { cn } from '../lib/cn';
import { formatPrice } from '../utils/format';

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props} />;
}

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: { to: string; label: string };
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, action, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-8 flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
        )}
        <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Link
          to={action.to}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover"
        >
          {action.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

type PriceProps = {
  value: number;
  previous?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const PRICE_SIZES = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl sm:text-3xl',
} as const;

/** Цена в тенге; старая цена зачёркнута, только если она выше текущей. */
export function Price({ value, previous, className, size = 'md' }: PriceProps) {
  const hasDiscount = previous !== undefined && previous > value;

  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
      <span className={cn('font-semibold tabular-nums tracking-tight', PRICE_SIZES[size])}>{formatPrice(value)}</span>
      {hasDiscount && (
        <span className="text-sm tabular-nums text-muted-foreground line-through">{formatPrice(previous)}</span>
      )}
    </div>
  );
}
