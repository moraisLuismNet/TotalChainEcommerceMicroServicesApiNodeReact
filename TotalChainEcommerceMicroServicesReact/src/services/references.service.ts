import fetchAPI from "../utils/fetch-api";
import { extractData, extractItem } from "../utils/api-mapper";
import type { IReference } from "../interfaces/ecommerce.interfaces";

const toPascalCase = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
    result[pascalKey] = value;
  }
  return result;
};

export const referencesService = {
  getAll: async (): Promise<IReference[]> => {
    const response = await fetchAPI.get<unknown>("references");
    return extractData<IReference>(response);
  },

  getBySubCategoryId: async (subCategoryId: string): Promise<IReference[]> => {
    const response = await fetchAPI.get<unknown>(`references/by-subcategory/${subCategoryId}`);
    return extractData<IReference>(response);
  },

  getById: async (id: string): Promise<IReference> => {
    const response = await fetchAPI.get<unknown>(`references/${id}`);
    return extractItem<IReference>(response);
  },

  create: async (reference: Partial<IReference>): Promise<IReference> => {
    const response = await fetchAPI.post<unknown>("references", toPascalCase(reference as Record<string, unknown>));
    return extractItem<IReference>(response);
  },

  update: async (reference: IReference): Promise<IReference> => {
    const { id, ...rest } = reference;
    const response = await fetchAPI.put<unknown>(`references/${id}`, toPascalCase(rest as Record<string, unknown>));
    return extractItem<IReference>(response);
  },

  delete: async (id: string): Promise<IReference> => {
    const response = await fetchAPI.delete<unknown>(`references/${id}`);
    return extractItem<IReference>(response);
  },
};
