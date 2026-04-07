import { CartApi, CartItem } from '@project-lib/shared-types';

export type Cart = {
  id: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
};

export type CartState = {
  cart: Cart | null;
  isLoading: boolean;
};

export { CartItem, CartApi };
