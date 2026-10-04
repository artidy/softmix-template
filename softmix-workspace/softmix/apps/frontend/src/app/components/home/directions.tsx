import { Link } from 'react-router';
import { AppWindow, ArrowUpRight, BatteryCharging, Boxes, Cpu, LucideIcon, Printer, Server } from 'lucide-react';

import { Category } from '../../types/category';
import { AppRoute } from '../../const';
import { categoryLink, getDirections } from '../../lib/catalog';
import { pluralize } from '../../lib/format';
import { Skeleton } from '../../ui/feedback';
import { Container, SectionHeading } from '../../ui/layout';

const ICONS: [RegExp, LucideIcon][] = [
  [/компьютер|комплектующ|ноутбук|моноблок/i, Cpu],
  [/офисн|принтер|оргтехник/i, Printer],
  [/сетев|сервер|схд/i, Server],
  [/электро|ибп|питани/i, BatteryCharging],
  [/программ|софт|1с/i, AppWindow],
];

function getCategoryIcon(title: string): LucideIcon {
  return ICONS.find(([pattern]) => pattern.test(title))?.[1] ?? Boxes;
}

type DirectionsProps = {
  categories: Category[];
  loading: boolean;
};

export function Directions({ categories, loading }: DirectionsProps) {
  const directions = getDirections(categories);

  const childrenCount = new Map<string, number>();
  for (const category of categories) {
    if (category.ownerId) {
      childrenCount.set(category.ownerId, (childrenCount.get(category.ownerId) ?? 0) + 1);
    }
  }

  if (!loading && directions.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Каталог"
          title="Направления"
          description="Всё для IT-инфраструктуры компании — от рабочего места до серверной."
          action={{ to: AppRoute.Shop, label: 'Весь каталог' }}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {loading && directions.length === 0
            ? Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-40 rounded-2xl" />)
            : directions.map((category, index) => {
                const Icon = getCategoryIcon(category.title);
                const count = childrenCount.get(category.id) ?? 0;

                return (
                  <Link
                    key={category.id}
                    to={categoryLink(category.id)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="group relative flex min-h-40 animate-fade-up flex-col rounded-2xl border bg-card p-5 shadow-card transition-[translate,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated"
                  >
                    <span className="grid size-12 place-items-center rounded-xl bg-linear-to-br from-primary-soft to-highlight-soft text-primary">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="mt-auto pt-5 font-semibold leading-snug">{category.title}</span>
                    <span className="mt-1 text-sm text-muted-foreground">
                      {count > 0 ? `${count} ${pluralize(count, ['раздел', 'раздела', 'разделов'])}` : 'Смотреть товары'}
                    </span>
                    <ArrowUpRight
                      className="absolute right-4 top-4 size-5 text-muted-foreground transition-[translate,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
        </div>
      </Container>
    </section>
  );
}
