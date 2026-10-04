import { lazy, Suspense } from 'react';
import { Link } from 'react-router';
import { Flame, ShoppingCart } from 'lucide-react';

import { Product } from '../../types/product';
import { AppRoute, DEFAULT_PRODUCT_IMG } from '../../const';
import { cn } from '../../lib/cn';
import { getDiscountPercent } from '../../lib/catalog';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useProductImage } from '../../hooks/use-product-image';
import { getCanManageProducts } from '../../store/user-data/selectors';
import { addToCart } from '../../store/cart-data/api-actions';
import { shopApi } from '../../store/shop-api';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { FadeImage } from '../../ui/fade-image';
import { Skeleton } from '../../ui/feedback';
import { Price } from '../../ui/layout';

// Меню и форма редактирования нужны только сотрудникам — покупатели их не скачивают.
const ProductStaffMenu = lazy(() =>
  import('./product-staff-menu').then((module) => ({ default: module.ProductStaffMenu })),
);

function useAddToCart(product: Product, image: string) {
  const dispatch = useAppDispatch();

  return (quantity = 1) =>
    dispatch(
      addToCart({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity,
        imageUrl: image,
      }),
    );
}

/**
 * Карточка уже знает всё о товаре — кладём его в кэш страницы товара,
 * чтобы она открылась сразу, без загрузки и мигания заглушки.
 */
function useWarmProductPage(product: Product) {
  const dispatch = useAppDispatch();
  return () => {
    dispatch(shopApi.util.upsertQueryData('getProduct', product.id, product));
  };
}

/** Карточки в сетке появляются по очереди, с небольшим сдвигом. */
function staggerStyle(index?: number) {
  return index === undefined ? undefined : { animationDelay: `${Math.min(index, 11) * 35}ms` };
}

export function ProductBadges({ product, className }: { product: Product; className?: string }) {
  const discount = getDiscountPercent(product);

  if (discount <= 0 && !product.isHot) {
    return null;
  }

  return (
    <div className={cn('flex flex-col items-start gap-1.5', className)}>
      {discount > 0 && <Badge variant="solid">−{discount}%</Badge>}
      {product.isHot && (
        <Badge variant="highlight">
          <Flame />
          Хит
        </Badge>
      )}
    </div>
  );
}

function StaffMenu({ product, className }: { product: Product; className?: string }) {
  const canManage = useAppSelector(getCanManageProducts);

  if (!canManage) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ProductStaffMenu product={product} className={className} />
    </Suspense>
  );
}

// Растянутая ссылка: вся карточка ведёт на товар, кнопки лежат поверх неё.
const STRETCHED_LINK =
  'outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring';

type ProductCardProps = {
  product: Product;
  /** Порядковый номер в сетке — для поочерёдного появления. */
  index?: number;
  className?: string;
};

export function ProductCard({ product, index, className }: ProductCardProps) {
  const image = useProductImage(product);
  const addProduct = useAddToCart(product, image);
  const warmProductPage = useWarmProductPage(product);

  return (
    <article
      style={staggerStyle(index)}
      className={cn(
        'group relative flex animate-fade-up flex-col rounded-2xl border bg-card shadow-card transition-[translate,box-shadow,border-color] duration-200',
        'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated',
        className,
      )}
    >
      <div className="relative m-2 mb-0 aspect-square overflow-hidden rounded-xl bg-white">
        <FadeImage
          src={image}
          fallbackSrc={DEFAULT_PRODUCT_IMG}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-contain p-5 group-hover:scale-[1.04]"
        />
        <ProductBadges product={product} className="absolute left-2.5 top-2.5" />
      </div>

      <StaffMenu product={product} className="absolute right-4 top-4 z-10" />

      <div className="flex flex-1 flex-col gap-1.5 p-4 pt-3.5">
        {product.category?.title && <p className="truncate text-xs text-muted-foreground">{product.category.title}</p>}
        <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5">
          <Link to={`${AppRoute.Shop}/${product.id}`} onClick={warmProductPage} className={STRETCHED_LINK}>
            {product.title}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <Price value={product.price} previous={product.pricePrev} />
          <Button
            size="icon"
            className="relative z-10 size-9 shrink-0 rounded-xl"
            onClick={() => addProduct()}
            aria-label={`Добавить «${product.title}» в корзину`}
            title="В корзину"
          >
            <ShoppingCart />
          </Button>
        </div>
      </div>
    </article>
  );
}

/** Товар строкой — для режима «списком» в каталоге. */
export function ProductListItem({ product, index, className }: ProductCardProps) {
  const image = useProductImage(product);
  const addProduct = useAddToCart(product, image);
  const warmProductPage = useWarmProductPage(product);
  const canManage = useAppSelector(getCanManageProducts);

  return (
    <article
      style={staggerStyle(index)}
      className={cn(
        'group relative flex animate-fade-up gap-4 rounded-2xl border bg-card p-3 shadow-card transition-[box-shadow,border-color] duration-200 sm:gap-6 sm:p-4',
        'hover:border-primary/30 hover:shadow-elevated',
        className,
      )}
    >
      <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-white sm:size-36">
        <FadeImage
          src={image}
          fallbackSrc={DEFAULT_PRODUCT_IMG}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-contain p-3"
        />
        <ProductBadges product={product} className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2" />
      </div>

      <div className={cn('flex min-w-0 flex-1 flex-col gap-1.5', canManage && 'pr-9')}>
        {product.category?.title && <p className="truncate text-xs text-muted-foreground">{product.category.title}</p>}
        <h3 className="line-clamp-2 font-medium leading-snug">
          <Link to={`${AppRoute.Shop}/${product.id}`} onClick={warmProductPage} className={STRETCHED_LINK}>
            {product.title}
          </Link>
        </h3>
        {product.description && (
          <p className="line-clamp-2 hidden text-sm text-muted-foreground sm:block">{product.description}</p>
        )}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
          <Price value={product.price} previous={product.pricePrev} size="md" />
          <Button size="sm" className="relative z-10" onClick={() => addProduct()}>
            <ShoppingCart />
            В корзину
          </Button>
        </div>
      </div>

      <StaffMenu product={product} className="absolute right-3 top-3 z-10" />
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border bg-card p-2" aria-hidden="true">
      <Skeleton className="aspect-square rounded-xl" />
      <div className="grid gap-2 p-2 pt-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-3 flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="size-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function ProductListItemSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl border bg-card p-3 sm:gap-6 sm:p-4" aria-hidden="true">
      <Skeleton className="size-24 shrink-0 rounded-xl sm:size-36" />
      <div className="grid flex-1 content-start gap-2 pt-1">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
    </div>
  );
}

type ProductGridProps = {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
  view?: 'grid' | 'list';
  className?: string;
};

export function ProductGrid({ products, loading = false, skeletonCount = 8, view = 'grid', className }: ProductGridProps) {
  const showSkeleton = loading && products.length === 0;

  if (view === 'list') {
    return (
      <div className={cn('grid gap-3', className)}>
        {showSkeleton
          ? Array.from({ length: Math.min(skeletonCount, 6) }, (_, index) => <ProductListItemSkeleton key={index} />)
          : products.map((product, index) => <ProductListItem key={product.id} product={product} index={index} />)}
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4', className)}>
      {showSkeleton
        ? Array.from({ length: skeletonCount }, (_, index) => <ProductCardSkeleton key={index} />)
        : products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
    </div>
  );
}
