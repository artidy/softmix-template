import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { Cart, CartState } from '../../types/cart';

const initialState: CartState = {
  cart: null,
  isLoading: false,
};

export const cartSlice = createSlice({
  name: NameSpace.Cart,
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart | null>) => {
      state.cart = action.payload;
    },
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setCart,
  setCartLoading,
} = cartSlice.actions;
