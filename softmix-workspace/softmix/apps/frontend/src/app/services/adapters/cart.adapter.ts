import { CartApi, CartItem } from '@project-lib/shared-types';
import { Cart } from '../../types/cart';
import { DEFAULT_PRODUCT_IMG, LEGACY_PRODUCT_IMGS } from '../../const';

// Картинка сохраняется в позиции при добавлении в корзину и переходит в заказ,
// поэтому в старых данных встречаются прежние заглушки.
export const cartItemsAdapt = (items: CartItem[]): CartItem[] =>
  items.map((item) => ({
    ...item,
    imageUrl: item.imageUrl && !LEGACY_PRODUCT_IMGS.includes(item.imageUrl) ? item.imageUrl : DEFAULT_PRODUCT_IMG,
  }));

export const cartAdapt = (cart: CartApi | null): Cart | null => {
  if (!cart) {
    return null;
  }

  return {
    id: cart.id,
    items: cartItemsAdapt(cart.items),
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice
  };
};
