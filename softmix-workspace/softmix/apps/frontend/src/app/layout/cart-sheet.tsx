import { Link } from 'react-router';
import { ShoppingCart, Trash2 } from 'lucide-react';

import { AppRoute, DEFAULT_PRODUCT_IMG } from '../const';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getCart } from '../store/cart-data/selectors';
import { removeFromCart, updateCartItem } from '../store/cart-data/api-actions';
import { formatPrice } from '../utils/format';
import { buttonVariants } from '../ui/button';
import { Dialog, SheetContent } from '../ui/dialog';
import { EmptyState } from '../ui/feedback';
import { QuantityStepper } from '../ui/quantity-stepper';

type CartSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(getCart);
  const items = cart?.items ?? [];
  const close = () => onOpenChange(false);

  const changeQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      return;
    }
    dispatch(updateCartItem({ productId, dto: { quantity } }));
  };

  const footer =
    items.length > 0 ? (
      <div className="grid gap-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Итого</span>
          <span className="text-xl font-semibold tabular-nums">{formatPrice(cart?.totalPrice ?? 0)}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link to={AppRoute.Cart} onClick={close} className={buttonVariants({ variant: 'outline' })}>
            В корзину
          </Link>
          <Link to={AppRoute.Checkout} onClick={close} className={buttonVariants()}>
            Оформить
          </Link>
        </div>
      </div>
    ) : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <SheetContent title={items.length ? `Корзина · ${cart?.totalItems ?? items.length}` : 'Корзина'} footer={footer}>
        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart />}
            title="Корзина пуста"
            description="Добавьте товары из каталога — корзина сохранится и без регистрации."
            action={
              <Link to={AppRoute.Shop} onClick={close} className={buttonVariants()}>
                Перейти в каталог
              </Link>
            }
          />
        ) : (
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3 p-4">
                <Link
                  to={`${AppRoute.Shop}/${item.productId}`}
                  onClick={close}
                  className="grid size-18 shrink-0 place-items-center overflow-hidden rounded-xl border bg-white p-1.5"
                >
                  <img src={item.imageUrl || DEFAULT_PRODUCT_IMG} alt="" loading="lazy" className="size-full object-contain" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Link
                    to={`${AppRoute.Shop}/${item.productId}`}
                    onClick={close}
                    className="line-clamp-2 text-sm font-medium leading-5 hover:text-primary"
                  >
                    {item.title}
                  </Link>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(quantity) => changeQuantity(item.productId, quantity)}
                    />
                    <span className="text-sm font-semibold tabular-nums">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="self-start rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => dispatch(removeFromCart(item.productId))}
                  aria-label={`Удалить «${item.title}» из корзины`}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>
    </Dialog>
  );
}
