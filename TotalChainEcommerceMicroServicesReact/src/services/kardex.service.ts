import fetchAPI from "../utils/fetch-api";
import { extractData, extractItem } from "../utils/api-mapper";
import type { IKardexMovement } from "../interfaces/ecommerce.interfaces";

export const kardexService = {
  getAll: async (): Promise<IKardexMovement[]> => {
    const response = await fetchAPI.get<unknown>("kardex");
    return extractData<IKardexMovement>(response);
  },

  getByProductId: async (productId: string): Promise<IKardexMovement[]> => {
    const response = await fetchAPI.get<unknown>(`kardex/product/${productId}`);
    return extractData<IKardexMovement>(response);
  },

  registerEntry: async (productId: string, quantity: number): Promise<IKardexMovement> => {
    const response = await fetchAPI.post<unknown>("kardex/entry", { ProductId: productId, Quantity: quantity });
    return extractItem<IKardexMovement>(response);
  },

  registerExit: async (productId: string, quantity: number): Promise<IKardexMovement> => {
    const response = await fetchAPI.post<unknown>("kardex/exit", { ProductId: productId, Quantity: quantity });
    return extractItem<IKardexMovement>(response);
  },
};
