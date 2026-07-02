import fetchAPI from "../utils/fetch-api";
import { extractData, extractItem } from "../utils/api-mapper";
import type { IMessage } from "../interfaces/ecommerce.interfaces";

export const messagesService = {
  getAll: async (): Promise<IMessage[]> => {
    const response = await fetchAPI.get<unknown>("messages");
    const data = extractData<any>(response);
    return data.map((item: any) => ({
      ...item,
      id: item.notificationQueueId || item.id,
    }));
  },

  send: async (dto: { orderId: number; phoneNumber: string; customerName: string }): Promise<unknown> => {
    const response = await fetchAPI.post<unknown>("messages", dto);
    return extractItem<unknown>(response);
  },

  linkDevice: async (): Promise<any> => {
    const response = await fetchAPI.post<unknown>("messages/link");
    return extractItem<any>(response);
  },

  getSessionStatus: async (): Promise<any> => {
    const response = await fetchAPI.get<unknown>("messages/session-status");
    return extractItem<any>(response);
  },

  retryFailed: async (): Promise<number> => {
    const response = await fetchAPI.post<unknown>("messages/retry-failed");
    const data = extractItem<any>(response);
    return data?.resetCount || 0;
  },
};
