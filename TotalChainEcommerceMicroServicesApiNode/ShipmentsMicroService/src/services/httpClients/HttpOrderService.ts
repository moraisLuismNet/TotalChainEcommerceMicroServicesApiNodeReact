import axios from "axios";
import { getAuthHeaders } from "./HttpUtils";
const BASE_URL = process.env.MICROSERVICES_SHOPINGS_API || "http://localhost:5003";
export class HttpOrderService {
  async updateOrderStatus(orderId: number, status: string): Promise<any> {
    const response = await axios.put(`${BASE_URL}/api/orders/${orderId}/status`, { status }, getAuthHeaders());
    return response.data;
  }
}
export default new HttpOrderService();
