import axios from "axios";
import { getAuthHeaders } from "./HttpUtils";
import { IHttpOrderService } from "../interfaces/IHttpOrderService";
const BASE_URL = process.env.MICROSERVICES_SHOPINGS_API || "http://localhost:5003";
export class HttpOrderService implements IHttpOrderService {
  async createOrder(orderData: any): Promise<any> {
    const response = await axios.post(`${BASE_URL}/api/orders`, orderData, getAuthHeaders());
    return response.data;
  }
  async updateOrderStatus(orderId: number, status: string): Promise<any> {
    const response = await axios.patch(`${BASE_URL}/api/orders/${orderId}/status`, { status }, getAuthHeaders());
    return response.data;
  }
}
export default new HttpOrderService();
