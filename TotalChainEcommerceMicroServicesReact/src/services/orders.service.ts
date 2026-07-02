import fetchAPI from "../utils/fetch-api";
import { extractData, extractItem } from "../utils/api-mapper";
import type { IOrder } from "../interfaces/ecommerce.interfaces";

export const ordersService = {
  getAll: async (): Promise<IOrder[]> => {
    const response = await fetchAPI.get<unknown>("orders");
    return extractData<IOrder>(response);
  },

  getByUserEmail: async (email: string): Promise<IOrder[]> => {
    const response = await fetchAPI.get<unknown>(`orders/${encodeURIComponent(email)}`);
    return extractData<IOrder>(response);
  },

  getById: async (id: number): Promise<IOrder> => {
    const response = await fetchAPI.get<unknown>(`orders/${id}`);
    return extractItem<IOrder>(response);
  },

  createOrderFromCart: async (email: string): Promise<IOrder> => {
    const response = await fetchAPI.post<unknown>(`orders/from-cart/${encodeURIComponent(email)}`);
    return extractItem<IOrder>(response);
  },

  cancelOrder: async (id: number): Promise<void> => {
    await fetchAPI.post(`orders/cancel/${id}`);
  },

  cancelOrderForUser: async (email: string, orderId: number): Promise<void> => {
    await fetchAPI.post(`orders/cancel/${encodeURIComponent(email)}/${orderId}`);
  },
};
