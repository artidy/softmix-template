import { Gift, RotateCcw, ShieldCheck } from 'lucide-react';

import { Container } from '../../ui/layout';

const BENEFITS = [
  { Icon: RotateCcw, title: 'Возврат 14 дней', text: 'Гарантия возврата товара' },
  { Icon: ShieldCheck, title: 'Безопасная оплата', text: 'Популярные способы оплаты' },
  { Icon: Gift, title: 'Скидки и подарки', text: 'За заказ и оплату на сайте' },
];

export function Benefits() {
  return (
    <section className="py-10" aria-label="Преимущества">
      <Container>
        <ul className="grid gap-3 sm:grid-cols-3">
          {BENEFITS.map(({ Icon, title, text }) => (
            <li key={title} className="flex items-center gap-4 rounded-2xl border bg-card p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold">{title}</span>
                <span className="text-sm text-muted-foreground">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
