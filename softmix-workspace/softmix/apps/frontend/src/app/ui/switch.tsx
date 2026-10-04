import { InputHTMLAttributes, ReactNode } from 'react';

import { cn } from '../lib/cn';

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: ReactNode;
};

/** Переключатель «вкл/выкл» на основе обычного чекбокса — работает с клавиатуры и в формах. */
export function Switch({ id, label, className, ...props }: SwitchProps) {
  return (
    <label htmlFor={id} className={cn('inline-flex cursor-pointer select-none items-center gap-3 text-sm', className)}>
      <span className="relative inline-flex shrink-0">
        <input id={id} type="checkbox" role="switch" className="peer sr-only" {...props} />
        <span
          className={cn(
            'h-6 w-11 rounded-full bg-input transition-colors peer-checked:bg-primary',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          )}
        />
        <span className="pointer-events-none absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
      </span>
      {label}
    </label>
  );
}
