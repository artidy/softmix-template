import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { AddToCartDto, CartApi, UpdateCartItemDto } from '@project-lib/shared-types';

import { AsyncThunkConfig } from '../../types/thunk-config';
import { Message, NameSpace } from '../../const';
import { setCart, setCartLoading } from './cart-slice';
import { cartAdapt } from '../../services/adapters/cart.adapter';

export const getCart = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Cart}/getCart`,
  async (_arg, { dispatch, extra: { api } }) => {
    try {
      dispatch(setCartLoading(true));
      const { data } = await api.get<CartApi>('/cart');
      dispatch(setCart(cartAdapt(data)));
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message || message;
      }

      toast.error(message);
      dispatch(setCart(null));
    } finally {
      dispatch(setCartLoading(false));
    }
  }
);

export const addToCart = createAsyncThunk<void, AddToCartDto, AsyncThunkConfig>(
  `${NameSpace.Cart}/addToCart`,
  async (item, { dispatch, extra: { api } }) => {
    try {
      const { data } = await api.post<CartApi>('/cart/items', item);
      dispatch(setCart(cartAdapt(data)));
      toast.success('Товар добавлен в корзину');
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message || message;
      }

      toast.error(message);
    }
  }
);

export const updateCartItem = createAsyncThunk<void, { productId: string; dto: UpdateCartItemDto }, AsyncThunkConfig>(
  `${NameSpace.Cart}/updateCartItem`,
  async ({ productId, dto }, { dispatch, extra: { api } }) => {
    try {
      const { data } = await api.patch<CartApi>(`/cart/items/${productId}`, dto);
      dispatch(setCart(cartAdapt(data)));
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message || message;
      }

      toast.error(message);
    }
  }
);

export const removeFromCart = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Cart}/removeFromCart`,
  async (productId, { dispatch, extra: { api } }) => {
    try {
      const { data } = await api.delete<CartApi>(`/cart/items/${productId}`);
      dispatch(setCart(cartAdapt(data)));
      toast.success('Товар удален из корзины');
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message || message;
      }

      toast.error(message);
    }
  }
);

export const clearCart = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Cart}/clearCart`,
  async (_arg, { dispatch, extra: { api } }) => {
    try {
      const { data } = await api.delete<CartApi>('/cart');
      dispatch(setCart(cartAdapt(data)));
      toast.success('Корзина очищена');
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message || message;
      }

      toast.error(message);
    }
  }
);
