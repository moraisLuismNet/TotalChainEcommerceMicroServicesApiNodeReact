import axios from "axios";
import { getAuthHeaders } from "./HttpUtils";

const MAILS_API = process.env.MICROSERVICES_MAILS_API || "http://localhost:5008";

export class HttpMailsService {
  static async sendEmail(toEmail: string, subject: string, body: string, emailType: string, orderId?: number): Promise<void> {
    try {
      await axios.post(`${MAILS_API}/api/mails`, { toEmail, subject, body, emailType, orderId }, getAuthHeaders());
    } catch (error: any) {
      console.error(`[HttpMailsService] failed: ${error.message}`);
    }
  }
}
