import fetchAPI from "../utils/fetch-api";
import { extractData, extractItem } from "../utils/api-mapper";
import type { IProduct } from "../interfaces/ecommerce.interfaces";

export const productsService = {
  getAll: async (): Promise<IProduct[]> => {
    const response = await fetchAPI.get<unknown>("products");
    return extractData<IProduct>(response);
  },

  getById: async (id: string): Promise<IProduct> => {
    const response = await fetchAPI.get<unknown>(`products/${id}`);
    return extractItem<IProduct>(response);
  },

  getByReference: async (referenceId: string): Promise<IProduct[]> => {
    const response = await fetchAPI.get<unknown>(`products/by-reference/${referenceId}`);
    return extractData<IProduct>(response);
  },

  add: async (product: Partial<IProduct>): Promise<IProduct> => {
    const body = {
      Code: product.code,
      Name: product.name,
      Description: product.description,
      ImageProduct: product.imageProduct,
      ReferenceId: product.referenceId,
      UnitPrice: product.unitPrice,
      CostPrice: product.costPrice,
      MinStock: product.minStock,
      InitialStock: product.stock,
    };
    const response = await fetchAPI.post<unknown>("products", body);
    return extractItem<IProduct>(response);
  },

  update: async (product: IProduct): Promise<IProduct> => {
    const body = {
      Code: product.code,
      Name: product.name,
      Description: product.description,
      ImageProduct: product.imageProduct,
      ReferenceId: product.referenceId,
      UnitPrice: product.unitPrice,
      CostPrice: product.costPrice,
      MinStock: product.minStock,
      InitialStock: product.stock,
      IsActive: product.isActive,
    };
    const response = await fetchAPI.put<unknown>(`products/${product.id}`, body);
    return extractItem<IProduct>(response);
  },

  delete: async (id: string): Promise<IProduct> => {
    const response = await fetchAPI.delete<unknown>(`products/${id}`);
    const data = response as { data?: IProduct };
    return data?.data ?? (response as IProduct);
  },
};
