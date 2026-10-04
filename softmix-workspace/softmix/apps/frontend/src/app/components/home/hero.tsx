import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

import { Product } from '../../types/product';
import { AppRoute, DEFAULT_PRODUCT_IMG } from '../../const';
import { cn } from '../../lib/cn';
import { formatNumber } from '../../lib/format';
import { getImageUrl } from '../../services/helpers';
import { useAppSelector } from '../../hooks';
import { useProductImage } from '../../hooks/use-product-image';
import { getImages } from '../../store/products-data/selectors';
import { formatPrice } from '../../utils/format';
import { buttonVariants } from '../../ui/button';
import { FadeImage } from '../../ui/fade-image';
import { Skeleton } from '../../ui/feedback';
import { Container } from '../../ui/layout';

type HeroProps = {
  products: Product[];
  loading: boolean;
  total?: number;
  directionsCount: number;
};

function Stat({ value, label }: { value?: string | number; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
        {value ?? <Skeleton className="h-8 w-16" />}
      </dd>
      <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
    </div>
  );
}

function ShowcaseTile({ product, index, className }: { product: Product; index: number; className?: string }) {
  const image = useProductImage(product);

  return (
    <Link
      to={`${AppRoute.Shop}/${product.id}`}
      style={{ animationDelay: `${120 + index * 70}ms` }}
      className={cn(
        'group flex animate-fade-up flex-col rounded-2xl border bg-card/90 p-3 shadow-elevated backdrop-blur transition-[translate,border-color] duration-200 hover:-translate-y-1 hover:border-primary/40',
        className,
      )}
    >
      <div className="aspect-square overflow-hidden rounded-xl bg-white">
        <FadeImage src={image} fallbackSrc={DEFAULT_PRODUCT_IMG} alt="" className="size-full object-contain p-4 group-hover:scale-105" />
      </div>
      <p className="mt-3 line-clamp-1 text-sm font-medium">{product.title}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-primary">{formatPrice(product.price)}</p>
    </Link>
  );
}

export function Hero({ products, loading, total, directionsCount }: HeroProps) {
  const images = useAppSelector(getImages);
  // На витрину — только товары с настоящим фото, без заглушки.
  const tiles = products
    .filter((product) => getImageUrl(images, product.id, product.imageUrl) !== DEFAULT_PRODUCT_IMG)
    .slice(0, 4);
  const showcase: (Product | undefined)[] = loading && tiles.length === 0 ? [undefined, undefined, undefined, undefined] : tiles;

  return (
    <section className="relative overflow-hidden border-b">
      <div
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,black_35%,transparent_80%)]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -left-48 -top-48 size-[36rem] rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 top-16 size-[30rem] rounded-full bg-highlight/15 blur-3xl" aria-hidden="true" />

      <Container className="relative grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-[13px] font-medium backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            IT-оборудование и ПО для бизнеса
          </p>
          <h1 className="text-4xl font-bold leading-[1.08] sm:text-5xl xl:text-[3.5rem]">
            Компьютеры, серверы и софт{' '}
            <span className="bg-linear-to-r from-primary to-highlight bg-clip-text text-transparent">для вашего бизнеса</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Рабочие места, серверное и сетевое оборудование, системы электропитания и лицензионное программное
            обеспечение — в одном каталоге.
          </p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <Link to={AppRoute.Shop} className={buttonVariants({ size: 'lg' })}>
              Перейти в каталог
              <ArrowRight />
            </Link>
            <Link to={AppRoute.Contacts} className={buttonVariants({ size: 'lg', variant: 'outline' })}>
              Связаться с нами
            </Link>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t pt-6">
            <Stat value={total !== undefined ? formatNumber(total) : undefined} label="товаров в каталоге" />
            <Stat value={directionsCount || undefined} label="направлений" />
            <Stat value="14 дней" label="на возврат товара" />
          </dl>
        </div>

        {showcase.length > 0 && (
          <div className="relative">
            <div
              className="absolute -inset-6 rounded-[2.5rem] bg-linear-to-tr from-primary/20 via-transparent to-highlight/25 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-2 gap-4">
              {showcase.map((product, index) => {
                const shift = index % 2 === 1 ? 'sm:translate-y-10' : undefined;
                return product ? (
                  <ShowcaseTile key={product.id} product={product} index={index} className={shift} />
                ) : (
                  <Skeleton key={index} className={cn('aspect-[4/5] rounded-2xl', shift)} />
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
