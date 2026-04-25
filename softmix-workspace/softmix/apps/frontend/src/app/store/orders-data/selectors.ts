import { State } from '../../types/state';
import { NameSpace } from '../../const';
import { Order } from '../../types/order';

export const getOrders = (state: State): Order[] => state[NameSpace.Orders].orders;
export const getOrdersTotal = (state: State): number => state[NameSpace.Orders].total;
export const getCurrentOrder = (state: State): Order | null => state[NameSpace.Orders].current;
export const getOrdersLoading = (state: State): boolean => state[NameSpace.Orders].isLoading;
export const getCheckoutLoading = (state: State): boolean => state[NameSpace.Orders].isCheckoutLoading;
