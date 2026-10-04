import { lazy, Suspense, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { skipToken } from '@reduxjs/toolkit/query';
import { PackageX, ShoppingCart } from 'lucide-react';

import { AppRoute, DEFAULT_PRODUCT_IMG } from '../const';
import { categoryLink } from '../lib/catalog';
import { useDocumentTitle } from '../lib/use-document-title';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useProductImage } from '../hooks/use-product-image';
import { getCanManageProducts } from '../store/user-data/selectors';
import { addToCart } from '../store/cart-data/api-actions';
import { useGetProductQuery } from '../store/shop-api';
import { Product } from '../types/product';
import { ProductBadges } from '../components/product/product-card';
import { Button, buttonVariants } from '../ui/button';
import { FadeImage } from '../ui/fade-image';
import { EmptyState, Skeleton } from '../ui/feedback';
import { Container, Price } from '../ui/layout';
import { Breadcrumbs } from '../ui/page-header';
import { QuantityStepper } from '../ui/quantity-stepper';

const ProductStaffMenu = lazy(() =>
  import('../components/product/product-staff-menu').then((module) => ({ default: module.ProductStaffMenu })),
);

function ProductDetailsSkeleton() {
  return (
    <Container className="py-6 lg:py-10" aria-busy="true">
      <Skeleton className="mb-6 h-4 w-64" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <Skeleton className="aspect-square rounded-3xl" />
        <div className="grid content-start gap-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="mt-4 h-40 rounded-2xl" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </Container>
  );
}

function ProductView({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const canManage = useAppSelector(getCanManageProducts);
  const image = useProductImage(product);
  const [quantity, setQuantity] = useState(1);
  const category = product.category?.id ? product.category : null;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity,
        imageUrl: image,
      }),
    );
  };

  return (
    // Если страница открылась после заглушки загрузки — данные мягко проявляются.
    <Container className="animate-fade-in py-6 lg:py-10">
      <Breadcrumbs
        className="mb-6"
        items={[
          { label: 'Главная', to: AppRoute.Main },
          { label: 'Каталог', to: AppRoute.Shop },
          ...(category ? [{ label: category.title, to: categoryLink(category.id) }] : []),
          { label: <span className="inline-block max-w-[16rem] truncate align-bottom sm:max-w-md">{product.title}</span> },
        ]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className="relative overflow-hidden rounded-3xl border bg-white lg:sticky lg:top-24">
            <FadeImage
              src={image}
              fallbackSrc={DEFAULT_PRODUCT_IMG}
              alt={product.title}
              className="aspect-square w-full object-contain p-8 sm:p-12"
            />
            <ProductBadges product={product} className="absolute left-4 top-4" />
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {category && (
                <Link to={categoryLink(category.id)} className="text-sm font-medium text-primary hover:underline">
                  {category.title}
                </Link>
              )}
              <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">{product.title}</h1>
            </div>
            {canManage && (
              <Suspense fallback={null}>
                <ProductStaffMenu product={product} onDeleted={() => navigate(AppRoute.Shop)} className="shrink-0" />
              </Suspense>
            )}
          </div>

          <div className="mt-6 rounded-2xl border bg-card p-5 shadow-card sm:p-6">
            <Price value={product.price} previous={product.pricePrev} size="lg" />
            <div className="mt-5 flex gap-3">
              <QuantityStepper value={quantity} onChange={setQuantity} size="lg" />
              <Button size="lg" className="min-w-0 flex-1" onClick={handleAddToCart}>
                <ShoppingCart />
                В корзину
              </Button>
            </div>
          </div>

          {product.description && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold">Описание</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{product.description}</p>
            </section>
          )}
        </div>
      </div>
    </Container>
  );
}

function ProductDetailsPage() {
  const { id } = useParams();
  const { currentData: product, isError, error } = useGetProductQuery(id ?? skipToken);

  useDocumentTitle(product?.title ?? 'Товар');

  if (isError || !id) {
    const isNotFound = !id || (error !== undefined && 'status' in error && error.status === 404);

    return (
      <Container className="py-16">
        <EmptyState
          icon={<PackageX />}
          title={isNotFound ? 'Товар не найден' : 'Не удалось загрузить товар'}
          description={
            isNotFound
              ? 'Возможно, его удалили из каталога или ссылка устарела.'
              : 'Проверьте подключение к интернету и обновите страницу.'
          }
          action={
            <Link to={AppRoute.Shop} className={buttonVariants({ variant: 'outline' })}>
              Перейти в каталог
            </Link>
          }
        />
      </Container>
    );
  }

  if (!product) {
    return <ProductDetailsSkeleton />;
  }

  return <ProductView key={product.id} product={product} />;
}

export default ProductDetailsPage;
