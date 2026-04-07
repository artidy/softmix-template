import { State } from '../../types/state';
import { Cart } from '../../types/cart';
import { NameSpace } from '../../const';

export const getCart = (state: State): Cart | null => state[NameSpace.Cart].cart;
export const getCartLoading = (state: State): boolean => state[NameSpace.Cart].isLoading;
export const getCartTotalItems = (state: State): number => state[NameSpace.Cart].cart?.totalItems || 0;
export const getCartTotalPrice = (state: State): number => state[NameSpace.Cart].cart?.totalPrice || 0;
