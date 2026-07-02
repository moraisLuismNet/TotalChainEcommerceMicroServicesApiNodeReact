import axios from "axios";
import { getAuthHeaders } from "./HttpUtils";
const BASE_URL = process.env.MICROSERVICES_MESSAGES_API || "http://localhost:5009";
export class HttpWhatsAppService {
  async sendMessage(phoneNumber: string, message: string): Promise<any> {
    const response = await axios.post(`${BASE_URL}/api/messages`, { phoneNumber, message }, getAuthHeaders());
    return response.data;
  }
}
export default new HttpWhatsAppService();
