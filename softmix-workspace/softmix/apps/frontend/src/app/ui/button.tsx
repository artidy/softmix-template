import { ButtonHTMLAttributes, Ref } from 'react';
import { LoaderCircle } from 'lucide-react';

import { cn } from '../lib/cn';

export type ButtonVariant = 'primary' | 'highlight' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';

const BASE =
  'inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ' +
  'transition-[color,background-color,border-color,box-shadow,opacity] duration-150 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
  'disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover',
  highlight: 'bg-highlight text-highlight-foreground shadow-sm hover:opacity-90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
  outline: 'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
  ghost: 'text-foreground/80 hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
  link: 'h-auto px-0 text-primary underline-offset-4 hover:underline',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4',
  lg: 'h-12 px-6 text-base [&_svg]:size-5',
  icon: 'size-10',
  'icon-sm': 'size-8',
};

type ButtonVariantsOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/** Классы кнопки — чтобы оформить как кнопку ссылку (`<Link>`) или другой элемент. */
export function buttonVariants({ variant = 'primary', size = 'md', className }: ButtonVariantsOptions = {}): string {
  return cn(BASE, VARIANTS[variant], variant !== 'link' && SIZES[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<ButtonVariantsOptions, 'className'> & {
    loading?: boolean;
    ref?: Ref<HTMLButtonElement>;
  };

export function Button({
  variant,
  size,
  loading = false,
  className,
  type = 'button',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonVariants({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <LoaderCircle className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
