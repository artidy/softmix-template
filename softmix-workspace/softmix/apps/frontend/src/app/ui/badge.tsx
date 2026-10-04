import { HTMLAttributes } from 'react';

import { cn } from '../lib/cn';

export type BadgeVariant = 'primary' | 'highlight' | 'neutral' | 'success' | 'warning' | 'destructive' | 'outline' | 'solid';

const VARIANTS: Record<BadgeVariant, string> = {
  primary: 'bg-primary-soft text-primary',
  highlight: 'bg-highlight-soft text-highlight',
  neutral: 'bg-secondary text-secondary-foreground',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  destructive: 'bg-destructive/10 text-destructive',
  outline: 'border border-border text-muted-foreground',
  solid: 'bg-highlight text-highlight-foreground',
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant };

export function Badge({ variant = 'primary', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium [&_svg]:size-3.5',
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
