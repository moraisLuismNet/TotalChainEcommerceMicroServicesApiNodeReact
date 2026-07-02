import { axios, getAuthHeaders } from "./HttpUtils";

const messagesApi = process.env.MICROSERVICES_MESSAGES_API || "http://localhost:5009";

export class HttpWhatsAppService {
  static async sendMessage(phoneNumber: string, message: string, orderId?: number): Promise<void> {
    try {
      await axios.post(`${messagesApi}/api/messages`, { phoneNumber, message, orderId }, getAuthHeaders());
    } catch (error: any) {
      console.error(`[HttpWhatsAppService] failed: ${error.message}`);
    }
  }
}
