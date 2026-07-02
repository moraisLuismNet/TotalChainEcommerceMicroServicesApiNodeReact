import fetchAPI from "../utils/fetch-api";
import { extractData, extractItem } from "../utils/api-mapper";
import type { IMailMessage } from "../interfaces/ecommerce.interfaces";

export const mailsService = {
  getAll: async (): Promise<IMailMessage[]> => {
    const response = await fetchAPI.get<unknown>("mails");
    return extractData<IMailMessage>(response);
  },

  send: async (dto: {
    toEmail: string;
    subject: string;
    body: string;
    orderId?: number;
    metadata?: string;
  }): Promise<unknown> => {
    const response = await fetchAPI.post<unknown>("mails", dto);
    return extractItem<unknown>(response);
  },
};
