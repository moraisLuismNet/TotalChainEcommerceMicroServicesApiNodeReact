import axios from "axios";
import { getAuthHeaders } from "./HttpUtils";

const BASE_URL = process.env.MICROSERVICES_MESSAGES_API || "http://localhost:5009";

export class HttpWhatsAppService {
  async scheduleNotifications(phoneNumber: string, orderId: number, customerName: string): Promise<void> {
    const now = new Date();
    const delays = [0, 1, 2];
    const messages = [
      `Hello ${customerName}, your order #${orderId} is out for delivery!`,
      `Hello ${customerName}, your order #${orderId} is in transit!`,
      `Hello ${customerName}, your order #${orderId} has been delivered! Enjoy your purchase!`,
    ];

    for (let i = 0; i < delays.length; i++) {
      const scheduledAt = new Date(now.getTime() + delays[i] * 60 * 1000);
      try {
        await axios.post(`${BASE_URL}/api/messages`, {
          phoneNumber,
          message: messages[i],
          orderId,
          scheduledAt,
        }, getAuthHeaders());
      } catch (error: any) {
        console.error(`[HttpWhatsAppService] failed to schedule message: ${error.message}`);
      }
    }
  }
}

export default new HttpWhatsAppService();
