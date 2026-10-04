import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react';

import { AppRoute, DEFAULT_PRODUCT_IMG } from '../const';
import { formatNumber, pluralize } from '../lib/format';
import { useDocumentTitle } from '../lib/use-document-title';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getCart, getCartLoading } from '../store/cart-data/selectors';
import { clearCart, getCart as fetchCart, removeFromCart, updateCartItem } from '../store/cart-data/api-actions';
import { formatPrice } from '../utils/format';
import { Button, buttonVariants } from '../ui/button';
import { Card } from '../ui/card';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { EmptyState, PageLoader } from '../ui/feedback';
import { FadeImage } from '../ui/fade-image';
import { Container } from '../ui/layout';
import { PageHeader } from '../ui/page-header';
import { QuantityStepper } from '../ui/quantity-stepper';

function CartPage() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(getCart);
  const isLoading = useAppSelector(getCartLoading);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  useDocumentTitle('Корзина');

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const items = cart?.items ?? [];
  const totalItems = cart?.totalItems ?? 0;

  const handleQuantityChange = (productId: string, quantity: number) => {
    dispatch(updateCartItem({ productId, dto: { quantity: Math.max(1, quantity) } }));
  };

  const confirmClear = () => {
    dispatch(clearCart());
    setIsClearConfirmOpen(false);
  };

  const header = (
    <PageHeader
      title="Корзина"
      breadcrumbs={[{ label: 'Главная', to: AppRoute.Main }, { label: 'Корзина' }]}
      description={
        items.length > 0 ? `${formatNumber(totalItems)} ${pluralize(totalItems, ['товар', 'товара', 'товаров'])}` : undefined
      }
    />
  );

  if (isLoading && !cart) {
    return (
      <>
        {header}
        <PageLoader />
      </>
    );
  }

  return (
    <>
      {header}
      <Container className="py-8 lg:py-10">
        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart />}
            title="Ваша корзина пуста"
            description="Добавьте товары из каталога — мы их сохраним даже без регистрации."
            action={
              <Link to={AppRoute.Shop} className={buttonVariants()}>
                Перейти в каталог
              </Link>
            }
            className="rounded-2xl border bg-card"
          />
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
            <div>
              <Card>
                <ul className="divide-y">
                  {items.map((item) => (
                    <li key={item.productId} className="flex gap-3 p-4 sm:gap-4 sm:p-5">
                      <Link
                        to={`${AppRoute.Shop}/${item.productId}`}
                        className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border bg-white p-1.5 sm:size-24 sm:p-2"
                      >
                        <FadeImage src={item.imageUrl || DEFAULT_PRODUCT_IMG} fallbackSrc={DEFAULT_PRODUCT_IMG} alt="" loading="lazy" className="size-full object-contain" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`${AppRoute.Shop}/${item.productId}`}
                            className="line-clamp-2 font-medium leading-snug transition-colors hover:text-primary"
                          >
                            {item.title}
                          </Link>
                          <p className="mt-1 text-sm tabular-nums text-muted-foreground">{formatPrice(item.price)} за шт.</p>
                        </div>
                        {/* На узком экране сумма переносится под счётчик, а не вылезает за край. */}
                        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:flex-nowrap sm:justify-end">
                          <QuantityStepper
                            value={item.quantity}
                            onChange={(quantity) => handleQuantityChange(item.productId, quantity)}
                          />
                          <span className="text-right font-semibold tabular-nums sm:min-w-28">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="self-start rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive sm:self-center"
                        onClick={() => dispatch(removeFromCart(item.productId))}
                        aria-label={`Удалить «${item.title}» из корзины`}
                        title="Удалить"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <Link to={AppRoute.Shop} className={buttonVariants({ variant: 'ghost' })}>
                  <ArrowLeft />
                  Продолжить покупки
                </Link>
                <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setIsClearConfirmOpen(true)}>
                  <Trash2 />
                  Очистить корзину
                </Button>
              </div>
            </div>

            <Card className="p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold">Итого</h2>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Товаров</dt>
                  <dd className="tabular-nums">{formatNumber(totalItems)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t pt-3">
                  <dt className="text-muted-foreground">Сумма</dt>
                  <dd className="text-2xl font-semibold tabular-nums">{formatPrice(cart?.totalPrice ?? 0)}</dd>
                </div>
              </dl>
              <Link to={AppRoute.Checkout} className={buttonVariants({ size: 'lg', className: 'mt-6 w-full' })}>
                Оформить заказ
              </Link>
            </Card>
          </div>
        )}
      </Container>

      <ConfirmDialog
        open={isClearConfirmOpen}
        onOpenChange={setIsClearConfirmOpen}
        title="Очистить корзину?"
        description="Удалить из корзины все товары?"
        confirmLabel="Очистить"
        onConfirm={confirmClear}
      />
    </>
  );
}

export default CartPage;
