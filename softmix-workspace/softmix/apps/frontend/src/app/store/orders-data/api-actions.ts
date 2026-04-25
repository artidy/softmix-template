import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import {
  CheckoutDto,
  OrderApi,
  OrdersPaginationApi,
  OrdersQuery,
  UpdateOrderStatusDto,
} from '@project-lib/shared-types';

import { AsyncThunkConfig } from '../../types/thunk-config';
import { Message, NameSpace } from '../../const';
import {
  setCheckoutLoading,
  setCurrentOrder,
  setOrders,
  setOrdersLoading,
  upsertOrder,
} from './orders-slice';
import { orderAdapt, ordersAdapt } from '../../services/adapters/order.adapter';
import { Order } from '../../types/order';
import { setCart } from '../cart-data/cart-slice';

export const checkoutOrder = createAsyncThunk<Order | null, CheckoutDto, AsyncThunkConfig>(
  `${NameSpace.Orders}/checkout`,
  async (dto, { dispatch, extra: { api } }) => {
    try {
      dispatch(setCheckoutLoading(true));
      const { data } = await api.post<OrderApi>('/orders/checkout', dto);
      const order = orderAdapt(data);
      dispatch(upsertOrder(order));
      dispatch(setCurrentOrder(order));
      dispatch(setCart(null));
      toast.success(`Заказ ${order.orderNumber} оформлен`);
      return order;
    } catch (e) {
      let message = Message.UnknownMessage;
      if (isAxiosError(e)) {
        message = e.response?.data?.message || message;
      }
      toast.error(message);
      return null;
    } finally {
      dispatch(setCheckoutLoading(false));
    }
  },
);

export const fetchMyOrders = createAsyncThunk<void, OrdersQuery | undefined, AsyncThunkConfig>(
  `${NameSpace.Orders}/fetchMy`,
  async (query, { dispatch, extra: { api } }) => {
    try {
      dispatch(setOrdersLoading(true));
      const { data } = await api.get<OrdersPaginationApi>('/orders/my', { params: query });
      dispatch(setOrders({ orders: ordersAdapt(data.orders), total: data.total }));
    } catch (e) {
      let message = Message.UnknownMessage;
      if (isAxiosError(e)) {
        message = e.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      dispatch(setOrdersLoading(false));
    }
  },
);

export const fetchAllOrders = createAsyncThunk<void, OrdersQuery | undefined, AsyncThunkConfig>(
  `${NameSpace.Orders}/fetchAll`,
  async (query, { dispatch, extra: { api } }) => {
    try {
      dispatch(setOrdersLoading(true));
      const { data } = await api.get<OrdersPaginationApi>('/orders', { params: query });
      dispatch(setOrders({ orders: ordersAdapt(data.orders), total: data.total }));
    } catch (e) {
      let message = Message.UnknownMessage;
      if (isAxiosError(e)) {
        message = e.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      dispatch(setOrdersLoading(false));
    }
  },
);

export const fetchOrderById = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Orders}/fetchById`,
  async (id, { dispatch, extra: { api } }) => {
    try {
      dispatch(setOrdersLoading(true));
      const { data } = await api.get<OrderApi>(`/orders/${id}`);
      dispatch(setCurrentOrder(orderAdapt(data)));
    } catch (e) {
      let message = Message.UnknownMessage;
      if (isAxiosError(e)) {
        message = e.response?.data?.message || message;
      }
      toast.error(message);
      dispatch(setCurrentOrder(null));
    } finally {
      dispatch(setOrdersLoading(false));
    }
  },
);

export const updateOrderStatus = createAsyncThunk<
  void,
  { id: string; dto: UpdateOrderStatusDto },
  AsyncThunkConfig
>(
  `${NameSpace.Orders}/updateStatus`,
  async ({ id, dto }, { dispatch, extra: { api } }) => {
    try {
      const { data } = await api.patch<OrderApi>(`/orders/${id}/status`, dto);
      dispatch(upsertOrder(orderAdapt(data)));
      toast.success('Статус заказа обновлён');
    } catch (e) {
      let message = Message.UnknownMessage;
      if (isAxiosError(e)) {
        message = e.response?.data?.message || message;
      }
      toast.error(message);
    }
  },
);
