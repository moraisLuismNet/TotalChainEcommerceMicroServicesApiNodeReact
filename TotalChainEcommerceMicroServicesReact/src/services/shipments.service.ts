import fetchAPI from "../utils/fetch-api";
import { extractData, extractItem } from "../utils/api-mapper";
import type { IShipment } from "../interfaces/ecommerce.interfaces";

export const shipmentsService = {
  getAll: async (): Promise<IShipment[]> => {
    const response = await fetchAPI.get<unknown>("shipments");
    return extractData<IShipment>(response);
  },

  getMy: async (): Promise<IShipment[]> => {
    const response = await fetchAPI.get<unknown>("shipments/my");
    return extractData<IShipment>(response);
  },

  getByOrderId: async (orderId: number): Promise<IShipment | null> => {
    const response = await fetchAPI.get<unknown>(`shipments/order/${orderId}`);
    const result = extractItem<IShipment>(response);
    return result && Object.keys(result).length > 0 ? result : null;
  },

  getByTrackingNumber: async (trackingNumber: string): Promise<IShipment | null> => {
    const response = await fetchAPI.get<unknown>(`shipments/tracking/${trackingNumber}`);
    const result = extractItem<IShipment>(response);
    return result && Object.keys(result).length > 0 ? result : null;
  },

  updateStatus: async (id: number, status: string): Promise<IShipment> => {
    const response = await fetchAPI.patch<unknown>(`shipments/${id}/status`, { status });
    return extractItem<IShipment>(response);
  },
};
