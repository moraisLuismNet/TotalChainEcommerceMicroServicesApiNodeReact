import { axios, getAuthHeaders } from "./HttpUtils";

const kardexApi = process.env.MICROSERVICES_KARDEX_API || "http://localhost:5006";

export class HttpKardexService {
  static async recordMovement(productId: string, movementType: string, quantity: number, stockBefore: number, stockAfter: number): Promise<void> {
    try {
      const endpoint = movementType === "Exit" ? "/api/kardex/exit" : "/api/kardex/entry";
      const headers = { ...getAuthHeaders().headers, 'X-Kardex-Source': 'products-ms' };
      await axios.post(`${kardexApi}${endpoint}`, { ProductId: productId, Quantity: quantity, StockBefore: stockBefore, StockAfter: stockAfter }, { headers });
    } catch (error: any) {
      console.error(`[HttpKardexService] Failed to record movement: ${error.message}`);
    }
  }
}
