import { ReactNode } from 'react';

import { cn } from '../../lib/cn';
import { Card } from '../../ui/card';
import { Container } from '../../ui/layout';

type OrderResultProps = {
  tone: 'success' | 'error';
  icon: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  actions: ReactNode;
};

/** Итог оформления или оплаты заказа: значок, заголовок, детали и дальнейшие действия. */
export function OrderResult({ tone, icon, title, lead, children, actions }: OrderResultProps) {
  return (
    <Container className="py-12 sm:py-16">
      <Card className="mx-auto max-w-2xl p-6 text-center sm:p-10">
        <div
          className={cn(
            'mx-auto grid size-16 place-items-center rounded-full [&_svg]:size-8',
            tone === 'success' ? 'bg-success-soft text-success' : 'bg-destructive/10 text-destructive',
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
        <h1 className="mt-6 text-2xl font-bold sm:text-3xl">{title}</h1>
        {lead && <p className="mt-3 text-lg text-muted-foreground">{lead}</p>}
        {children && <div className="mt-6 text-left">{children}</div>}
        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">{actions}</div>
      </Card>
    </Container>
  );
}

type FactsProps = {
  items: { label: string; value: ReactNode }[];
};

/** Короткая сводка по заказу: номер, статус, сумма. */
export function OrderFacts({ items }: FactsProps) {
  return (
    <dl className="divide-y rounded-xl border bg-background/60 text-sm">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-4 px-4 py-3">
          <dt className="text-muted-foreground">{item.label}</dt>
          <dd className="text-right font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
