import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

import { Category } from '../../types/category';
import { cn } from '../../lib/cn';
import { categoryLink, getDirections } from '../../lib/catalog';
import { buttonVariants } from '../../ui/button';
import { Container } from '../../ui/layout';

type PromoCardProps = {
  eyebrow: string;
  title: string;
  text: string;
  to: string;
  cta: string;
  image: string;
  tone: 'primary' | 'highlight';
};

function PromoCard({ eyebrow, title, text, to, cta, image, tone }: PromoCardProps) {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-3xl border bg-card shadow-card sm:flex-row">
      <div
        className={cn(
          'pointer-events-none absolute -left-24 -top-24 size-72 rounded-full blur-3xl',
          tone === 'primary' ? 'bg-primary/15' : 'bg-highlight/15',
        )}
        aria-hidden="true"
      />
      <div className="relative flex flex-1 flex-col justify-center gap-3 p-7 sm:p-8">
        <p className={cn('text-xs font-semibold uppercase tracking-[0.14em]', tone === 'primary' ? 'text-primary' : 'text-highlight')}>
          {eyebrow}
        </p>
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
        <Link to={to} className={buttonVariants({ variant: 'outline', className: 'mt-3 self-start' })}>
          {cta}
          <ArrowRight />
        </Link>
      </div>
      <div className="relative flex items-center justify-center p-6 pt-0 sm:w-[46%] sm:pl-0 sm:pt-6">
        <div className="w-full overflow-hidden rounded-2xl bg-white p-3">
          <img src={image} alt="" loading="lazy" decoding="async" className="aspect-[16/10] w-full object-contain" />
        </div>
      </div>
    </article>
  );
}

export function Promo({ categories }: { categories: Category[] }) {
  const directions = getDirections(categories);
  const softwareId = directions.find((category) => /программ/i.test(category.title))?.id;
  const serversId = directions.find((category) => /сервер/i.test(category.title))?.id;

  return (
    <section className="py-6 sm:py-10">
      <Container className="grid gap-4 lg:grid-cols-2">
        <PromoCard
          eyebrow="Программное обеспечение"
          title="Бизнес-аналитика в 1С"
          text="Статистика продаж и прибыльность по заказам, товарам и направлениям деятельности."
          to={categoryLink(softwareId)}
          cta="Смотреть ПО"
          image="/assets/img/slider/1c_slide.png"
          tone="highlight"
        />
        <PromoCard
          eyebrow="Серверное оборудование"
          title="Dell EMC PowerEdge R250"
          text="Стоечный сервер с направляющими ReadyRails. Поддержка Dell ProSupport Plus для критически важных систем."
          to={categoryLink(serversId)}
          cta="Серверы и СХД"
          image="/assets/img/slider/dell_slide.jpg"
          tone="primary"
        />
      </Container>
    </section>
  );
}
