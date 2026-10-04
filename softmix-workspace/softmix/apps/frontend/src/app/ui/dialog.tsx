import { ComponentProps, ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '../lib/cn';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

const OVERLAY =
  'fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
} as const;

type DialogContentProps = Omit<ComponentProps<typeof DialogPrimitive.Content>, 'title'> & {
  title: ReactNode;
  description?: ReactNode;
  size?: keyof typeof SIZES;
  /** Заголовок только для экранных дикторов, без видимой шапки. */
  hideTitle?: boolean;
};

export function DialogContent({
  title,
  description,
  size = 'md',
  hideTitle = false,
  className,
  children,
  ...props
}: DialogContentProps) {
  // Без описания Radix просит явно снять aria-describedby, иначе пишет предупреждение в консоль.
  const describedBy = description ? {} : { 'aria-describedby': undefined };

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={OVERLAY} />
      <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-4">
        <DialogPrimitive.Content
          className={cn(
            'pointer-events-auto relative grid max-h-[calc(100dvh-2rem)] w-full gap-5 overflow-y-auto rounded-2xl border bg-popover p-6 text-popover-foreground shadow-elevated',
            'focus:outline-none data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out',
            SIZES[size],
            className,
          )}
          {...describedBy}
          {...props}
        >
          <div className={cn('grid gap-1.5 pr-8', hideTitle && 'sr-only')}>
            <DialogPrimitive.Title className="text-lg font-semibold leading-tight">{title}</DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="text-sm text-muted-foreground">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          {children}
          <DialogPrimitive.Close
            className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Закрыть"
          >
            <X className="size-4" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
}

type SheetContentProps = Omit<ComponentProps<typeof DialogPrimitive.Content>, 'title'> & {
  title: ReactNode;
  side?: 'left' | 'right';
  /** Заголовок только для экранных дикторов. */
  hideTitle?: boolean;
  footer?: ReactNode;
};

/** Выезжающая панель сбоку: корзина, мобильное меню, фильтры. */
export function SheetContent({
  title,
  side = 'right',
  hideTitle = false,
  footer,
  className,
  children,
  ...props
}: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={OVERLAY} />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-y-0 z-50 flex w-full max-w-[min(26rem,calc(100vw-2.5rem))] flex-col bg-popover text-popover-foreground shadow-elevated focus:outline-none',
          side === 'right'
            ? 'right-0 border-l data-[state=open]:animate-sheet-in-right data-[state=closed]:animate-sheet-out-right'
            : 'left-0 border-r data-[state=open]:animate-sheet-in-left data-[state=closed]:animate-sheet-out-left',
          className,
        )}
        aria-describedby={undefined}
        {...props}
      >
        <div className={cn('flex h-16 shrink-0 items-center justify-between border-b px-5', hideTitle && 'sr-only')}>
          <DialogPrimitive.Title className="text-base font-semibold">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Close
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Закрыть"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="shrink-0 border-t p-5">{footer}</div>}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
