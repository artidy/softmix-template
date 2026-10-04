import {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  Ref,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  useState,
} from 'react';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';

import { cn } from '../lib/cn';

const CONTROL =
  'w-full rounded-lg border border-input bg-background text-sm text-foreground shadow-xs ' +
  'transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 ' +
  'focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/20 ' +
  'disabled:cursor-not-allowed disabled:opacity-60 ' +
  'aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/20';

type InputProps = InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> };

export function Input({ className, type = 'text', ...props }: InputProps) {
  return <input type={type} className={cn(CONTROL, 'h-10 px-3 py-2', className)} {...props} />;
}

/** Поле пароля с кнопкой «показать/скрыть» — меньше ошибок при вводе с телефона. */
export function PasswordInput({ className, ...props }: Omit<InputProps, 'type'>) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input type={isVisible ? 'text' : 'password'} className={cn('pr-10', className)} {...props} />
      <button
        type="button"
        onClick={() => setIsVisible((value) => !value)}
        className="absolute inset-y-0 right-0 grid w-10 place-items-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={isVisible ? 'Скрыть пароль' : 'Показать пароль'}
        aria-pressed={isVisible}
      >
        {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: Ref<HTMLTextAreaElement> };

export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={cn(CONTROL, 'min-h-24 resize-y px-3 py-2 leading-relaxed', className)} {...props} />;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { ref?: Ref<HTMLSelectElement> };

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select className={cn(CONTROL, 'h-10 appearance-none py-2 pl-3 pr-9', className)} {...props}>
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: ReactNode;
  ref?: Ref<HTMLInputElement>;
};

export function Checkbox({ className, label, id, ...props }: CheckboxProps) {
  const box = (
    <input
      id={id}
      type="checkbox"
      className={cn(
        'size-4 shrink-0 cursor-pointer rounded border-input accent-primary disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  );

  if (!label) {
    return box;
  }

  return (
    <label htmlFor={id} className="inline-flex cursor-pointer select-none items-center gap-2 text-sm">
      {box}
      {label}
    </label>
  );
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('text-sm font-medium leading-none text-foreground', className)} {...props} />;
}

type FieldProps = {
  label?: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

/** Подпись, поле, подсказка и ошибка в одном блоке с одинаковыми отступами. */
export function Field({ label, htmlFor, hint, error, required, className, children }: FieldProps) {
  return (
    // content-start: если соседнее поле выше (например, с подсказкой), это поле не растягивается
    // и не съезжает вниз — подпись и ввод остаются вровень с соседями.
    <div className={cn('grid content-start gap-1.5', className)}>
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}
      {children}
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
