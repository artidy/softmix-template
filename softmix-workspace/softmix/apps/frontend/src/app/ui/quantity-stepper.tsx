import { Minus, Plus } from 'lucide-react';

import { cn } from '../lib/cn';

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'lg';
  disabled?: boolean;
  className?: string;
};

const SIZES = {
  sm: { button: 'size-8', value: 'w-7 text-sm', icon: 'size-3.5' },
  lg: { button: 'size-12', value: 'w-10 text-base', icon: 'size-4' },
} as const;

/** Количество товара: «−», число, «+». */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  size = 'sm',
  disabled = false,
  className,
}: QuantityStepperProps) {
  const styles = SIZES[size];
  const button = cn(
    'grid place-items-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40',
    styles.button,
  );

  return (
    <div className={cn('inline-flex items-center rounded-lg border bg-background', className)}>
      <button
        type="button"
        className={button}
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label="Уменьшить количество"
      >
        <Minus className={styles.icon} />
      </button>
      <span className={cn('text-center font-medium tabular-nums', styles.value)} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={button}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Увеличить количество"
      >
        <Plus className={styles.icon} />
      </button>
    </div>
  );
}
