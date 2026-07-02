import fetchAPI from "../utils/fetch-api";
import { extractData, extractItem } from "../utils/api-mapper";
import type { ICart } from "../interfaces/ecommerce.interfaces";

export const cartsService = {
  getAll: async (): Promise<ICart[]> => {
    const response = await fetchAPI.get<unknown>("carts/all");
    return extractData<ICart>(response);
  },

  getByEmail: async (email: string): Promise<ICart> => {
    const response = await fetchAPI.get<unknown>(`carts/${encodeURIComponent(email)}`);
    return extractItem<ICart>(response);
  },

  getStatus: async (email: string): Promise<{ enabled: boolean }> => {
    return fetchAPI.get<{ enabled: boolean }>(`carts/status/${encodeURIComponent(email)}`);
  },

  enable: async (email: string): Promise<ICart> => {
    const response = await fetchAPI.patch<unknown>(`carts/${encodeURIComponent(email)}/enable`);
    return extractItem<ICart>(response);
  },

  disable: async (email: string): Promise<ICart> => {
    const response = await fetchAPI.patch<unknown>(`carts/${encodeURIComponent(email)}/disable`);
    return extractItem<ICart>(response);
  },

  checkout: async (): Promise<{ checkoutUrl: string; sessionId: string; total: number }> => {
    const response = await fetchAPI.post<unknown>("carts/checkout", {});
    return extractItem<{ checkoutUrl: string; sessionId: string; total: number }>(response);
  },
};
