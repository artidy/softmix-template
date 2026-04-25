import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { AddToCartDto, CartApi, UpdateCartItemDto } from '@project-lib/shared-types';

import { AsyncThunkConfig } from '../../types/thunk-config';
import { Message, NameSpace } from '../../const';
import { setCart, setCartLoading } from './cart-slice';
import { cartAdapt } from '../../services/adapters/cart.adapter';
import {
  addItem as guestAdd,
  clearGuestCart,
  getGuestCart,
  hasGuestItems,
  removeItem as guestRemove,
  takeGuestItems,
  updateItem as guestUpdate,
} from '../../services/guest-cart';
import { getActiveToken } from '../../services/token';

const isAuthenticated = () => Boolean(getActiveToken());

export const getCart = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Cart}/getCart`,
  async (_arg, { dispatch, extra: { api } }) => {
    try {
      dispatch(setCartLoading(true));

      if (!isAuthenticated()) {
        dispatch(setCart(cartAdapt(getGuestCart())));
        return;
      }

      const { data } = await api.get<CartApi>('/cart');
      dispatch(setCart(cartAdapt(data)));
    } catch (e) {
      let message = Message.UnknownMessage;
      if (isAxiosError(e)) {
        message = e.response?.data.message || message;
      }
      toast.error(message);
      dispatch(setCart(null));
    } finally {
      dispatch(setCartLoading(false));
    }
  },
);

export const addToCart = createAsyncThunk<void, AddToCartDto, AsyncThunkConfig>(
  `${NameSpace.Cart}/addToCart`,
  async (item, { dispatch, extra: { api } }) => {
    try {
      if (!isAuthenticated()) {
        dispatch(setCart(cartAdapt(guestAdd(item))));
        toast.success('Товар добавлен в корзину');
        return;
      }

      const { data } = await api.post<CartApi>('/cart/items', item);
      dispatch(setCart(cartAdapt(data)));
      toast.success('Товар добавлен в корзину');
    } catch (e) {
      let message = Message.UnknownMessage;
      if (isAxiosError(e)) {
        message = e.response?.data.message || message;
      }
      toast.error(message);
    }
  },
);

export const updateCartItem = createAsyncThunk<
  void,
  { productId: string; dto: UpdateCartItemDto },
  AsyncThunkConfig
>(
  `${NameSpace.Cart}/updateCartItem`,
  async ({ productId, dto }, { dispatch, extra: { api } }) => {
    try {
      if (!isAuthenticated()) {
        dispatch(setCart(cartAdapt(guestUpdate(productId, dto.quantity))));
        return;
      }

      const { data } = await api.patch<CartApi>(`/cart/items/${productId}`, dto);
      dispatch(setCart(cartAdapt(data)));
    } catch (e) {
      let message = Message.UnknownMessage;
      if (isAxiosError(e)) {
        message = e.response?.data.message || message;
      }
      toast.error(message);
    }
  },
);

export const removeFromCart = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Cart}/removeFromCart`,
  async (productId, { dispatch, extra: { api } }) => {
    try {
      if (!isAuthenticated()) {
        dispatch(setCart(cartAdapt(guestRemove(productId))));
        toast.success('Товар удалён из корзины');
        return;
      }

      const { data } = await api.delete<CartApi>(`/cart/items/${productId}`);
      dispatch(setCart(cartAdapt(data)));
      toast.success('Товар удалён из корзины');
    } catch (e) {
      let message = Message.UnknownMessage;
      if (isAxiosError(e)) {
        message = e.response?.data.message || message;
      }
      toast.error(message);
    }
  },
);

export const clearCart = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Cart}/clearCart`,
  async (_arg, { dispatch, extra: { api } }) => {
    try {
      if (!isAuthenticated()) {
        clearGuestCart();
        dispatch(setCart(cartAdapt(getGuestCart())));
        toast.success('Корзина очищена');
        return;
      }

      const { data } = await api.delete<CartApi>('/cart');
      dispatch(setCart(cartAdapt(data)));
      toast.success('Корзина очищена');
    } catch (e) {
      let message = Message.UnknownMessage;
      if (isAxiosError(e)) {
        message = e.response?.data.message || message;
      }
      toast.error(message);
    }
  },
);

export const mergeGuestCart = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Cart}/mergeGuest`,
  async (_arg, { dispatch, extra: { api } }) => {
    if (!isAuthenticated() || !hasGuestItems()) {
      dispatch(getCart());
      return;
    }

    const items = takeGuestItems();
    let lastCart: CartApi | null = null;

    for (const item of items) {
      try {
        const { data } = await api.post<CartApi>('/cart/items', item);
        lastCart = data;
      } catch (e) {
        if (isAxiosError(e)) {
          // eslint-disable-next-line no-console
          console.warn('Не удалось перенести товар в корзину', item.productId, e.message);
        }
      }
    }

    if (lastCart) {
      dispatch(setCart(cartAdapt(lastCart)));
    } else {
      dispatch(getCart());
    }
  },
);
