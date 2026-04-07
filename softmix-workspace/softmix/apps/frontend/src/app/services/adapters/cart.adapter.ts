import { CartApi } from '@project-lib/shared-types';
import { Cart } from '../../types/cart';

export const cartAdapt = (cart: CartApi | null): Cart | null => {
  if (!cart) {
    return null;
  }

  return {
    id: cart.id,
    items: cart.items,
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice
  };
};
