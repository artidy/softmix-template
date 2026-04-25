import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';

import { AsyncThunkConfig } from '../../types/thunk-config';
import { Message, NameSpace } from '../../const';

export interface InitPaymentResponse {
  redirectUrl: string;
  providerTxId: string;
  transactionId: string;
}

export const initPayment = createAsyncThunk<
  InitPaymentResponse | null,
  string,
  AsyncThunkConfig
>(`${NameSpace.Orders}/initPayment`, async (orderId, { extra: { api } }) => {
  try {
    const { data } = await api.post<InitPaymentResponse>(`/payments/init/${orderId}`);
    return data;
  } catch (e) {
    let message = Message.UnknownMessage;
    if (isAxiosError(e)) {
      message = e.response?.data?.message || message;
    }
    toast.error(message);
    return null;
  }
});
