import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NameSpace } from '../../const';
import { Order, OrdersState } from '../../types/order';

const initialState: OrdersState = {
  orders: [],
  total: 0,
  current: null,
  isLoading: false,
  isCheckoutLoading: false,
};

export const ordersSlice = createSlice({
  name: NameSpace.Orders,
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<{ orders: Order[]; total: number }>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.current = action.payload;
    },
    setOrdersLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCheckoutLoading: (state, action: PayloadAction<boolean>) => {
      state.isCheckoutLoading = action.payload;
    },
    upsertOrder: (state, action: PayloadAction<Order>) => {
      const idx = state.orders.findIndex((o) => o.id === action.payload.id);
      if (idx >= 0) {
        state.orders[idx] = action.payload;
      } else {
        state.orders.unshift(action.payload);
      }
      if (state.current?.id === action.payload.id) {
        state.current = action.payload;
      }
    },
  },
});

export const {
  setOrders,
  setCurrentOrder,
  setOrdersLoading,
  setCheckoutLoading,
  upsertOrder,
} = ordersSlice.actions;
