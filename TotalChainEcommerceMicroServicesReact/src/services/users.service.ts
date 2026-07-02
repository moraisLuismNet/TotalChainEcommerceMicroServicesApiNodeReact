import fetchAPI from "../utils/fetch-api";
import { extractData, extractItem } from "../utils/api-mapper";
import type { IUser } from "../interfaces/ecommerce.interfaces";

const toPascalCase = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
    result[pascalKey] = value;
  }
  return result;
};

export const usersService = {
  getAll: async (): Promise<IUser[]> => {
    const response = await fetchAPI.get<unknown>("users");
    return extractData<IUser>(response);
  },

  update: async (email: string, data: Partial<IUser>): Promise<IUser> => {
    const response = await fetchAPI.put<unknown>(`users/${encodeURIComponent(email)}`, toPascalCase(data as Record<string, unknown>));
    return extractItem<IUser>(response);
  },

  delete: async (email: string): Promise<void> => {
    await fetchAPI.delete(`users/${encodeURIComponent(email)}`);
  },
};
