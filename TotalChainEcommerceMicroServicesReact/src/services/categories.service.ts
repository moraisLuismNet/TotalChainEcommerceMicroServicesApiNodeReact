import fetchAPI from "../utils/fetch-api";
import { extractData, extractItem } from "../utils/api-mapper";
import type { ICategory } from "../interfaces/ecommerce.interfaces";

const toPascalCase = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
    result[pascalKey] = value;
  }
  return result;
};

export const categoriesService = {
  getAll: async (): Promise<ICategory[]> => {
    const response = await fetchAPI.get<unknown>("categories");
    return extractData<ICategory>(response);
  },

  create: async (category: Partial<ICategory>): Promise<ICategory> => {
    const response = await fetchAPI.post<unknown>("categories", toPascalCase(category as Record<string, unknown>));
    return extractItem<ICategory>(response);
  },

  update: async (category: ICategory): Promise<ICategory> => {
    const { id, ...rest } = category;
    const response = await fetchAPI.put<unknown>(`categories/${id}`, toPascalCase(rest as Record<string, unknown>));
    return extractItem<ICategory>(response);
  },

  delete: async (id: string): Promise<ICategory> => {
    const response = await fetchAPI.delete<unknown>(`categories/${id}`);
    return extractItem<ICategory>(response);
  },
};
