import { axios, getAuthHeaders } from "./HttpUtils";

const mailsApi = process.env.MICROSERVICES_MAILS_API || "http://localhost:5008";

export class HttpEmailService {
  static async sendEmail(toEmail: string, subject: string, body: string, emailType: string): Promise<void> {
    try {
      await axios.post(`${mailsApi}/api/mails`, { toEmail, subject, body, emailType }, getAuthHeaders());
    } catch (error: any) {
      console.error(`[HttpEmailService] Failed to send email: ${error.message}`);
    }
  }
}
