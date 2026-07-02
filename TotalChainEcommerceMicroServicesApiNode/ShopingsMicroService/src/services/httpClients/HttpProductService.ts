import { axios, getAuthHeaders } from "./HttpUtils";

const productsApi = process.env.MICROSERVICES_PRODUCTS_API || "http://localhost:5002";

export class HttpProductService {
  static async validateStock(productId: string, quantity: number): Promise<boolean> {
    try {
      const response = await axios.get(`${productsApi}/api/products/${productId}`, getAuthHeaders());
      return response.status === 200;
    } catch {
      return false;
    }
  }

  static async getProduct(productId: string): Promise<any> {
    try {
      const response = await axios.get(`${productsApi}/api/products/${productId}`, getAuthHeaders());
      return response.data;
    } catch {
      return null;
    }
  }

  static async reserveStock(productId: string, quantity: number): Promise<boolean> {
    try {
      const response = await axios.post(`${productsApi}/api/stocks/reserve`, { productId, quantity }, getAuthHeaders());
      return response.status === 200;
    } catch {
      return false;
    }
  }

  static async releaseStock(productId: string, quantity: number): Promise<boolean> {
    try {
      const response = await axios.post(`${productsApi}/api/stocks/release`, { productId, quantity }, getAuthHeaders());
      return response.status === 200;
    } catch {
      return false;
    }
  }
}
