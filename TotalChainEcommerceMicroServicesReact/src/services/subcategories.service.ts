import fetchAPI from "../utils/fetch-api";
import { extractData, extractItem } from "../utils/api-mapper";
import type { ISubCategory } from "../interfaces/ecommerce.interfaces";

const toPascalCase = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
    result[pascalKey] = value;
  }
  return result;
};

export const subcategoriesService = {
  getAll: async (): Promise<ISubCategory[]> => {
    const response = await fetchAPI.get<unknown>("subcategories");
    return extractData<ISubCategory>(response);
  },

  getByCategoryId: async (categoryId: string): Promise<ISubCategory[]> => {
    const response = await fetchAPI.get<unknown>(`subcategories/by-category/${categoryId}`);
    return extractData<ISubCategory>(response);
  },

  getById: async (id: string): Promise<ISubCategory> => {
    const response = await fetchAPI.get<unknown>(`subcategories/${id}`);
    return extractItem<ISubCategory>(response);
  },

  add: async (subCategory: Partial<ISubCategory>): Promise<ISubCategory> => {
    const response = await fetchAPI.post<unknown>("subcategories", toPascalCase(subCategory as Record<string, unknown>));
    return extractItem<ISubCategory>(response);
  },

  update: async (subCategory: ISubCategory): Promise<ISubCategory> => {
    const { id, ...rest } = subCategory;
    const response = await fetchAPI.put<unknown>(`subcategories/${id}`, toPascalCase(rest as Record<string, unknown>));
    return extractItem<ISubCategory>(response);
  },

  delete: async (id: string): Promise<ISubCategory> => {
    const response = await fetchAPI.delete<unknown>(`subcategories/${id}`);
    return extractItem<ISubCategory>(response);
  },
};
