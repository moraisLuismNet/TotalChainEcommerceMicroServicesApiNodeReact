import axios from "axios";
import { getAuthHeaders } from "./HttpUtils";

const BASE_URL = process.env.MICROSERVICES_SHIPMENTS_API || "http://localhost:5005";

export class HttpShipmentService {
  async createShipment(shipmentData: any): Promise<any> {
    try {
      const response = await axios.post(`${BASE_URL}/api/shipments`, shipmentData, getAuthHeaders());
      return response.data;
    } catch (error: any) {
      console.error(`[HttpShipmentService] failed: ${error.message}`);
      return null;
    }
  }
}

export default new HttpShipmentService();
