import { IEmailProvider } from "./interfaces/IEmailProvider";
import { emailConfig } from "../core/config/emailConfig";

export class BrevoEmailProvider implements IEmailProvider {
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": emailConfig.brevoApiKey,
        },
        body: JSON.stringify({
          sender: { email: emailConfig.fromEmail, name: emailConfig.fromName },
          to: [{ email: to }],
          subject,
          htmlContent: body,
        }),
      });
      return response.ok;
    } catch (error) {
      console.error("Brevo send error:", error);
      return false;
    }
  }
}
