import fetchAPI from "../utils/fetch-api";
import { extractData, extractItem } from "../utils/api-mapper";
import type { ICartDetail } from "../interfaces/ecommerce.interfaces";

export const cartDetailService = {
  getByEmail: async (email: string): Promise<ICartDetail[]> => {
    const response = await fetchAPI.get<unknown>(`cart-details/${encodeURIComponent(email)}`);
    return extractData<ICartDetail>(response);
  },

  addToCart: async (email: string, productId: string, amount: number, price: number): Promise<ICartDetail> => {
    const response = await fetchAPI.post<unknown>(
      `cart-details/add/${encodeURIComponent(email)}`,
      { productId, amount, price }
    );
    return extractItem<ICartDetail>(response);
  },

  removeFromCart: async (email: string, productId: string, amount?: number): Promise<void> => {
    let endpoint = `cart-details/remove/${encodeURIComponent(email)}/${productId}`;
    if (amount !== undefined) {
      endpoint += `?amount=${amount}`;
    }
    await fetchAPI.post(endpoint);
  },

  updateAmount: async (email: string, productId: string, amount: number): Promise<ICartDetail> => {
    const response = await fetchAPI.put<unknown>(`carts/${encodeURIComponent(email)}/items`, { ProductId: productId, Amount: amount });
    return extractItem<ICartDetail>(response);
  },

  clearCart: async (_email: string): Promise<void> => {
    await fetchAPI.delete(`carts`);
  },
};
